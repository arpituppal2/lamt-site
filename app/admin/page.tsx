"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ScheduleItem, Update, ContactMessage } from "../live/types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "../live/types";

const ADMIN_PW = "BRUINSATLAMT";

const STORAGE_KEYS = {
  messages: "lamt_messages",
  schedule: "lamt_schedule",
  updates: "lamt_updates",
};

function countUnresolved(messages: ContactMessage[]) {
  return messages.filter((message) => !message.resolved).length;
}

function readStored<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

function writeStored<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pw === ADMIN_PW) onLogin();
    else {
      setErr(true);
      window.setTimeout(() => setErr(false), 1600);
    }
  }

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Admin</p>
          <span className="gold-rule" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="page-title">LAMT Admin Panel</h1>
            <p className="page-summary mt-5">Post live announcements, update the schedule, and respond to tournament-day messages.</p>
          </div>
          <Image src="/LAMTBear.png" alt="LAMT" width={128} height={128} priority className="hidden h-32 w-32 border-2 border-[var(--ucla-gold)] bg-[var(--color-surface)] p-3 object-contain lg:block" />
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Access</h2>
        <form onSubmit={submit} className="lamt-panel w-full max-w-md">
          <div className="lamt-panel-body">
            <label className="grid gap-2">
              <span className="label-caps">Password</span>
              <input
                className={`lamt-input ${err ? "border-[#B33A2B]" : ""}`}
                type="password"
                value={pw}
                onChange={(event) => setPw(event.target.value)}
                autoFocus
              />
            </label>
            {err && <p className="mt-3 text-sm font-bold text-[#B33A2B]">Incorrect password</p>}
            <button type="submit" className="btn-filled mt-5 w-full">
              Sign In
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AdminMetric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="lamt-panel p-4">
      <p className="label-caps">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-[var(--color-text)]">{value}</p>
      <p className="section-copy mt-1 text-sm">{detail}</p>
    </div>
  );
}

function MessagesTab({ onUnreadChange }: { onUnreadChange: (count: number) => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const storedMessages = readStored<ContactMessage[]>(STORAGE_KEYS.messages, []);
      setMessages(storedMessages);
      onUnreadChange(countUnresolved(storedMessages));
    } catch {}
  }, [onUnreadChange]);

  function save(updated: ContactMessage[]) {
    setMessages(updated);
    onUnreadChange(countUnresolved(updated));
    try {
      writeStored(STORAGE_KEYS.messages, updated);
    } catch {}
  }

  function markResolved(id: number, resolved: boolean) {
    save(messages.map((message) => (message.id === id ? { ...message, resolved } : message)));
  }

  function sendReply(id: number) {
    const text = replyMap[id] || "";
    if (!text.trim()) return;
    const msg = messages.find((message) => message.id === id);
    if (!msg) return;

    const updated: ContactMessage[] = messages.map((message) =>
      message.id === id
        ? {
            ...message,
            resolved: true,
            replies: [
              ...(message.replies || []),
              {
                id: Date.now(),
                body: text.trim(),
                timestamp: new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                }),
              },
            ],
          }
        : message
    );

    save(updated);
    setReplyMap((prev) => ({ ...prev, [id]: "" }));
    window.location.href = `mailto:${msg.email}?subject=Re: Your message to LAMT Staff&body=${encodeURIComponent(text.trim())}`;
  }

  function deleteMsg(id: number) {
    save(messages.filter((message) => message.id !== id));
  }

  const unresolved = messages.filter((message) => !message.resolved).length;

  if (messages.length === 0) {
    return (
      <section className="lamt-panel">
        <div className="lamt-panel-body py-16 text-center">
          <p className="text-xl font-extrabold text-[var(--color-text)]">No messages yet</p>
          <p className="section-copy mt-2">Messages from the /live contact form will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      {unresolved > 0 && (
        <div className="border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] p-4 font-extrabold text-[var(--ucla-blue-deep)]">
          {unresolved} unresolved {unresolved === 1 ? "message" : "messages"}
        </div>
      )}

      {messages.map((message) => (
        <article key={message.id} className={`lamt-panel ${message.resolved ? "opacity-75" : "border-[var(--color-border-strong)]"}`}>
          <div className="lamt-panel-header">
            <div>
              <p className="font-extrabold text-[var(--color-text)]">{message.name}</p>
              <a href={`mailto:${message.email}`} className="subtle-link text-sm">
                {message.email}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--color-text-muted)]">{message.timestamp}</span>
              <span className={`border-2 px-2 py-1 text-xs font-extrabold uppercase ${message.resolved ? "border-[var(--color-border)] text-[var(--color-text-muted)]" : "border-[var(--ucla-gold)] bg-[var(--ucla-gold)] text-[var(--ucla-blue-deep)]"}`}>
                {message.resolved ? "Resolved" : "Pending"}
              </span>
            </div>
          </div>

          <div className="lamt-panel-body">
            <p className="section-copy">{message.message}</p>
          </div>

          {(message.replies || []).length > 0 && (
            <div className="border-t-2 border-[var(--color-border)] bg-[var(--color-surface-2)]">
              {(message.replies || []).map((reply) => (
                <div key={reply.id} className="border-b-2 border-[var(--color-border)] p-4 last:border-b-0">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-extrabold text-[var(--color-text)]">Staff</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{reply.timestamp}</span>
                  </div>
                  <p className="section-copy">{reply.body}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-3 border-t-2 border-[var(--color-border)] p-4">
            <textarea
              className="lamt-textarea min-h-24"
              value={replyMap[message.id] || ""}
              onChange={(event) => setReplyMap((prev) => ({ ...prev, [message.id]: event.target.value }))}
              placeholder="Type a reply. Sending opens your mail client."
            />
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => sendReply(message.id)} disabled={!(replyMap[message.id] || "").trim()} className="btn-outline disabled:opacity-40">
                Reply and Mark Resolved
              </button>
              {message.resolved ? (
                <button type="button" onClick={() => markResolved(message.id, false)} className="btn-outline">
                  Mark Pending
                </button>
              ) : (
                <button type="button" onClick={() => markResolved(message.id, true)} className="btn-outline">
                  Mark Resolved
                </button>
              )}
              <button type="button" onClick={() => deleteMsg(message.id)} className="border-2 border-[#B33A2B] px-4 py-2 font-extrabold uppercase text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function AnnouncementsTab({ updates, setUpdates }: {
  updates: Update[];
  setUpdates: (updates: Update[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function persist(next: Update[]) {
    setUpdates(next);
    try {
      writeStored(STORAGE_KEYS.updates, next);
    } catch {}
  }

  function addUpdate() {
    if (!body.trim()) return;
    const newUpdate: Update = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    persist([newUpdate, ...updates]);
    setTitle("");
    setBody("");
  }

  function deleteUpdate(id: number) {
    persist(updates.filter((update) => update.id !== id));
  }

  return (
    <div className="grid gap-5">
      <section className="lamt-panel">
        <div className="lamt-panel-header">
          <div>
            <p className="label-caps">Post New Update</p>
            <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Announcement Composer</h2>
          </div>
        </div>
        <div className="lamt-panel-body grid gap-4">
          <input className="lamt-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title (optional)" />
          <textarea className="lamt-textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Update text..." />
          <button type="button" onClick={addUpdate} disabled={!body.trim()} className="btn-outline justify-self-start disabled:opacity-40">
            Post Update
          </button>
        </div>
      </section>

      <section className="lamt-panel">
        <div className="lamt-panel-header">
          <h2 className="text-xl font-extrabold text-[var(--color-text)]">Posted Updates</h2>
          <span className="font-bold text-[var(--color-text-muted)]">{updates.length}</span>
        </div>
        {updates.length === 0 ? (
          <div className="lamt-panel-body text-center text-[var(--color-text-muted)]">No updates posted yet.</div>
        ) : (
          updates.map((update) => (
            <article key={update.id} className="border-b-2 border-[var(--color-border)] p-5 last:border-b-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</p>
                  {update.title && <h3 className="mt-2 font-extrabold text-[var(--color-text)]">{update.title}</h3>}
                  <p className="section-copy mt-2 whitespace-pre-line">{update.body}</p>
                </div>
                <button type="button" onClick={() => deleteUpdate(update.id)} className="border-2 border-[#B33A2B] px-4 py-2 font-extrabold uppercase text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function ScheduleTab({ schedule, setSchedule }: {
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
}) {
  function persist(next: ScheduleItem[]) {
    setSchedule(next);
    try {
      writeStored(STORAGE_KEYS.schedule, next);
    } catch {}
  }

  function update(index: number, field: keyof ScheduleItem, value: string) {
    persist(schedule.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Schedule</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Live Timeline Editor</h2>
        </div>
      </div>
      <div className="lamt-panel-body">
        <p className="section-copy mb-5">Edit event times, rooms, and delay notes. Changes sync to the /live page for this browser session.</p>
        <div className="grid gap-4">
          {schedule.map((item, index) => (
            <div key={`${item.event}-${index}`} className="border-2 border-[var(--color-border)] p-4">
              <p className="mb-3 font-extrabold text-[var(--color-text)]">{item.event}</p>
              <div className="grid gap-3 lg:grid-cols-4">
                <label className="grid gap-2">
                  <span className="label-caps">Start</span>
                  <input className="lamt-input" value={item.time} onChange={(event) => update(index, "time", event.target.value)} />
                </label>
                <label className="grid gap-2">
                  <span className="label-caps">End</span>
                  <input className="lamt-input" value={item.end} onChange={(event) => update(index, "end", event.target.value)} />
                </label>
                <label className="grid gap-2">
                  <span className="label-caps">Location</span>
                  <input className="lamt-input" value={item.location} onChange={(event) => update(index, "location", event.target.value)} />
                </label>
                <label className="grid gap-2">
                  <span className="label-caps">Original Time</span>
                  <input className="lamt-input" value={item.originalTime || ""} onChange={(event) => update(index, "originalTime", event.target.value)} placeholder="If delayed" />
                </label>
              </div>
              <label className="mt-3 grid gap-2">
                <span className="label-caps">Delay Reason</span>
                <input className="lamt-input" value={item.adjustmentReason || ""} onChange={(event) => update(index, "adjustmentReason", event.target.value)} placeholder="Shown on /live when present" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"announcements" | "schedule" | "messages">("announcements");
  const [updates, setUpdates] = useState<Update[]>(DEFAULT_UPDATES);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    if (!authed) return;
    function syncStoredData() {
      try {
        setSchedule(readStored<ScheduleItem[]>(STORAGE_KEYS.schedule, DEFAULT_SCHEDULE));
        setUpdates(readStored<Update[]>(STORAGE_KEYS.updates, DEFAULT_UPDATES));
        setMsgCount(countUnresolved(readStored<ContactMessage[]>(STORAGE_KEYS.messages, [])));
      } catch {}
    }

    syncStoredData();

    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.schedule || event.key === STORAGE_KEYS.updates || event.key === STORAGE_KEYS.messages) {
        syncStoredData();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authed]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs: { key: typeof tab; label: string; badge?: number }[] = [
    { key: "announcements", label: "Announcements" },
    { key: "schedule", label: "Schedule" },
    { key: "messages", label: "Messages", badge: msgCount },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Admin</p>
          <span className="gold-rule" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="page-title">LAMT Admin Panel</h1>
            <p className="page-summary mt-5">Post announcements, adjust the schedule, and handle live-page messages for tournament day.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/live" className="btn-filled">
                Open Live Page
              </Link>
              <a href="mailto:uclamathtournament@gmail.com" className="btn-outline">
                Email Staff
              </a>
            </div>
          </div>
          <Image src="/LAMTBear.png" alt="LAMT" width={150} height={150} priority className="hidden h-36 w-36 border-2 border-[var(--ucla-gold)] bg-[var(--color-surface)] p-4 object-contain lg:block" />
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Control Room</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <AdminMetric label="Updates" value={updates.length} detail="Posted announcements" />
          <AdminMetric label="Schedule" value={schedule.length} detail="Timeline rows" />
          <AdminMetric label="Messages" value={msgCount} detail="Pending replies" />
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Tools</h2>
        <div className="grid gap-6">
        <nav className="flex flex-wrap gap-2 border-b-2 border-[var(--color-border)] pb-4" aria-label="Admin sections">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className="lamt-button"
              data-state={tab === item.key ? "selected" : undefined}
            >
              {item.label}
              {(item.badge ?? 0) > 0 ? ` (${item.badge})` : ""}
            </button>
          ))}
        </nav>

        {tab === "announcements" && <AnnouncementsTab updates={updates} setUpdates={setUpdates} />}
        {tab === "schedule" && <ScheduleTab schedule={schedule} setSchedule={setSchedule} />}
        {tab === "messages" && <MessagesTab onUnreadChange={setMsgCount} />}
        </div>
      </section>
    </div>
  );
}
