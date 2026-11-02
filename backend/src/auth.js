import crypto from 'node:crypto';
import pool from './db.js';

const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const COOKIE_NAME = '__Secure-lmt_session';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_TTL_MS = 4 * 60 * 60 * 1000;

export function signSession(payload = {}) {
  const data = { ts: Date.now(), ...payload };
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifySession(value) {
  if (!value) return null;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');
  if (!safeEqual(sig, expected)) return null;
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
  if (!parsed || typeof parsed.ts !== 'number') return null;
  if (Date.now() - parsed.ts > SESSION_TTL_MS) return null;
  return parsed;
}

export function sessionCookie(value) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0`;
}

export function readSessionCookie(req) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === COOKIE_NAME) return verifySession(rest.join('='));
  }
  return null;
}

// Async middleware: checks server-side session revocation and session versioning.
// Apply after requireAdmin/requireStaff on routes that need session invalidation.
export async function enforceSessionRevocation(req, res, next) {
  const session = readSessionCookie(req);
  if (!session) return next();

  try {
    // Revocation check
    const hash = crypto.createHash('sha256').update(req.headers.cookie || '').digest('hex');
    const result = await pool.query('SELECT 1 FROM revoked_sessions WHERE token_hash = $1', [hash]);
    if (result.rows.length > 0) {
      return res.status(401).json({ error: 'session revoked' });
    }

    // Session versioning: reject if user's session_version has changed
    if (session.userId && session.sessionVersion !== undefined) {
      const userResult = await pool.query('SELECT session_version FROM users WHERE id = $1', [session.userId]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'session invalid' });
      }
      if (userResult.rows[0].session_version !== session.sessionVersion) {
        return res.status(401).json({ error: 'session invalid' });
      }
    }
  } catch {
    // If DB is unavailable, fail closed
    return res.status(500).json({ error: 'internal error' });
  }

  next();
}

export async function revokeSession(sessionValue) {
  const hash = crypto.createHash('sha256').update(sessionValue).digest('hex');
  await pool.query(
    'INSERT INTO revoked_sessions (token_hash) VALUES ($1) ON CONFLICT (token_hash) DO NOTHING',
    [hash],
  );
}

export function requireAdmin(req, res, next) {
  const session = readSessionCookie(req);
  if (!session || session.userRole !== 'admin') {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

export function requireStaff(req, res, next) {
  const session = readSessionCookie(req);
  if (!session || (session.userRole !== 'admin' && session.userRole !== 'volunteer')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

function safeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function safeCompare(provided, expected) {
  const a = crypto.createHash('sha256').update(String(provided)).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

export function allowedOrigins() {
  return (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

export function originGuard(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    const originHost = origin.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
    const hostName = host.replace(/:\d+$/, '');
    // Only validate Origin header directly — do NOT trust spoofable x-forwarded-host
    if (originHost === hostName || allowedOrigins().includes(origin)) return next();
  }
  if (origin && !allowedOrigins().includes(origin)) {
    return res.status(403).json({ error: 'origin not allowed' });
  }
  next();
}

export function issueCsrfToken() {
  return crypto.randomBytes(16).toString('hex');
}

export function csrfCookie(token) {
  return `${CSRF_COOKIE_NAME}=${token}; Path=/; SameSite=None; Secure; Max-Age=${CSRF_TTL_MS / 1000}`;
}

export function clearCsrfCookie() {
  return `${CSRF_COOKIE_NAME}=; Path=/; SameSite=None; Secure; Max-Age=0`;
}

export function verifyCsrfToken(req) {
  const cookieHeader = req.headers.cookie || '';
  let cookieToken = null;
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === CSRF_COOKIE_NAME) cookieToken = rest.join('=');
  }
  const headerToken = req.headers['x-csrf-token'];
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) return false;
  return true;
}

// CSRF middleware: require X-CSRF-Token header matching csrf_token cookie on state-changing methods
export function csrfProtection(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const cookieHeader = req.headers.cookie || '';
  let cookieToken = null;
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === CSRF_COOKIE_NAME) cookieToken = rest.join('=');
  }
  const headerToken = req.headers['x-csrf-token'];
  if (!cookieToken) {
    // First visit: issue a csrf_token cookie so the double-submit pattern can work on public routes.
    const newToken = issueCsrfToken();
    res.setHeader('Set-Cookie', csrfCookie(newToken));
    return next();
  }
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    return res.status(403).json({ error: 'csrf token required' });
  }
  next();
}

class RateLimiter {
  constructor() {
    this.buckets = new Map();
  }

  hit(key, windowMs, limit) {
    const now = Date.now();
    const bucket = this.buckets.get(key) || [];
    const fresh = bucket.filter((t) => now - t < windowMs);
    if (fresh.length >= limit) {
      this.buckets.set(key, fresh);
      return { allowed: false, retryAfter: Math.ceil((windowMs - (now - fresh[0])) / 1000) };
    }
    fresh.push(now);
    this.buckets.set(key, fresh);
    return { allowed: true };
  }
}

const limiter = new RateLimiter();

export function clientIp(req) {
  // Use req.ip (populated by Express trust proxy) instead of reading x-forwarded-for directly.
  // This defeats IP spoofing via the x-forwarded-for header.
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function limit({ key, windowMs, limit }) {
  return (req, res, next) => {
    const result = limiter.hit(key, windowMs, limit);
    if (!result.allowed) {
      return res.status(429).json({ error: 'rate limited', retryAfter: result.retryAfter });
    }
    next();
  };
}

export function limitSubscribe(req, res, next) {
  const ip = clientIp(req);
  const email = String(req.body?.email || '').trim().toLowerCase();
  const pair = limiter.hit(`sub:${ip}:${email}`, 10 * 60 * 1000, 5);
  if (!pair.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: pair.retryAfter });
  const daily = limiter.hit(`subday:${email}`, 24 * 60 * 60 * 1000, 3);
  if (!daily.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: daily.retryAfter });
  next();
}

export function limitMessage(req, res, next) {
  const ip = clientIp(req);
  const email = String(req.body?.email || '').trim().toLowerCase();
  const pair = limiter.hit(`msg:${ip}:${email}`, 10 * 60 * 1000, 5);
  if (!pair.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: pair.retryAfter });
  const daily = limiter.hit(`msgday:${email}`, 24 * 60 * 60 * 1000, 3);
  if (!daily.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: daily.retryAfter });
  next();
}

export function limitLogin(req, res, next) {
  const result = limiter.hit(`login:${clientIp(req)}`, 15 * 60 * 1000, 10);
  if (!result.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: result.retryAfter });
  next();
}

export function limitChat(req, res, next) {
  const ip = clientIp(req);
  const start = limiter.hit(`chatstart:${ip}`, 10 * 60 * 1000, 5);
  if (!start.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: start.retryAfter });
  next();
}

export function limitUnsubscribe(req, res, next) {
  const result = limiter.hit(`unsub:${clientIp(req)}`, 15 * 60 * 1000, 10);
  if (!result.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: result.retryAfter });
  next();
}

export function limitSession(req, res, next) {
  const result = limiter.hit(`session:${clientIp(req)}`, 15 * 60 * 1000, 30);
  if (!result.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: result.retryAfter });
  next();
}

export function makeUnsubscribeToken(email, consentAt) {
  const payload = Buffer.from(JSON.stringify({ email, consentAt })).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.UNSUBSCRIBE_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyUnsubscribeToken(token) {
  if (!token) return null;
  const [payload, sig] = String(token).split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', process.env.UNSUBSCRIBE_SECRET).update(payload).digest('base64url');
  if (!safeEqual(sig, expected)) return null;
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
  if (!parsed || typeof parsed.email !== 'string' || typeof parsed.consentAt !== 'string') return null;
  const consent = new Date(parsed.consentAt).getTime();
  if (Number.isNaN(consent)) return null;
  if (Date.now() - consent > 30 * 24 * 60 * 60 * 1000) return null;
  return parsed;
}

export function makeChatToken(chatId, userId) {
  const payload = Buffer.from(JSON.stringify({ chatId: Number(chatId), userId: Number(userId), issuedAt: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.CHAT_TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyChatToken(token, chatId, userId) {
  if (!token) return null;
  const [payload, sig] = String(token).split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', process.env.CHAT_TOKEN_SECRET).update(payload).digest('base64url');
  if (!safeEqual(sig, expected)) return null;
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
  if (!parsed || typeof parsed.chatId !== 'number') return null;
  if (parsed.chatId !== Number(chatId)) return null;
  if (parsed.userId !== undefined && parsed.userId !== Number(userId)) return null;
  if (Date.now() - parsed.issuedAt > 24 * 60 * 60 * 1000) return null;
  return parsed;
}

export function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}