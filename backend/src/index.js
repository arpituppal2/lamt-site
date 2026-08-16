import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import pool from './db.js';
import {
  signSession,
  sessionCookie,
  clearCookie,
  readSessionCookie,
  requireAdmin,
  safeCompare,
  allowedOrigins,
  originGuard,
  limitSubscribe,
  limitMessage,
  limitLogin,
  limitChat,
  limitUnsubscribe,
  makeUnsubscribeToken,
  verifyUnsubscribeToken,
  tokenHash,
} from './auth.js';

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/subscribe', limitSubscribe, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!validateEmail(email)) return res.status(400).json({ error: 'invalid email' });
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
    console.error('subscribe error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/unsubscribe', limitUnsubscribe, async (req, res) => {
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
    console.error('unsubscribe error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/subscribers', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, consent_at, unsubscribed_at FROM subscribers ORDER BY consent_at DESC, id DESC',
    );
    return res.json({ subscribers: result.rows });
  } catch (err) {
    console.error('subscribers error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/subscribers/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM subscribers WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('subscriber delete error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/announcements', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, body, priority, created_at FROM announcements ORDER BY created_at DESC, id DESC');
    return res.json({ announcements: result.rows });
  } catch (err) {
    console.error('announcements error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/announcements', requireAdmin, async (req, res) => {
  const { title, body, priority = 'normal' } = req.body || {};
  if (typeof body !== 'string' || body.trim() === '') return res.status(400).json({ error: 'body required' });
  try {
    const result = await pool.query(
      'INSERT INTO announcements (title, body, priority) VALUES ($1, $2, $3) RETURNING id, title, body, priority, created_at',
      [typeof title === 'string' ? title : null, body, priority],
    );
    return res.status(201).json({ announcement: result.rows[0] });
  } catch (err) {
    console.error('announcement create error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/announcements/:id', requireAdmin, async (req, res) => {
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
    return res.json({ announcement: result.rows[0] });
  } catch (err) {
    console.error('announcement update error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/announcements/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('announcement delete error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/schedule', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, time, "end", event, location, original_time, adjustment_reason FROM schedule_items ORDER BY id',
    );
    return res.json({ schedule: result.rows });
  } catch (err) {
    console.error('schedule error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/schedule', requireAdmin, async (req, res) => {
  const { time, end, event, location } = req.body || {};
  if (!time || !end || !event || !location) return res.status(400).json({ error: 'time, end, event, location required' });
  try {
    const result = await pool.query(
      'INSERT INTO schedule_items (time, "end", event, location) VALUES ($1, $2, $3, $4) RETURNING id, time, "end", event, location',
      [time, end, event, location],
    );
    return res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error('schedule create error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/schedule/:id', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const { time, end, event, location, adjustmentReason } = req.body || {};
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
    };
    const result = await pool.query(
      `UPDATE schedule_items
       SET time = $1, "end" = $2, event = $3, location = $4, original_time = $5, adjustment_reason = $6
       WHERE id = $7
       RETURNING id, time, "end", event, location, original_time, adjustment_reason`,
      [next.time, next.end, next.event, next.location, next.original_time, next.adjustment_reason, id],
    );
    return res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('schedule update error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/schedule/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM schedule_items WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('schedule delete error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/messages', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, message, resolved, replies, created_at FROM messages ORDER BY created_at DESC');
    return res.json({ messages: result.rows });
  } catch (err) {
    console.error('messages error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/messages', limitMessage, async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !validateEmail(email) || !message) return res.status(400).json({ error: 'name, valid email, message required' });
  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [String(name), String(email).trim().toLowerCase(), String(message)],
    );
    return res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('message create error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/messages/:id', requireAdmin, async (req, res) => {
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
        { id: Date.now(), body: String(body.reply.body), timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) },
      ];
      await pool.query('UPDATE messages SET replies = $1 WHERE id = $2', [JSON.stringify(updated), id]);
      return res.json({ status: 'updated' });
    }

    return res.status(400).json({ error: 'resolved or reply required' });
  } catch (err) {
    console.error('message update error', err);
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

app.post('/chat/start', limitChat, async (req, res) => {
  const { name, email } = req.body || {};
  if (!name || String(name).trim() === '') return res.status(400).json({ error: 'name required' });
  try {
    const inserted = await pool.query(
      'INSERT INTO live_chats (name, email) VALUES ($1, $2) RETURNING id, name, email, status, created_at, claimed_at, closed_at',
      [String(name).trim().slice(0, 100), email ? String(email).trim().slice(0, 200) : null],
    );
    const chat = inserted.rows[0];
    const position = await computePosition(pool, chat.id);
    return res.status(201).json({ chat: serializeChat(chat, []), position });
  } catch (err) {
    console.error('chat start error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/chat/:id', async (req, res) => {
  const id = req.params.id;
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
    console.error('chat get error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id', limitChat, async (req, res) => {
  const id = req.params.id;
  const { body } = req.body || {};
  if (typeof body !== 'string' || body.trim() === '') return res.status(400).json({ error: 'body required' });
  try {
    const chatRes = await pool.query('SELECT status FROM live_chats WHERE id = $1', [id]);
    if (chatRes.rows.length === 0) return res.status(404).json({ error: 'not found' });
    if (chatRes.rows[0].status === 'closed') return res.status(400).json({ error: 'chat closed' });
    await pool.query(
      'INSERT INTO live_chat_messages (chat_id, sender, body) VALUES ($1, $2, $3) RETURNING id',
      [id, 'user', String(body).trim().slice(0, 2000)],
    );
    return res.json({ status: 'sent' });
  } catch (err) {
    console.error('chat send error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/chats', requireAdmin, async (req, res) => {
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
    console.error('chats list error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id/claim', requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE live_chats SET status = 'active', claimed_at = now() WHERE id = $1 AND status = 'waiting' RETURNING id",
      [id],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found or already claimed' });
    return res.json({ status: 'claimed' });
  } catch (err) {
    console.error('chat claim error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id/staff', requireAdmin, async (req, res) => {
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
    return res.json({ status: 'sent' });
  } catch (err) {
    console.error('chat staff send error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/chat/:id/close', requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE live_chats SET status = 'closed', closed_at = now() WHERE id = $1 AND status <> 'closed' RETURNING id",
      [id],
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ status: 'closed' });
  } catch (err) {
    console.error('chat close error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// ---------- Settings (tournament date, etc.) ----------

app.get('/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const settings = {};
    for (const row of result.rows) settings[row.key] = row.value;
    return res.json({ settings });
  } catch (err) {
    console.error('settings get error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.patch('/settings', requireAdmin, async (req, res) => {
  const entries = req.body || {};
  if (typeof entries !== 'object' || Array.isArray(entries)) {
    return res.status(400).json({ error: 'object required' });
  }
  const allowed = ['tournament_date', 'tournament_name', 'registration_deadline'];
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
    return res.json({ status: 'updated', updated });
  } catch (err) {
    console.error('settings update error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/session', (req, res) => {
  if (readSessionCookie(req)) return res.json({ authed: true });
  return res.status(401).json({ authed: false });
});

app.post('/login', limitLogin, (req, res) => {
  const password = req.body?.password;
  if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD || '')) {
    return res.status(401).json({ error: 'invalid password' });
  }
  res.setHeader('Set-Cookie', sessionCookie(signSession()));
  return res.json({ ok: true });
});

app.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', clearCookie());
  return res.json({ ok: true });
});

app.delete('/messages/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ status: 'deleted' });
  } catch (err) {
    console.error('message delete error', err);
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

waitForDatabase()
  .then((ready) => (ready ? runMigrations() : Promise.resolve()))
  .then(() => {
    app.listen(port, () => {
      console.log(`LAMT backend listening on port ${port}`);
    });
  })
  .catch((err) => console.error('Startup error', err));