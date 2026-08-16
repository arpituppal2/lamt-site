import crypto from 'node:crypto';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const COOKIE_NAME = 'lamt_session';

export function signSession() {
  const payload = Buffer.from(JSON.stringify({ ts: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
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

export function requireAdmin(req, res, next) {
  if (!readSessionCookie(req)) {
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
    const forwardedHosts = (req.headers['x-forwarded-host'] || '')
      .split(',')
      .map((h) => h.trim().replace(/:\d+$/, ''))
      .filter(Boolean);
    if (originHost === hostName || forwardedHosts.includes(originHost)) return next();
  }
  if (origin && !allowedOrigins().includes(origin)) {
    return res.status(403).json({ error: 'origin not allowed' });
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
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
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
  const daily = limiter.hit(`day:${email}`, 24 * 60 * 60 * 1000, 3);
  if (!daily.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: daily.retryAfter });
  next();
}

export function limitMessage(req, res, next) {
  const ip = clientIp(req);
  const email = String(req.body?.email || '').trim().toLowerCase();
  const pair = limiter.hit(`msg:${ip}:${email}`, 10 * 60 * 1000, 5);
  if (!pair.allowed) return res.status(429).json({ error: 'rate limited', retryAfter: pair.retryAfter });
  const daily = limiter.hit(`day:${email}`, 24 * 60 * 60 * 1000, 3);
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

export function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}