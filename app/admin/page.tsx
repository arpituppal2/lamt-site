"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ContactMessage, ScheduleItem, Update, LiveChat as LiveChatType } from "../live/types";
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

function AnnouncementsTab({ updates, onPost, onDelete, onEdit }: {
  updates: Update[];
  onPost: (title: string, body: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, patch: { title?: string; body?: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editPending, setEditPending] = useState(false);

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

  function startEdit(update: Update) {
    setEditingId(update.id);
    setEditTitle(update.title || "");
    setEditBody(update.body);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  }

  async function saveEdit(id: number) {
    if (!editBody.trim()) return;
    setEditPending(true);
    try {
      await onEdit(id, {
        title: editTitle.trim() || undefined,
        body: editBody.trim(),
      });
      cancelEdit();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setEditPending(false);
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
              {editingId === update.id ? (
                <div className="grid gap-3">
                  <p className="label-caps">Editing</p>
                  <input className="lamt-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title (optional)" />
                  <textarea className="lamt-textarea" value={editBody} onChange={(e) => setEditBody(e.target.value)} placeholder="Update text..." />
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => saveEdit(update.id)} disabled={!editBody.trim() || editPending} className="btn-filled disabled:opacity-40">
                      {editPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn-outline">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</p>
                    {update.title && <h3 className="mt-2 font-extrabold text-[var(--color-text)]">{update.title}</h3>}
                    <p className="mt-2 text-[var(--color-text-secondary)] whitespace-pre-line">{update.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => startEdit(update)} className="px-3 py-2 font-extrabold text-[var(--color-text)] hover:bg-[var(--color-divider)]">
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(update.id)} className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                      Delete
                    </button>
                  </div>
                </div>
              )}
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

function SubscribersTab({ subscribers, onDelete }: {
  subscribers: ServerSubscriber[];
  onDelete: (id: number) => Promise<void>;
}) {
  const active = subscribers.filter((subscriber) => !subscriber.unsubscribed_at);
  const [copied, setCopied] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(active.map((subscriber) => subscriber.email).join(", "));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  async function handleDelete(id: number, email: string) {
    if (!window.confirm(`Remove ${email} from the subscriber list? This cannot be undone.`)) return;
    setPendingId(id);
    try {
      await onDelete(id);
    } finally {
      setPendingId(null);
    }
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
                <th aria-label="Actions" />
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
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(subscriber.id, subscriber.email)}
                      disabled={pendingId === subscriber.id}
                      className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white disabled:opacity-40"
                    >
                      {pendingId === subscriber.id ? "Removing..." : "Delete"}
                    </button>
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

function SettingsTab() {
  const [tournamentDate, setTournamentDate] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [regDeadline, setRegDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getSettings().then(({ settings }) => {
      if (settings.tournament_date) setTournamentDate(settings.tournament_date);
      if (settings.tournament_name) setTournamentName(settings.tournament_name);
      if (settings.registration_deadline) setRegDeadline(settings.registration_deadline);
    }).catch(() => {});
  }, []);

  function toLocalInput(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 16);
  }

  function toISO(local: string) {
    if (!local) return "";
    return new Date(local).toISOString();
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.updateSettings({
        tournament_date: toISO(tournamentDate),
        tournament_name: tournamentName,
        registration_deadline: toISO(regDeadline),
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border-t-2 border-[var(--color-border)] pt-5">
      <p className="label-caps">Configuration</p>
      <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Tournament Settings</h2>
      <p className="mt-4 text-[var(--color-text-muted)]">
        Set the next tournament date and registration deadline here. The homepage hero countdown will update automatically within 30 seconds. This is also what the &ldquo;Tournament Day&rdquo; live page references.
      </p>
      <div className="mt-5 grid max-w-2xl gap-5">
        <label className="grid gap-2">
          <span className="label-caps">Tournament Name (optional)</span>
          <input className="lamt-input" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="LAMT 2027" />
        </label>
        <label className="grid gap-2">
          <span className="label-caps">Tournament Date & Time</span>
          <input className="lamt-input" type="datetime-local" value={tournamentDate ? toLocalInput(tournamentDate) : ""} onChange={(e) => setTournamentDate(e.target.value)} />
          <span className="text-xs text-[var(--color-text-muted)]">This is when the homepage countdown reaches zero and the &ldquo;Tournament is Live&rdquo; message appears.</span>
        </label>
        <label className="grid gap-2">
          <span className="label-caps">Registration Deadline</span>
          <input className="lamt-input" type="datetime-local" value={regDeadline ? toLocalInput(regDeadline) : ""} onChange={(e) => setRegDeadline(e.target.value)} />
          <span className="text-xs text-[var(--color-text-muted)]">After this time, the Register button disappears and &ldquo;Registration is closed&rdquo; shows.</span>
        </label>
        {error && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="button" onClick={save} disabled={saving} className="btn-filled disabled:opacity-40">
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-sm font-bold text-[var(--ucla-gold-dark)]">Saved! Countdown will update shortly.</span>}
        </div>
      </div>
    </section>
  );
}

function LiveChatTab({ onQueueCount }: { onQueueCount: (n: number) => void }) {
  const [queue, setQueue] = useState<LiveChatType[]>([]);
  const [active, setActive] = useState<LiveChatType[]>([]);
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      const data = await api.getChats();
      setQueue(data.queue);
      setActive(data.active);
      onQueueCount(data.waitingCount);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    }
  }

  useEffect(() => {
    reload();
    const id = window.setInterval(reload, 4000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(id: number, action: () => Promise<void>) {
    setPendingIds((prev) => new Set(prev).add(id));
    try { await action(); } finally {
      setPendingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  }

  async function claim(id: number) {
    await api.claimChat(id);
    await reload();
  }

  async function sendStaff(id: number) {
    const text = (replyMap[id] || "").trim();
    if (!text) return;
    await api.sendStaffMessage(id, text);
    setReplyMap((prev) => ({ ...prev, [id]: "" }));
    await reload();
  }

  async function close(id: number) {
    if (!window.confirm("Close this live chat? The user will be disconnected.")) return;
    await api.closeChat(id);
    await reload();
  }

  function preview(chat: LiveChatType) {
    const last = chat.messages[chat.messages.length - 1];
    return last ? `${last.sender === "user" ? "" : "Staff: "}${last.body}` : "Waiting to start...";
  }

  return (
    <div className="grid gap-5">
      {error && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}

      <section className="border-t-2 border-[var(--color-border)] pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-extrabold text-[var(--color-text)]">Waiting Queue</h2>
          <span className="font-bold text-[var(--color-text-muted)]">{queue.length} in line</span>
        </div>
        {queue.length === 0 ? (
          <p className="py-10 text-center text-[var(--color-text-muted)]">No one waiting. The queue is clear.</p>
        ) : (
          queue.map((chat) => (
            <article key={chat.id} className="border-b-2 border-[var(--color-divider)] py-5 last:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-[var(--color-text)]">#{chat.position} — {chat.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{new Date(chat.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {preview(chat)}</p>
                </div>
                <button type="button" onClick={() => run(chat.id, () => claim(chat.id))} disabled={pendingIds.has(chat.id)} className="btn-filled disabled:opacity-40">
                  Help This Person
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="border-t-2 border-[var(--color-border)] pt-5">
        <h2 className="text-xl font-extrabold text-[var(--color-text)]">Active Chats</h2>
        {active.length === 0 ? (
          <p className="py-10 text-center text-[var(--color-text-muted)]">No active conversations.</p>
        ) : (
          active.map((chat) => (
            <article key={chat.id} className="border-b-2 border-[var(--color-divider)] py-5 last:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-[var(--color-text)]">{chat.name}{chat.email ? ` · ${chat.email}` : ""}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Started {new Date(chat.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
                </div>
                <button type="button" onClick={() => run(chat.id, () => close(chat.id))} disabled={pendingIds.has(chat.id)} className="px-3 py-2 font-extrabold text-[#B33A2B] hover:bg-[#B33A2B] hover:text-white">
                  Close Chat
                </button>
              </div>
              <div className="mt-4 max-h-[16rem] overflow-y-auto border-2 border-[var(--color-divider)] bg-[var(--color-surface)] p-4">
                {chat.messages.map((m) => (
                  <div key={m.id} className={`mb-2 flex ${m.sender === "staff" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-3 py-2 text-sm ${m.sender === "staff" ? "bg-[#2774AE] text-white" : "bg-[var(--color-divider)] text-[var(--color-text)]"}`}>
                      <p className="whitespace-pre-line">{m.body}</p>
                      <p className={`mt-1 text-[10px] ${m.sender === "staff" ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                        {new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); run(chat.id, () => sendStaff(chat.id)); }} className="mt-3 flex gap-3">
                <input className="lamt-input flex-1" value={replyMap[chat.id] || ""} onChange={(e) => setReplyMap((prev) => ({ ...prev, [chat.id]: e.target.value }))} placeholder="Reply..." />
                <button type="submit" disabled={!(replyMap[chat.id] || "").trim() || pendingIds.has(chat.id)} className="btn-filled disabled:opacity-40">Send</button>
              </form>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<"announcements" | "schedule" | "messages" | "subscribers" | "livechat" | "settings">("announcements");
  const [updates, setUpdates] = useState<Update[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<ServerSubscriber[]>([]);
  const [msgCount, setMsgCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
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
    { key: "livechat", label: "Live Chat", badge: queueCount },
    { key: "subscribers", label: "Subscribers" },
    { key: "settings", label: "Settings" },
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
              <Link href="/" className="btn-outline">
                View Homepage
              </Link>
              <Link href="/about" className="btn-outline">
                About / Privacy
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
            onEdit={async (id, patch) => {
              await api.editAnnouncement(id, patch);
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
        {tab === "livechat" && <LiveChatTab onQueueCount={setQueueCount} />}
        {tab === "subscribers" && (
          <SubscribersTab
            subscribers={subscribers}
            onDelete={async (id) => {
              await api.deleteSubscriber(id);
              setSubscribers((prev) => prev.filter((s) => s.id !== id));
            }}
          />
        )}
        {tab === "settings" && <SettingsTab />}
        </div>
      </section>
    </div>
  );
}