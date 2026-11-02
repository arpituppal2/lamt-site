import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import express from 'express';
import { WebSocketServer } from 'ws';
import pool from './db.js';
import {
  signSession,
  sessionCookie,
  clearCookie,
  readSessionCookie,
  requireAdmin,
  requireStaff,
  enforceSessionRevocation,
  safeCompare,
  allowedOrigins,
  originGuard,
  csrfProtection,
  issueCsrfToken,
  csrfCookie,
  clientIp,
  limitSubscribe,
  limitMessage,
  limitLogin,
  limitChat,
  limitUnsubscribe,
  limitSession,
  makeUnsubscribeToken,
  verifyUnsubscribeToken,
  makeChatToken,
  verifyChatToken,
  tokenHash,
  revokeSession,
} from './auth.js';
import { checkProfanity, hasProfanity } from './profanity.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isConnectionError = (err) =>
  err &&
  (err.code === 'ECONNREFUSED' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'ENOTFOUND' ||
    err.code === '57P03' || // cannot_connect_now
    /the database system is starting up/i.test(err.message) ||
    /connection refused/i.test(err.message) ||
    /connection terminated/i.test(err.message) ||
    /timeout expired when trying to connect/i.test(err.message));

async function withDbRetry(label, fn, { maxAttempts = 8, baseDelay = 1500 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isConnectionError(err) || attempt === maxAttempts) throw err;
      const delay = baseDelay * attempt;
      console.log(`${label} retrying in ${delay}ms (attempt ${attempt}/${maxAttempts}): ${err.message}`);
      await sleep(delay);
    }
  }
  throw lastErr;
}

// ---------- In-memory response cache (TTL-based) ----------

const cache = new Map();

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function cacheSet(key, value, ttlMs) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function cacheInvalidate(prefix) {
  for (const k of cache.keys()) {
    if (k.startsWith(prefix)) cache.delete(k);
  }
}

const CACHE_TTL = {
  schedule: 5 * 60 * 1000,   // 5 minutes
  announcements: 5 * 60 * 1000,
  settings: 5 * 60 * 1000,
  health: 30 * 1000,         // 30 seconds
};

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.set('trust proxy', 2);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '600');
    return res.sendStatus(204);
  }
  next();
});

app.use(originGuard);

// Hand every client a csrf_token cookie on a safe request, so /live (which GETs
// /schedule, /announcements, /settings on mount) holds one before its first POST
// and csrfProtection can do a real double-submit check instead of the first-visit
// fallback. Clients read it from document.cookie and echo it in X-CSRF-Token.
// ponytail: these responses now carry Set-Cookie, so a shared cache will skip them;
// server-side cacheGet still serves them. Move to a GET /csrf endpoint if that matters.
app.use((req, res, next) => {
  if (
    (req.method === 'GET' || req.method === 'HEAD') &&
    !/(?:^|;\s*)csrf_token=/.test(req.headers.cookie || '')
  ) {
    res.setHeader('Set-Cookie', csrfCookie(issueCsrfToken()));
  }
  next();
});

// Security headers: CSP, frame-ancestors, X-Content-Type-Options, HSTS
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; frame-ancestors 'none'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';",
  );
  next();
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

app.get('/health', (req, res) => {
  const cached = cacheGet('health');
  if (cached) return res.json(cached);
  const body = { ok: true };
  cacheSet('health', body, CACHE_TTL.health);
  res.setHeader('Cache-Control', 'public, max-age=30');
  return res.json(body);
});

app.post('/subscribe', limitSubscribe, csrfProtection, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!validateEmail(email)) return res.status(400).json({ error: 'invalid email' });
  if (hasProfanity(email)) return res.status(400).json({ error: 'invalid email' });
  try {
    const result = await withDbRetry('subscribe', async () => {
      const existing = await pool.query('SELECT id, unsubscribed_at FROM subscribers WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        if (row.unsubscribed_at) {
          await pool.query(
            'UPDATE subscribers SET unsubscribed_at = NULL, consent_at = now() WHERE id = $1',
            [row.id],
          );
          return { status: 'back' };
        }
        return { status: 'already' };
      }
      const inserted = await pool.query(
        'INSERT INTO subscribers (email, consent_at) VALUES ($1, now()) RETURNING id',
        [email],
      );
      return { status: 'ok', id: inserted.rows[0].id };
    });
    return res.json(result);
  } catch (err) {
    console.error('subscribe error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/unsubscribe', limitUnsubscribe, csrfProtection, async (req, res) => {
  const token = req.body?.token;
  const parsed = verifyUnsubscribeToken(token);
  if (!parsed) return res.status(400).json({ error: 'invalid token' });
  try {
    const hash = tokenHash(token);
    const used = await pool.query('SELECT 1 FROM used_unsubscribe_tokens WHERE token_hash = $1', [hash]);
    if (used.rows.length > 0) return res.json({ status: 'ok' });
    const row = await pool.query(
      'UPDATE subscribers SET unsubscribed_at = now() WHERE email = $1 AND unsubscribed_at IS NULL RETURNING id',
      [parsed.email],
    );
    await pool.query('INSERT INTO used_unsubscribe_tokens (token_hash) VALUES ($1)', [hash]);
    return res.json({ status: row.rows.length > 0 ? 'unsubscribed' : 'not_subscribed' });
  } catch (err) {
    console.error('unsubscribe error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/subscribers', requireAdmin, limitSession, enforceSessionRevocation, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, consent_at, unsubscribed_at FROM subscribers ORDER BY consent_at DESC, id DESC',
    );
    return res.json({ subscribers: result.rows });
  } catch (err) {
    console.error('subscribers error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/announcements', async (req, res) => {
  const cached = cacheGet('announcements');
  if (cached) {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return res.json(cached);
  }
  try {
    const result = await pool.query('SELECT id, title, body, priority, created_at FROM announcements ORDER BY created_at DESC, id DESC');
    const body = { announcements: result.rows };
    cacheSet('announcements', body, CACHE_TTL.announcements);
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return res.json(body);
  } catch (err) {
    console.error('announcements error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/announcements', requireAdmin, csrfProtection, async (req, res) => {
  const { title, body, priority = 'normal' } = req.body || {};
  if (typeof body !== 'string' || body.trim() === '') return res.status(400).json({ error: 'body required' });
  if (hasProfanity(body) || (typeof title === 'string' && hasProfanity(title)))
    return res.status(400).json({ error: 'profanity not allowed' });
  try {
    const result = await pool.query(
      'INSERT INTO announcements (title, body, priority) VALUES ($1, $2, $3) RETURNING id, title, body, priority, created_at',
      [typeof title === 'string' ? title : null, body, priority],
    );
    cacheInvalidate('announcements');
    return res.status(201).json({ announcement: result.rows[0] });
  } catch (err) {
    console.error('announcement create error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/announcements/:id', requireAdmin, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const { title, body } = req.body || {};
  if (typeof title !== 'string' && typeof body !== 'string') {
    return res.status(400).json({ error: 'title or body required' });
  }
  if (typeof body === 'string' && body.trim() === '') {
    return res.status(400).json({ error: 'body cannot be empty' });
  }
  try {
    const existing = await pool.query('SELECT title, body FROM announcements WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const current = existing.rows[0];
    const nextTitle = typeof title === 'string' ? (title.trim() === '' ? null : title) : current.title;
    const nextBody = typeof body === 'string' ? body : current.body;
    const result = await pool.query(
      'UPDATE announcements SET title = $1, body = $2 WHERE id = $3 RETURNING id, title, body, priority, created_at',
      [nextTitle, nextBody, id],
    );
    cacheInvalidate('announcements');
    return res.json({ announcement: result.rows[0] });
  } catch (err) {
    console.error('announcement update error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/announcements/:id', requireAdmin, csrfProtection, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    cacheInvalidate('announcements');
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('announcement delete error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/schedule', async (req, res) => {
  const cached = cacheGet('schedule');
  if (cached) {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return res.json(cached);
  }
  try {
    const result = await pool.query(
      'SELECT id, time, "end", event, location, original_time, adjustment_reason, position FROM schedule_items ORDER BY position, id',
    );
    const body = { schedule: result.rows };
    cacheSet('schedule', body, CACHE_TTL.schedule);
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return res.json(body);
  } catch (err) {
    console.error('schedule error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/schedule', requireAdmin, csrfProtection, async (req, res) => {
  const { time, end, event, location } = req.body || {};
  if (!time || !end || !event || !location) return res.status(400).json({ error: 'time, end, event, location required' });
  try {
    const result = await pool.query(
      'INSERT INTO schedule_items (time, "end", event, location, position) VALUES ($1, $2, $3, $4, (SELECT COALESCE(MAX(position), 0) + 1 FROM schedule_items)) RETURNING id, time, "end", event, location, original_time, adjustment_reason, position',
      [time, end, event, location],
    );
    cacheInvalidate('schedule');
    return res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error('schedule create error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/schedule/:id', requireAdmin, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const { time, end, event, location, adjustmentReason, position } = req.body || {};
  try {
    const existing = await pool.query('SELECT * FROM schedule_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const current = existing.rows[0];
    const timeChanged = time !== undefined && time !== current.time;
    const endChanged = end !== undefined && end !== current.end;
    if ((timeChanged || endChanged) && (!adjustmentReason || String(adjustmentReason).trim() === '')) {
      return res.status(400).json({ error: 'adjustmentReason required when changing times' });
    }
    const next = {
      time: time !== undefined ? time : current.time,
      end: end !== undefined ? end : current.end,
      event: event !== undefined ? event : current.event,
      location: location !== undefined ? location : current.location,
      original_time: adjustmentReason ? current.original_time || current.time : current.original_time,
      adjustment_reason: adjustmentReason !== undefined ? adjustmentReason : current.adjustment_reason,
      position: position !== undefined ? position : current.position,
    };
    const result = await pool.query(
      `UPDATE schedule_items
       SET time = $1, "end" = $2, event = $3, location = $4, original_time = $5, adjustment_reason = $6, position = $7
       WHERE id = $8
       RETURNING id, time, "end", event, location, original_time, adjustment_reason, position`,
      [next.time, next.end, next.event, next.location, next.original_time, next.adjustment_reason, next.position, id],
    );
    cacheInvalidate('schedule');
    return res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('schedule update error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/schedule/:id', requireAdmin, csrfProtection, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM schedule_items WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    cacheInvalidate('schedule');
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('schedule delete error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/schedule/reorder', requireAdmin, csrfProtection, async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order) || order.some((item) => typeof item.id !== 'number' || typeof item.position !== 'number')) {
    return res.status(400).json({ error: 'order must be an array of { id, position }' });
  }
  try {
    await pool.query('BEGIN');
    for (const { id, position } of order) {
      await pool.query('UPDATE schedule_items SET position = $1 WHERE id = $2', [position, id]);
    }
    await pool.query('COMMIT');
    cacheInvalidate('schedule');
    return res.json({ status: 'reordered' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('schedule reorder error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/messages', requireAdmin, limitSession, enforceSessionRevocation, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, message, resolved, replies, created_at FROM messages ORDER BY created_at DESC');
    return res.json({ messages: result.rows });
  } catch (err) {
    console.error('messages error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/messages', limitMessage, csrfProtection, async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !validateEmail(email) || !message) return res.status(400).json({ error: 'name, valid email, message required' });
  if (hasProfanity(name) || hasProfanity(message)) return res.status(400).json({ error: 'profanity not allowed' });
  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [String(name), String(email).trim().toLowerCase(), String(message)],
    );
    return res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('message create error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/messages/:id', requireAdmin, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const body = req.body || {};
  try {
    const existing = await pool.query('SELECT resolved, replies FROM messages WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const current = existing.rows[0];

    if (body.resolved !== undefined) {
      if (typeof body.resolved !== 'boolean') return res.status(400).json({ error: 'resolved must be boolean' });
      await pool.query('UPDATE messages SET resolved = $1 WHERE id = $2', [body.resolved, id]);
      return res.json({ status: 'updated' });
    }

    if (body.reply) {
      if (typeof body.reply.body !== 'string' || body.reply.body.trim() === '') {
        return res.status(400).json({ error: 'reply.body required' });
      }
      const replies = current.replies || [];
      const updated = [
        ...replies,
        { id: crypto.randomUUID(), body: String(body.reply.body), timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) },
      ];
      await pool.query('UPDATE messages SET replies = $1 WHERE id = $2', [JSON.stringify(updated), id]);
      return res.json({ status: 'updated' });
    }

    return res.status(400).json({ error: 'resolved or reply required' });
  } catch (err) {
    console.error('message update error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

// ---------- Live Chat ----------

function serializeChat(row, messages = []) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    status: row.status,
    createdAt: row.created_at,
    claimedAt: row.claimed_at,
    closedAt: row.closed_at,
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      body: m.body,
      createdAt: m.created_at,
    })),
  };
}

async function computePosition(pool, chatId) {
  const chat = await pool.query('SELECT status FROM live_chats WHERE id = $1', [chatId]);
  if (chat.rows.length === 0) return 0;
  if (chat.rows[0].status !== 'waiting') return 0;
  const result = await pool.query(
    "SELECT COUNT(*)::int AS pos FROM live_chats WHERE status = 'waiting' AND id <= $1",
    [chatId],
  );
  return result.rows[0].pos;
}

app.post('/chat/start', limitChat, csrfProtection, async (req, res) => {
  const { name, email } = req.body || {};
  if (!name || String(name).trim() === '') return res.status(400).json({ error: 'name required' });
  if (email && !validateEmail(email)) return res.status(400).json({ error: 'invalid email' });
  if (hasProfanity(name) || (email && hasProfanity(email))) return res.status(400).json({ error: 'profanity not allowed' });

  // Bind chat token to logged-in user if present (admin/volunteer starting a chat)
  let userId = null;
  const session = readSessionCookie(req);
  if (session) userId = session.userId;

  try {
    const inserted = await pool.query(
      'INSERT INTO live_chats (name, email) VALUES ($1, $2) RETURNING id, name, email, status, created_at, claimed_at, closed_at',
      [String(name).trim().slice(0, 100), email ? String(email).trim().slice(0, 200) : null],
    );
    const chat = inserted.rows[0];
    const position = await computePosition(pool, chat.id);
    const chatToken = makeChatToken(chat.id, userId);
    // Append, don't overwrite: csrfProtection may have just issued csrf_token in this same response.
    const priorCookies = res.getHeader('Set-Cookie');
    res.setHeader('Set-Cookie', [
      ...(priorCookies ? [].concat(priorCookies) : []),
      `lamt_chat_token=${chatToken}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${24 * 60 * 60}`,
    ]);
    return res.status(201).json({ chat: serializeChat(chat, []), position });
  } catch (err) {
    console.error('chat start error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/chat/:id', limitChat, async (req, res) => {
  const id = req.params.id;
  // Read chat token from HttpOnly cookie (not query string)
  let chatToken = '';
  const cookieHeader = req.headers.cookie || '';
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === 'lamt_chat_token') chatToken = rest.join('=');
  }
  const session = readSessionCookie(req);
  const userId = session ? session.userId : null;
  if (!verifyChatToken(chatToken, id, userId)) return res.status(401).json({ error: 'invalid or missing chat token' });
  try {
    const chatRes = await pool.query(
      'SELECT id, name, email, status, created_at, claimed_at, closed_at FROM live_chats WHERE id = $1',
      [id],
    );
    if (chatRes.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const msgRes = await pool.query(
      'SELECT id, sender, body, created_at FROM live_chat_messages WHERE chat_id = $1 ORDER BY id ASC',
      [id],
    );
    const position = await computePosition(pool, Number(id));
    return res.json({ chat: serializeChat(chatRes.rows[0], msgRes.rows), position });
  } catch (err) {
    console.error('chat get error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id', limitChat, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const { body } = req.body || {};
  if (typeof body !== 'string' || body.trim() === '') return res.status(400).json({ error: 'body required' });

  // Verify chat token from HttpOnly cookie
  let chatToken = '';
  const cookieHeader = req.headers.cookie || '';
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === 'lamt_chat_token') chatToken = rest.join('=');
  }
  const session = readSessionCookie(req);
  const userId = session ? session.userId : null;
  if (!verifyChatToken(chatToken, id, userId)) return res.status(401).json({ error: 'invalid or missing chat token' });

  try {
    const chatRes = await pool.query('SELECT status FROM live_chats WHERE id = $1', [id]);
    if (chatRes.rows.length === 0) return res.status(404).json({ error: 'not found' });
    if (chatRes.rows[0].status === 'closed') return res.status(400).json({ error: 'chat closed' });
    await pool.query(
      'INSERT INTO live_chat_messages (chat_id, sender, body) VALUES ($1, $2, $3) RETURNING id',
      [id, 'user', String(body).trim().slice(0, 2000)],
    );
    broadcastChat(Number(id), { type: 'message', chatId: Number(id), sender: 'user', body, createdAt: new Date().toISOString() });
    return res.json({ status: 'sent' });
  } catch (err) {
    console.error('chat send error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/chats', requireStaff, limitSession, enforceSessionRevocation, async (req, res) => {
  try {
    const waitingRes = await pool.query(
      "SELECT id, name, email, status, created_at, claimed_at, closed_at FROM live_chats WHERE status = 'waiting' ORDER BY created_at ASC",
    );
    const activeRes = await pool.query(
      "SELECT id, name, email, status, created_at, claimed_at, closed_at FROM live_chats WHERE status = 'active' ORDER BY claimed_at DESC",
    );
    const ids = [...waitingRes.rows, ...activeRes.rows].map((r) => r.id);
    let messagesByChat = {};
    if (ids.length > 0) {
      const msgRes = await pool.query(
        'SELECT chat_id, id, sender, body, created_at FROM live_chat_messages WHERE chat_id = ANY($1) ORDER BY id ASC',
        [ids],
      );
      messagesByChat = msgRes.rows.reduce((acc, m) => {
        (acc[m.chat_id] = acc[m.chat_id] || []).push({ id: m.id, sender: m.sender, body: m.body, createdAt: m.created_at });
        return acc;
      }, {});
    }
    const queue = waitingRes.rows.map((r, i) => ({
      ...serializeChat(r, messagesByChat[r.id] || []),
      position: i + 1,
    }));
    const active = activeRes.rows.map((r) => serializeChat(r, messagesByChat[r.id] || []));
    return res.json({ waitingCount: queue.length, queue, active });
  } catch (err) {
    console.error('chats list error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id/claim', requireStaff, csrfProtection, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE live_chats SET status = 'active', claimed_at = now() WHERE id = $1 AND status = 'waiting' RETURNING id",
      [id],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found or already claimed' });
    broadcastChat(Number(id), { type: 'chat_status_changed', chatId: Number(id), status: 'active' });
    return res.json({ status: 'claimed' });
  } catch (err) {
    console.error('chat claim error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id/staff', requireStaff, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const { body } = req.body || {};
  if (typeof body !== 'string' || body.trim() === '') return res.status(400).json({ error: 'body required' });
  try {
    const chatRes = await pool.query('SELECT status FROM live_chats WHERE id = $1', [id]);
    if (chatRes.rows.length === 0) return res.status(404).json({ error: 'not found' });
    if (chatRes.rows[0].status === 'closed') return res.status(400).json({ error: 'chat closed' });
    await pool.query(
      'INSERT INTO live_chat_messages (chat_id, sender, body) VALUES ($1, $2, $3) RETURNING id',
      [id, 'staff', String(body).trim().slice(0, 2000)],
    );
    await pool.query("UPDATE live_chats SET status = 'active', claimed_at = COALESCE(claimed_at, now()) WHERE id = $1 AND status = 'waiting'", [id]);
    broadcastChat(Number(id), { type: 'message', chatId: Number(id), sender: 'staff', body, createdAt: new Date().toISOString() });
    return res.json({ status: 'sent' });
  } catch (err) {
    console.error('chat staff send error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id/close', requireStaff, csrfProtection, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE live_chats SET status = 'closed', closed_at = now() WHERE id = $1 AND status <> 'closed' RETURNING id",
      [id],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    broadcastChat(Number(id), { type: 'chat_status_changed', chatId: Number(id), status: 'closed' });
    return res.json({ status: 'closed' });
  } catch (err) {
    console.error('chat close error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

// ---------- Settings (tournament date, etc.) ----------

app.get('/settings', async (req, res) => {
  const cached = cacheGet('settings');
  if (cached) {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return res.json(cached);
  }
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const settings = {};
    for (const row of result.rows) settings[row.key] = row.value;
    const body = { settings };
    cacheSet('settings', body, CACHE_TTL.settings);
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return res.json(body);
  } catch (err) {
    console.error('settings get error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/settings', requireAdmin, csrfProtection, async (req, res) => {
  const entries = req.body || {};
  if (typeof entries !== 'object' || Array.isArray(entries)) {
    return res.status(400).json({ error: 'object required' });
  }
  const allowed = [
    'tournament_date',
    'tournament_name',
    'registration_deadline',
    'register_enabled',
    'register_url',
    'site_mode', // offseason | tournament (countdown + live day)
  ];
  try {
    const updated = {};
    for (const key of Object.keys(entries)) {
      if (!allowed.includes(key)) continue;
      const value = String(entries[key]);
      await pool.query(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
        [key, value],
      );
      updated[key] = value;
    }
    cacheInvalidate('settings');
    return res.json({ status: 'updated', updated });
  } catch (err) {
    console.error('settings update error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

// ---------- Team Management ----------

app.get('/admin/users', requireAdmin, limitSession, enforceSessionRevocation, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, role, permanent, created_at FROM users ORDER BY role DESC, name ASC',
    );
    return res.json({ users: result.rows });
  } catch (err) {
    console.error('users list error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/admin/users', requireAdmin, csrfProtection, async (req, res) => {
  const { name } = req.body || {};
  if (!name || String(name).trim() === '') return res.status(400).json({ error: 'name required' });
  if (hasProfanity(String(name))) return res.status(400).json({ error: 'profanity not allowed' });
  try {
    const result = await pool.query(
      'INSERT INTO users (name, role) VALUES ($1, $2) RETURNING id, name, role, permanent, created_at',
      [String(name).trim().slice(0, 100), 'volunteer'],
    );
    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'name already exists' });
    console.error('user create error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/admin/users/:id', requireAdmin, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const { role, permanent } = req.body || {};
  const session = readSessionCookie(req);
  if (session && Number(session.userId) === Number(id)) {
    if (role && role !== 'admin') {
      return res.status(403).json({ error: 'cannot change your own role away from admin' });
    }
  }
  // Validate role against allowed values
  if (role !== undefined && !['admin', 'volunteer', 'off'].includes(role)) {
    return res.status(400).json({ error: 'invalid role' });
  }
  try {
    const existing = await pool.query('SELECT permanent, session_version FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
    if (existing.rows[0].permanent && permanent === false) {
      return res.status(403).json({ error: 'cannot remove permanent status' });
    }
    // Block demoting permanent users (Arpit Uppal, Vicky Zhang)
    if (existing.rows[0].permanent && role && role !== 'admin') {
      return res.status(403).json({ error: 'cannot demote permanent user' });
    }
    const newVersion = (existing.rows[0].session_version || 0) + (role || permanent !== undefined ? 1 : 0);
    const result = await pool.query(
      'UPDATE users SET role = COALESCE($1, role), permanent = COALESCE($2, permanent), session_version = $3 WHERE id = $4 RETURNING id, name, role, permanent, created_at',
      [role, permanent, newVersion, id],
    );
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('user update error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/admin/users/:id', requireAdmin, csrfProtection, async (req, res) => {
  const id = req.params.id;
  const session = readSessionCookie(req);
  if (session && Number(session.userId) === Number(id)) {
    return res.status(403).json({ error: 'cannot delete yourself' });
  }
  try {
    const existing = await pool.query('SELECT permanent FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
    if (existing.rows[0].permanent) return res.status(403).json({ error: 'cannot delete permanent user' });
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('user delete error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/session', limitSession, (req, res) => {
  const session = readSessionCookie(req);
  // Issue the csrf_token cookie on the login-page GET too, so POST /login's double-submit check is enforceable.
  res.setHeader('Set-Cookie', csrfCookie(issueCsrfToken()));
  if (!session) return res.status(401).json({ authed: false });
  return res.json({ authed: true, user: { id: session.userId, name: session.userName, role: session.userRole } });
});

app.post('/login', limitLogin, csrfProtection, async (req, res) => {
  const { password, name } = req.body || {};
  if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD || '')) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  if (!name || String(name).trim() === '') {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  try {
    const result = await pool.query('SELECT id, name, role, session_version FROM users WHERE name = $1', [String(name).trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const user = result.rows[0];
    if (user.role === 'off') {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const sessionValue = signSession({ userId: user.id, userName: user.name, userRole: user.role, sessionVersion: user.session_version });
    const csrfToken = issueCsrfToken();
    res.setHeader('Set-Cookie', [sessionCookie(sessionValue), csrfCookie(csrfToken)]);
    return res.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('login error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/logout', csrfProtection, async (req, res) => {
  try {
    const session = readSessionCookie(req);
    if (session) {
      const cookieHeader = req.headers.cookie || '';
      for (const part of cookieHeader.split(';')) {
        const [name, ...rest] = part.trim().split('=');
        if (name === COOKIE_NAME) {
          await revokeSession(rest.join('='));
          break;
        }
      }
    }
  } catch {}
  res.setHeader('Set-Cookie', clearCookie());
  return res.json({ ok: true });
});

app.delete('/messages/:id', requireAdmin, csrfProtection, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('message delete error', err.message);
    return res.status(500).json({ error: 'internal error' });
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'out');

const SCHEMA_PATH = path.join(__dirname, '..', 'schema.sql');

async function waitForDatabase(maxAttempts = 30, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log(`Database ready after ${attempt} attempt${attempt === 1 ? '' : 's'}`);
      return true;
    } catch (err) {
      console.log(`Database not ready (attempt ${attempt}/${maxAttempts}): ${err.message}`);
      if (attempt < maxAttempts) await sleep(delayMs);
    }
  }
  console.error('Database never became ready');
  return false;
}

async function runMigrations() {
  try {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    const statements = schema
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));
    for (const stmt of statements) {
      try {
        await pool.query(stmt + ';');
      } catch (stmtErr) {
        console.error('Schema statement failed:', stmtErr.message, '— SQL:', stmt.slice(0, 80));
      }
    }
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Schema migration failed:', err.message);
  }
}

app.use(express.static(OUT_DIR, { extensions: ['html'], index: 'index.html' }));

app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

const port = process.env.PORT || 3000;

function validateSecrets() {
  const required = ['DATABASE_URL', 'SESSION_SECRET', 'ADMIN_PASSWORD', 'UNSUBSCRIBE_SECRET', 'CHAT_TOKEN_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateSecrets();

waitForDatabase()
  .then((ready) => (ready ? runMigrations() : Promise.resolve()))
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`LAMT backend listening on port ${port}`);
    });

    // ---------- WebSocket server for live chat ----------

    const wsConnections = new Map(); // ip -> active connection count
    const WS_MAX_CONNECTIONS = 10;

    const wss = new WebSocketServer({ server, path: '/ws/chat' });
    const chatClients = new Map(); // chatId -> Set of WebSocket clients

    wss.on('connection', (ws, req) => {
      try {
        // Per-IP WebSocket connection rate limit
        const ip = clientIp(req);
        const count = (wsConnections.get(ip) || 0) + 1;
        if (count > WS_MAX_CONNECTIONS) {
          ws.close(4029, 'rate limited');
          return;
        }
        wsConnections.set(ip, count);
        ws.on('close', () => {
          wsConnections.set(ip, Math.max(0, (wsConnections.get(ip) || 1) - 1));
          if (wsConnections.get(ip) === 0) wsConnections.delete(ip);
        });

        const url = new URL(req.url, `http://${req.headers.host}`);
        const chatId = url.searchParams.get('chatId');
        if (!chatId) {
          ws.close(4001, 'missing chat id');
          return;
        }

        // Read chat token from HttpOnly cookie (browser sends it automatically with WS)
        let chatToken = '';
        const cookieHeader = req.headers.cookie || '';
        for (const part of cookieHeader.split(';')) {
          const [name, ...rest] = part.trim().split('=');
          if (name === 'lamt_chat_token') chatToken = rest.join('=');
        }
        const session = readSessionCookie(req);
        const userId = session ? session.userId : null;
        if (!chatToken || !verifyChatToken(chatToken, Number(chatId), userId)) {
          ws.close(4001, 'invalid or missing chat token');
          return;
        }

        const id = Number(chatId);
        if (!chatClients.has(id)) chatClients.set(id, new Set());
        chatClients.get(id).add(ws);
        ws.on('close', () => {
          const clients = chatClients.get(id);
          if (clients) {
            clients.delete(ws);
            if (clients.size === 0) chatClients.delete(id);
          }
        });
        ws.on('error', () => {});
      } catch {
        ws.close(4001, 'invalid request');
      }
    });

    function broadcastChat(chatId, data) {
      const clients = chatClients.get(chatId);
      if (!clients) return;
      const message = JSON.stringify(data);
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    }
  })
  .catch((err) => console.error('Startup error', err));