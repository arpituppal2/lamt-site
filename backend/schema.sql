CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title TEXT,
  body TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id SERIAL PRIMARY KEY,
  time TEXT NOT NULL,
  "end" TEXT NOT NULL,
  event TEXT NOT NULL,
  location TEXT NOT NULL,
  original_time TEXT,
  adjustment_reason TEXT,
  position INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE schedule_items ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  replies JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS used_unsubscribe_tokens (
  token_hash TEXT PRIMARY KEY,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS live_chats (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_live_chats_status ON live_chats(status);
CREATE INDEX IF NOT EXISTS idx_live_chats_created_at ON live_chats(created_at DESC);

CREATE TABLE IF NOT EXISTS live_chat_messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES live_chats(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_chat_messages_chat_id ON live_chat_messages(chat_id, created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'volunteer',
  permanent BOOLEAN NOT NULL DEFAULT false,
  session_version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS revoked_sessions (
  token_hash TEXT PRIMARY KEY,
  revoked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO users (name, role, permanent) VALUES ('Arpit Uppal', 'admin', true) ON CONFLICT (name) DO NOTHING;
INSERT INTO users (name, role, permanent) VALUES ('Vicky Zhang', 'admin', true) ON CONFLICT (name) DO NOTHING;