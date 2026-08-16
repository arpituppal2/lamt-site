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
  limitUnsubscribe,
  makeUnsubscribeToken,
  verifyUnsubscribeToken,
  tokenHash,
} from './auth.js';

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
    const existing = await pool.query('SELECT id, unsubscribed_at FROM subscribers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      if (row.unsubscribed_at) {
        await pool.query(
          'UPDATE subscribers SET unsubscribed_at = NULL, consent_at = now() WHERE id = $1',
          [row.id],
        );
        return res.json({ status: 'back' });
      }
      return res.json({ status: 'already' });
    }
    const inserted = await pool.query(
      'INSERT INTO subscribers (email, consent_at) VALUES ($1, now()) RETURNING id',
      [email],
    );
    return res.json({ status: 'ok', id: inserted.rows[0].id });
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'out');

const SCHEMA_PATH = path.join(__dirname, '..', 'schema.sql');

async function runMigrations() {
  try {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    await pool.query(schema);
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

runMigrations().then(() => {
  app.listen(port, () => {
    console.log(`LAMT backend listening on port ${port}`);
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
});