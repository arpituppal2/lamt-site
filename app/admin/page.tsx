"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ContactMessage, ScheduleItem, Update } from "../live/types";
import { api, ApiError } from "../lib/api";

function countUnresolved(messages: ContactMessage[]) {
  return messages.filter((message) => !message.resolved).length;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setErr(null);
    try {
      await api.login(pw);
      onLogin();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) setErr("Incorrect password");
        else if (error.status === 429) setErr("Too many attempts. Wait a minute and try again.");
        else setErr(error.message);
      } else {
        setErr("Could not reach the server.");
      }
    } finally {
      setPending(false);
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
          <Image src="/LAMTBear.png" alt="LAMT" width={128} height={128} priority className="hidden h-32 w-32 object-contain lg:block" />
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Access</h2>
        <form onSubmit={submit} className="w-full max-w-md">
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
            {err && <p className="mt-3 text-sm font-bold text-[#B33A2B]">{err}</p>}
            <button type="submit" disabled={pending} className="btn-filled mt-5 w-full disabled:opacity-40">
              {pending ? "Signing In..." : "Sign In"}
            </button>
          </form>
      </section>
    </div>
  );
}

function AdminMetric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="border-t-2 border-[var(--color-divider)] pt-4 lg:border-l-2 lg:border-t-0 lg:px-6 lg:pt-0 lg:first:border-l-0 lg:first:pl-0">
      <p className="label-caps">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[var(--color-text)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{detail}</p>
    </div>
  );
}

function MessagesTab({ messages, onResolve, onReply, onDelete }: {
  messages: ContactMessage[];
  onResolve: (id: number, resolved: boolean) => Promise<void>;
  onReply: (id: number, body: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  async function run(id: number, action: () => Promise<void>) {
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      await action();
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  function sendReply(id: number) {
    const text = replyMap[id] || "";
    if (!text.trim()) return;
    const msg = messages.find((message) => message.id === id);
    if (!msg) return;
    run(id, async () => {
      await onReply(id, text.trim());
      setReplyMap((prev) => ({ ...prev, [id]: "" }));
      window.location.href = `mailto:${msg.email}?subject=Re: Your message to LAMT Staff&body=${encodeURIComponent(text.trim())}`;
    });
  }

  const unresolved = countUnresolved(messages);

  if (messages.length === 0) {
    return (
      <section className="border-t-2 border-[var(--color-border)] py-16 text-center">
        <p className="text-xl font-extrabold text-[var(--color-text)]">No messages yet</p>
        <p className="mt-2 text-[var(--color-text-muted)]">Messages from the /live contact form will appear here.</p>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      {unresolved > 0 && (
        <div className="bg-[var(--ucla-gold)] px-4 py-3 font-extrabold text-[var(--ucla-blue-deep)]">
          {unresolved} unresolved {unresolved === 1 ? "message" : "messages"}
        </div>
      )}

      {messages.map((message) => (
        <article key={message.id} className={`border-t-2 border-[var(--color-border)] py-5 ${message.resolved ? "opacity-75" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-extrabold text-[var(--color-text)]">{message.name}</p>
              <a href={`mailto:${message.email}`} className="subtle-link text-sm">
                {message.email}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">{message.timestamp}</span>
              <span className={`text-xs font-extrabold uppercase ${message.resolved ? "text-[var(--color-text-muted)]" : "text-[var(--ucla-gold-dark)]"}`}>
                {message.resolved ? "Resolved" : "Pending"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[var(--color-text-secondary)]">{message.message}</p>

          {(message.replies || []).length > 0 && (
            <div className="mt-5 border-t-2 border-[var(--color-divider)]">
              {(message.replies || []).map((reply) => (
                <div key={reply.id} className="border-b-2 border-[var(--color-divider)] py-4 last:border-b-0">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-extrabold text-[var(--color-text)]">Staff</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{reply.timestamp}</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)]">{reply.body}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 grid gap-3 border-t-2 border-[var(--color-divider)] pt-5">
            <textarea
              className="lamt-textarea min-h-24"
              value={replyMap[message.id] || ""}
              onChange={(event) => setReplyMap((prev) => ({ ...prev, [message.id]: event.target.value }))}
              placeholder="Type a reply. Sending opens your mail client."
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => sendReply(message.id)}
                disabled={!(replyMap[message.id] || "").trim() || pendingIds.has(message.id)}
                className="btn-outline disabled:opacity-40"
              >
                Reply and Mark Resolved
              </button>
              {message.resolved ? (
                <button type="button" onClick={() => run(message.id, () => onResolve(message.id, false))} disabled={pendingIds.has(message.id)} className="btn-outline disabled:opacity-40">
                  Mark Pending
                </button>
              ) : (
                <button type="button" onClick={() => run(message.id, () => onResolve(message.id, true))} disabled={pendingIds.has(message.id)} className="btn-outline disabled:opacity-40">
                  Mark Resolved
                </button>
              )}
              <button type="button" onClick={() => {
                if (window.confirm('Delete this email? This cannot be undone.')) {
                  run(message.id, () => onDelete(message.id));
                }
              }} disabled={pendingIds.has(message.id)} className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function AnnouncementsTab({ updates, onPost, onDelete }: {
  updates: Update[];
  onPost: (title: string, body: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function addUpdate() {
    if (!body.trim()) return;
    setPending(true);
    setError(null);
    try {
      await onPost(title.trim(), body.trim());
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-5">
      <section className="border-t-2 border-[var(--color-border)] pt-5">
        <p className="label-caps">Post New Update</p>
        <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Announcement Composer</h2>
        <div className="mt-5 grid gap-4">
          <input className="lamt-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title (optional)" />
          <textarea className="lamt-textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Update text..." />
          {error && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
          <button type="button" onClick={addUpdate} disabled={!body.trim() || pending} className="btn-outline justify-self-start disabled:opacity-40">
            {pending ? "Posting..." : "Post Update"}
          </button>
        </div>
      </section>

      <section className="border-t-2 border-[var(--color-border)] pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-extrabold text-[var(--color-text)]">Posted Updates</h2>
          <span className="font-bold text-[var(--color-text-muted)]">{updates.length}</span>
        </div>
        {updates.length === 0 ? (
          <p className="py-10 text-center text-[var(--color-text-muted)]">No updates posted yet.</p>
        ) : (
          updates.map((update) => (
            <article key={update.id} className="border-b-2 border-[var(--color-divider)] py-5 last:border-b-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</p>
                  {update.title && <h3 className="mt-2 font-extrabold text-[var(--color-text)]">{update.title}</h3>}
                  <p className="mt-2 text-[var(--color-text-secondary)] whitespace-pre-line">{update.body}</p>
                </div>
                <button type="button" onClick={() => onDelete(update.id)} className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
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

interface ScheduleDraft {
  time: string;
  end: string;
  event: string;
  location: string;
  adjustmentReason?: string;
}

function ScheduleTab({ schedule, onSave, onDelete, onAdd }: {
  schedule: ScheduleItem[];
  onSave: (id: number, draft: ScheduleDraft) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAdd: (draft: ScheduleDraft) => Promise<void>;
}) {
  const [drafts, setDrafts] = useState<Record<number, ScheduleDraft>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [newRow, setNewRow] = useState<ScheduleDraft | null>(null);
  const [newError, setNewError] = useState<string | null>(null);

  const draftFor = (item: ScheduleItem): ScheduleDraft =>
    drafts[item.id] || {
      time: item.time,
      end: item.end,
      event: item.event,
      location: item.location,
      adjustmentReason: item.adjustmentReason || "",
    };

  function updateDraft(id: number, field: keyof ScheduleDraft, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] || draftFor(schedule.find((item) => item.id === id)!)), [field]: value } }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateNewRow(field: keyof ScheduleDraft, value: string) {
    if (!newRow) return;
    setNewRow({ ...newRow, [field]: value });
    setNewError(null);
  }

  async function saveItem(item: ScheduleItem) {
    const draft = draftFor(item);
    setPendingIds((prev) => new Set(prev).add(item.id));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
    try {
      await onSave(item.id, draft);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    } catch (err) {
      setErrors((prev) => ({ ...prev, [item.id]: err instanceof ApiError ? err.message : "Could not reach the server." }));
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }

  async function createRow() {
    if (!newRow) return;
    if (!newRow.time.trim() || !newRow.end.trim() || !newRow.event.trim() || !newRow.location.trim()) {
      setNewError("Time, end, event, and location are required.");
      return;
    }
    setPendingIds((prev) => new Set(prev).add(-1));
    setNewError(null);
    try {
      await onAdd(newRow);
      setNewRow(null);
    } catch (err) {
      setNewError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(-1);
        return next;
      });
    }
  }

  return (
    <section className="border-t-2 border-[var(--color-border)] pt-5">
      <p className="label-caps">Schedule</p>
      <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Live Timeline Editor</h2>
      <p className="mt-4 text-[var(--color-text-muted)]">Edit event times, rooms, and delay notes. Changes sync to the /live page within 30 seconds. Changing a time requires a delay note.</p>
      <div className="mt-5 grid gap-4">
        {schedule.map((item) => {
          const draft = draftFor(item);
          const dirty = draft.time !== item.time || draft.end !== item.end || draft.event !== item.event || draft.location !== item.location || draft.adjustmentReason !== (item.adjustmentReason || "");
          return (
            <div key={item.id} className="border-t-2 border-[var(--color-divider)] py-5">
              <p className="mb-3 font-extrabold text-[var(--color-text)]">{item.event}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-2">
                  <span className="label-caps">Start</span>
                  <input className="lamt-input" value={draft.time} onChange={(event) => updateDraft(item.id, "time", event.target.value)} />
                </label>
                <label className="grid gap-2">
                  <span className="label-caps">End</span>
                  <input className="lamt-input" value={draft.end} onChange={(event) => updateDraft(item.id, "end", event.target.value)} />
                </label>
                <label className="grid gap-2">
                  <span className="label-caps">Location</span>
                  <input className="lamt-input" value={draft.location} onChange={(event) => updateDraft(item.id, "location", event.target.value)} />
                </label>
                <label className="grid gap-2">
                  <span className="label-caps">Original Time</span>
                  <input className="lamt-input" value={item.originalTime || ""} readOnly disabled placeholder="Set automatically on first delay" />
                </label>
              </div>
              <label className="mt-3 grid gap-2">
                <span className="label-caps">Delay Reason</span>
                <input className="lamt-input" value={draft.adjustmentReason || ""} onChange={(event) => updateDraft(item.id, "adjustmentReason", event.target.value)} placeholder="Required when changing a time" />
              </label>
              {errors[item.id] && <p className="mt-3 text-sm font-bold text-[#B33A2B]">{errors[item.id]}</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => saveItem(item)} disabled={!dirty || pendingIds.has(item.id)} className="btn-outline disabled:opacity-40">
                  {pendingIds.has(item.id) ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => onDelete(item.id)} className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                  Remove Row
                </button>
              </div>
            </div>
          );
        })}
        {newRow && (
          <div className="border-t-2 border-[var(--ucla-gold)] py-5">
            <p className="mb-3 font-extrabold text-[var(--color-text)]">New Row</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="grid gap-2">
                <span className="label-caps">Start</span>
                <input className="lamt-input" value={newRow.time} onChange={(event) => updateNewRow("time", event.target.value)} placeholder="e.g. 8:00 AM" />
              </label>
              <label className="grid gap-2">
                <span className="label-caps">End</span>
                <input className="lamt-input" value={newRow.end} onChange={(event) => updateNewRow("end", event.target.value)} placeholder="e.g. 8:45 AM" />
              </label>
              <label className="grid gap-2">
                <span className="label-caps">Event</span>
                <input className="lamt-input" value={newRow.event} onChange={(event) => updateNewRow("event", event.target.value)} placeholder="e.g. Check-In" />
              </label>
              <label className="grid gap-2">
                <span className="label-caps">Location</span>
                <input className="lamt-input" value={newRow.location} onChange={(event) => updateNewRow("location", event.target.value)} placeholder="e.g. MS 4000A" />
              </label>
            </div>
            {newError && <p className="mt-3 text-sm font-bold text-[#B33A2B]">{newError}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={createRow} disabled={pendingIds.has(-1)} className="btn-outline disabled:opacity-40">
                {pendingIds.has(-1) ? "Creating..." : "Create Row"}
              </button>
              <button type="button" onClick={() => setNewRow(null)} className="btn-outline disabled:opacity-40">
                Cancel
              </button>
            </div>
          </div>
        )}
        <button type="button" onClick={() => setNewRow({ time: "", end: "", event: "", location: "", adjustmentReason: "" })} disabled={pendingIds.has(-1) || newRow !== null} className="btn-outline justify-self-start disabled:opacity-40">
          Add Row
        </button>
      </div>
    </section>
  );
}

interface ServerSubscriber {
  id: number;
  email: string;
  consent_at: string;
  unsubscribed_at: string | null;
}

function SubscribersTab({ subscribers }: { subscribers: ServerSubscriber[] }) {
  const active = subscribers.filter((subscriber) => !subscriber.unsubscribed_at);
  const [copied, setCopied] = useState(false);

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(active.map((subscriber) => subscriber.email).join(", "));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <section className="border-t-2 border-[var(--color-border)] pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="label-caps">Email List</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Subscribers</h2>
        </div>
        <span className="font-bold text-[var(--color-text-muted)]">
          {active.length} active / {subscribers.length} total
        </span>
      </div>
      <p className="mt-4 text-[var(--color-text-muted)]">Everyone who signed up via the homepage section or the popup. Copy the list to send your next announcement.</p>
      <button type="button" onClick={copyEmails} disabled={active.length === 0} className="btn-outline mt-5 mb-5 disabled:opacity-40">
        {copied ? "Copied!" : `Copy ${active.length} Email${active.length === 1 ? "" : "s"}`}
      </button>
      {subscribers.length === 0 ? (
        <p className="py-10 text-center text-[var(--color-text-muted)]">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="lamt-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Signed Up</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="font-bold text-[var(--color-text)]">{subscriber.email}</td>
                  <td className="text-[var(--color-text-secondary)]">{formatDate(subscriber.consent_at)}</td>
                  <td>
                    {subscriber.unsubscribed_at ? (
                      <span className="text-sm font-extrabold uppercase text-[var(--color-text-muted)]">Unsubscribed</span>
                    ) : (
                      <span className="text-sm font-extrabold uppercase text-[var(--ucla-gold-dark)]">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<"announcements" | "schedule" | "messages" | "subscribers">("announcements");
  const [updates, setUpdates] = useState<Update[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<ServerSubscriber[]>([]);
  const [msgCount, setMsgCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getSession()
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  const reload = useCallback(async () => {
    try {
      const [nextUpdates, nextSchedule, nextMessages] = await Promise.all([api.getAnnouncements(), api.getSchedule(), api.getMessages()]);
      setUpdates(nextUpdates);
      setSchedule(nextSchedule);
      setMessages(nextMessages);
      setMsgCount(countUnresolved(nextMessages));
      setLoadError(null);
      api.getSubscribers().then(({ subscribers: nextSubscribers }) => setSubscribers(nextSubscribers)).catch(() => {});
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : "Could not reach the server.");
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    reload();
    const id = window.setInterval(reload, 30_000);
    return () => window.clearInterval(id);
  }, [authed, reload]);

  function logout() {
    api
      .logout()
      .catch(() => {})
      .finally(() => setAuthed(false));
  }

  if (checking) {
    return (
      <div className="page-shell">
        <p className="py-16 text-center text-[var(--color-text-muted)]">Checking session...</p>
      </div>
    );
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs: { key: typeof tab; label: string; badge?: number }[] = [
    { key: "announcements", label: "Announcements" },
    { key: "schedule", label: "Schedule" },
    { key: "messages", label: "Messages", badge: msgCount },
    { key: "subscribers", label: "Subscribers" },
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
              <button type="button" onClick={logout} className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                Sign Out
              </button>
            </div>
            {loadError && <p className="mt-4 text-sm font-bold text-[#B33A2B]">Sync issue: {loadError} (retrying)</p>}
          </div>
          <Image src="/LAMTBear.png" alt="LAMT" width={150} height={150} priority className="hidden h-36 w-36 object-contain lg:block" />
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Control Room</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <AdminMetric label="Updates" value={updates.length} detail="Posted announcements" />
          <AdminMetric label="Schedule" value={schedule.length} detail="Timeline rows" />
          <AdminMetric label="Messages" value={msgCount} detail="Pending replies" />
          <AdminMetric label="Subscribers" value={subscribers.filter((subscriber) => !subscriber.unsubscribed_at).length} detail="Active email list" />
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Tools</h2>
        <div className="grid gap-6">
        <nav className="flex flex-wrap gap-x-8 gap-y-2 border-b-2 border-[var(--color-border)]" aria-label="Admin sections">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className="tab-underline"
              aria-current={tab === item.key ? "true" : undefined}
            >
              {item.label}
              {(item.badge ?? 0) > 0 ? ` (${item.badge})` : ""}
            </button>
          ))}
        </nav>

        {tab === "announcements" && (
          <AnnouncementsTab
            updates={updates}
            onPost={async (title, body) => {
              await api.postAnnouncement(title, body);
              await reload();
            }}
            onDelete={async (id) => {
              await api.deleteAnnouncement(id);
              await reload();
            }}
          />
        )}
        {tab === "schedule" && (
          <ScheduleTab
            schedule={schedule}
            onSave={async (id, draft) => {
              await api.patchScheduleItem(id, {
                time: draft.time,
                end: draft.end,
                event: draft.event,
                location: draft.location,
                adjustmentReason: draft.adjustmentReason || undefined,
              });
              await reload();
            }}
            onDelete={async (id) => {
              await api.deleteScheduleItem(id);
              await reload();
            }}
            onAdd={async (draft) => {
              await api.postScheduleItem({ time: draft.time, end: draft.end, event: draft.event, location: draft.location });
              await reload();
            }}
          />
        )}
        {tab === "messages" && (
<MessagesTab
  messages={messages}
  onResolve={async (id, resolved) => {
    await api.patchMessageResolved(id, resolved);
    await reload();
  }}
  onReply={async (id, body) => {
    await api.patchMessageReply(id, body);
    await reload();
  }}
  onDelete={async (id) => {
    await api.deleteMessage(id);
    await reload();
  }}
/>
        )}
        {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}
        </div>
      </section>
    </div>
  );
}