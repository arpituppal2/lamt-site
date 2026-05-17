"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ScheduleItem, Update, ContactMessage } from "../live/types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "../live/types";

// ─── ADMIN AUTH ───────────────────────────────────────────────────────────────
const ADMIN_PW = "lamt2026admin";

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
const IS: React.CSSProperties = {
  background: "#fff", border: "1px solid #d4d4d8", borderRadius: 8,
  color: "#1a1a1a", fontFamily: "inherit", fontSize: "0.875rem",
  padding: "0.5625rem 0.75rem", width: "100%", outline: "none",
};

const BTN = (bg: string, fg = "#fff"): React.CSSProperties => ({
  background: bg, color: fg, border: "none", borderRadius: 6,
  fontWeight: 700, fontSize: "0.75rem", padding: "0.4rem 0.875rem",
  cursor: "pointer", letterSpacing: "0.04em", transition: "opacity 150ms",
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]   = useState("");
  const [err, setErr] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PW) onLogin();
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  }
  return (
    <div style={{
      minHeight: "100vh", background: "#2774AE",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <form onSubmit={submit} style={{
        background: "#fff", borderRadius: 16, padding: "2.5rem",
        width: "min(360px,92vw)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <Image src="/LAMTBear.png" alt="LAMT" width={36} height={36} style={{ height: 36, width: "auto" }} />
          <div>
            <p style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#999" }}>LAMT 2026</p>
            <p style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#1a1a1a" }}>Admin Panel</p>
          </div>
        </div>
        <input
          type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Password" autoFocus
          style={{ ...IS, marginBottom: "0.75rem",
            border: err ? "1.5px solid #e74c3c" : "1px solid #d4d4d8" }}
        />
        {err && <p style={{ fontSize: "0.75rem", color: "#e74c3c", marginBottom: "0.5rem" }}>Incorrect password</p>}
        <button type="submit" style={{ ...BTN("#2774AE"), width: "100%", padding: "0.625rem" }}>Sign In</button>
      </form>
    </div>
  );
}

// ─── MESSAGES TAB ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyMap,  setReplyMap]  = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lamt_messages");
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  function save(updated: ContactMessage[]) {
    setMessages(updated);
    try { sessionStorage.setItem("lamt_messages", JSON.stringify(updated)); } catch {}
  }

  function markResolved(id: number, resolved: boolean) {
    save(messages.map(m => m.id === id ? { ...m, resolved } : m));
  }

  function sendReply(id: number) {
    const text = replyMap[id] || "";
    if (!text.trim()) return;
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    const updated = messages.map(m =>
      m.id === id
        ? { ...m, resolved: true, replies: [...(m.replies || []), {
            text: text.trim(),
            timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
          }]
        }
        : m
    );
    save(updated);
    setReplyMap(prev => ({ ...prev, [id]: "" }));
    // open mailto
    window.location.href = `mailto:${msg.email}?subject=Re: Your message to LAMT Staff&body=${encodeURIComponent(text.trim())}`;
  }

  function deleteMsg(id: number) {
    save(messages.filter(m => m.id !== id));
  }

  const unresolved = messages.filter(m => !m.resolved).length;

  if (messages.length === 0) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</p>
        <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>No messages yet</p>
        <p style={{ fontSize: "0.8125rem", color: "#888" }}>Messages from the /live contact form will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      {unresolved > 0 && (
        <div style={{
          margin: "1rem 1.5rem 0",
          background: "#fff3cd", border: "1px solid #ffc107",
          borderRadius: 8, padding: "0.625rem 1rem",
          fontSize: "0.8125rem", fontWeight: 600, color: "#856404",
        }}>
          ⚠️ {unresolved} unresolved {unresolved === 1 ? "message" : "messages"}
        </div>
      )}
      {messages.map(m => (
        <div key={m.id} style={{
          margin: "1rem 1.5rem",
          border: m.resolved ? "1px solid #e8e8ea" : "1.5px solid #2774AE",
          borderRadius: 12, overflow: "hidden",
          opacity: m.resolved ? 0.7 : 1,
          transition: "opacity 200ms",
        }}>
          {/* message header */}
          <div style={{
            padding: "0.875rem 1.25rem",
            background: m.resolved ? "#fafafa" : "#f0f7ff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "0.5rem",
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1a1a1a" }}>{m.name}</p>
              <a href={`mailto:${m.email}`} style={{ fontSize: "0.8125rem", color: "#2774AE", textDecoration: "none" }}>{m.email}</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.6875rem", color: "#bbb" }}>{m.timestamp}</span>
              {m.resolved ? (
                <span style={{
                  background: "#d4edda", color: "#155724", borderRadius: 99,
                  fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "2px 8px",
                }}>Resolved</span>
              ) : (
                <span style={{
                  background: "#fff3cd", color: "#856404", borderRadius: 99,
                  fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "2px 8px",
                }}>Pending</span>
              )}
            </div>
          </div>

          {/* message body */}
          <div style={{ padding: "1rem 1.25rem", background: "#fff" }}>
            <p style={{ fontSize: "0.875rem", color: "#333", lineHeight: 1.7 }}>{m.message}</p>
          </div>

          {/* previous replies */}
          {(m.replies || []).length > 0 && (
            <div style={{ background: "#f8f9fa", borderTop: "1px solid #f0f0f0" }}>
              {(m.replies || []).map((r, ri) => (
                <div key={ri} style={{
                  padding: "0.875rem 1.25rem",
                  borderBottom: ri < (m.replies || []).length - 1 ? "1px solid #f0f0f0" : "none",
                  display: "flex", gap: "0.875rem",
                }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#2774AE", display: "flex", alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1a1a1a" }}>Staff</span>
                      <span style={{ fontSize: "0.6875rem", color: "#bbb" }}>{r.timestamp}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#333", lineHeight: 1.65 }}>{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* reply composer */}
          <div style={{
            padding: "0.875rem 1.25rem",
            borderTop: "1px solid #f0f0f0", background: "#fafafa",
            display: "flex", flexDirection: "column", gap: "0.5rem",
          }}>
            <textarea
              value={replyMap[m.id] || ""}
              onChange={e => setReplyMap(prev => ({ ...prev, [m.id]: e.target.value }))}
              placeholder="Type a reply… (opens mail client on send)"
              style={{
                ...IS, minHeight: 64, resize: "vertical",
                fontSize: "0.8125rem", borderRadius: 8,
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => sendReply(m.id)}
                disabled={!(replyMap[m.id] || "").trim()}
                style={{
                  ...BTN("#2774AE"),
                  opacity: !(replyMap[m.id] || "").trim() ? 0.4 : 1,
                }}
              >
                ↩ Reply & Mark Resolved
              </button>
              {m.resolved ? (
                <button onClick={() => markResolved(m.id, false)}
                  style={BTN("transparent", "#888")}>
                  Unresolve
                </button>
              ) : (
                <button onClick={() => markResolved(m.id, true)}
                  style={BTN("#28a745")}>
                  ✓ Mark Resolved
                </button>
              )}
              <button onClick={() => deleteMsg(m.id)}
                style={{ ...BTN("transparent", "#e74c3c"), marginLeft: "auto" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ANNOUNCEMENTS TAB ────────────────────────────────────────────────────────
function AnnouncementsTab({ updates, setUpdates }: {
  updates: Update[];
  setUpdates: (u: Update[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [body,  setBody]  = useState("");

  function addUpdate() {
    if (!body.trim()) return;
    const newUpdate: Update = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    const next = [newUpdate, ...updates];
    setUpdates(next);
    try { sessionStorage.setItem("lamt_updates", JSON.stringify(next)); } catch {}
    setTitle(""); setBody("");
  }

  function deleteUpdate(id: string) {
    const next = updates.filter(u => u.id !== id);
    setUpdates(next);
    try { sessionStorage.setItem("lamt_updates", JSON.stringify(next)); } catch {}
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* composer */}
      <div style={{
        background: "#fff", border: "1.5px solid #2774AE",
        borderRadius: 12, overflow: "hidden", marginBottom: "1.5rem",
      }}>
        <div style={{ padding: "0.875rem 1.25rem", background: "#f0f7ff",
          borderBottom: "1px solid #d4e8f5" }}>
          <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#2774AE" }}>Post New Update</span>
        </div>
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input style={IS} value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Title (optional)" />
          <textarea style={{ ...IS, minHeight: 100, resize: "vertical" }}
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Update text…" />
          <button onClick={addUpdate} disabled={!body.trim()}
            style={{ ...BTN("#2774AE"), alignSelf: "flex-start",
              padding: "0.5rem 1.25rem", opacity: !body.trim() ? 0.4 : 1 }}>
            Post Update
          </button>
        </div>
      </div>

      {/* existing updates */}
      {updates.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "#bbb", textAlign: "center", padding: "2rem" }}>No updates posted yet.</p>
      ) : (
        updates.map(u => (
          <div key={u.id} style={{
            background: "#fff", border: "1px solid #e8e8ea",
            borderRadius: 10, padding: "1rem 1.25rem",
            marginBottom: "0.75rem",
            display: "flex", justifyContent: "space-between",
            gap: "0.75rem",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 4 }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#bbb" }}>{u.timestamp}</span>
              </div>
              {u.title && <p style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: 4 }}>{u.title}</p>}
              <p style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.65 }}>{u.body}</p>
            </div>
            <button onClick={() => deleteUpdate(u.id)}
              style={{ ...BTN("transparent", "#e74c3c"), flexShrink: 0, alignSelf: "flex-start" }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ─── SCHEDULE TAB ─────────────────────────────────────────────────────────────
function ScheduleTab({ schedule, setSchedule }: {
  schedule: ScheduleItem[];
  setSchedule: (s: ScheduleItem[]) => void;
}) {
  function update(i: number, field: keyof ScheduleItem, val: string) {
    const next = schedule.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setSchedule(next);
    try { sessionStorage.setItem("lamt_schedule", JSON.stringify(next)); } catch {}
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <p style={{ fontSize: "0.8125rem", color: "#888", marginBottom: "1rem" }}>
        Edit event times and notes. Changes live-sync to the /live page (this session).
      </p>
      {schedule.map((item, i) => (
        <div key={i} style={{
          background: "#fff", border: "1px solid #e8e8ea", borderRadius: 10,
          padding: "1rem 1.25rem", marginBottom: "0.75rem",
        }}>
          <p style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.75rem" }}>{item.event}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "0.625rem" }}>
            <div>
              <label style={{ fontSize: "0.625rem", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>Current Time</label>
              <input style={IS} value={item.time} onChange={e => update(i, "time", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "0.625rem", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>Original (if delayed)</label>
              <input style={IS} value={item.originalTime || ""} onChange={e => update(i, "originalTime", e.target.value)} placeholder="e.g. 8:00 AM" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "0.625rem", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>Delay Reason (shown in red)</label>
            <input style={IS} value={item.adjustmentReason || ""}
              onChange={e => update(i, "adjustmentReason", e.target.value)}
              placeholder="e.g. Check-in is running late." />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [tab,      setTab]      = useState<"announcements" | "schedule" | "messages">("announcements");
  const [updates,  setUpdates]  = useState<Update[]>(DEFAULT_UPDATES);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    if (!authed) return;
    try {
      const s = sessionStorage.getItem("lamt_schedule");
      const u = sessionStorage.getItem("lamt_updates");
      const m = sessionStorage.getItem("lamt_messages");
      if (s) setSchedule(JSON.parse(s));
      if (u) setUpdates(JSON.parse(u));
      if (m) setMsgCount(JSON.parse(m).filter((x: ContactMessage) => !x.resolved).length);
    } catch {}
  }, [authed]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs: { key: typeof tab; label: string; badge?: number }[] = [
    { key: "announcements", label: "Announcements" },
    { key: "schedule",      label: "Schedule" },
    { key: "messages",      label: "Messages", badge: msgCount },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)" }}>
      {/* header */}
      <header style={{
        background: "#2774AE", borderBottom: "2px solid #FFB81C",
        padding: "0.75rem 3%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Image src="/LAMTBear.png" alt="LAMT" width={28} height={28} style={{ height: 28, width: "auto" }} />
          <div>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>LAMT 2026</div>
            <div style={{ fontWeight: 800, fontSize: "0.9375rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#fff" }}>Admin Panel</div>
          </div>
        </div>
        <Link href="/live" style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.8)",
          textDecoration: "none" }}>← Back to Live</Link>
      </header>

      {/* tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8ea",
        padding: "0 3%", display: "flex", gap: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "0.875rem 1.125rem",
              fontWeight: tab === t.key ? 700 : 500,
              fontSize: "0.875rem",
              color: tab === t.key ? "#2774AE" : "#888",
              borderBottom: tab === t.key ? "2px solid #2774AE" : "2px solid transparent",
              transition: "all 150ms",
              display: "flex", alignItems: "center", gap: "0.375rem",
            }}
          >
            {t.label}
            {(t.badge ?? 0) > 0 && (
              <span style={{
                background: "#e74c3c", color: "#fff",
                borderRadius: 99, fontSize: "0.5625rem", fontWeight: 800,
                padding: "1px 6px", lineHeight: 1.5,
              }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* tab content */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {tab === "announcements" && (
          <AnnouncementsTab updates={updates} setUpdates={setUpdates} />
        )}
        {tab === "schedule" && (
          <ScheduleTab schedule={schedule} setSchedule={setSchedule} />
        )}
        {tab === "messages" && <MessagesTab />}
      </div>
    </div>
  );
}
