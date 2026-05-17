"use client";

import { useState, useEffect } from "react";
import type { ScheduleItem, Update, ContactMessage, Reply } from "../live/types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "../live/types";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const ADMIN_PASS = "lamt2026";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function SL({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
      <span style={{
        fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.25em",
        textTransform: "uppercase", color: "var(--color-text-faint)", whiteSpace: "nowrap",
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
    </div>
  );
}

const BTN = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"ghost"|"danger"|"gold" }) => {
  const { variant = "ghost", style, ...rest } = props;
  const base: React.CSSProperties = {
    border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
    fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.15em",
    textTransform: "uppercase", padding: "0.375rem 0.75rem",
    display: "inline-flex", alignItems: "center", gap: "0.375rem",
    transition: "opacity 150ms",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "var(--ucla-blue)", color: "#fff" },
    gold:    { background: "var(--ucla-gold)", color: "#003B5C" },
    ghost:   { background: "transparent", color: "var(--color-text-muted)",
               border: "1px solid var(--color-border)" },
    danger:  { background: "transparent", color: "#c0392b",
               border: "1px solid rgba(192,57,43,0.35)" },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} {...rest} />;
};

// ─── MESSAGES TAB ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    function load() {
      try {
        setMessages(JSON.parse(sessionStorage.getItem("lamt_messages") || "[]"));
      } catch {}
    }
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  function save(msgs: ContactMessage[]) {
    sessionStorage.setItem("lamt_messages", JSON.stringify(msgs));
    setMessages(msgs);
  }

  function markResolved(id: number) {
    save(messages.map(m => m.id === id ? { ...m, resolved: true } : m));
  }
  function markUnresolved(id: number) {
    save(messages.map(m => m.id === id ? { ...m, resolved: false } : m));
  }
  function deleteMsg(id: number) {
    save(messages.filter(m => m.id !== id));
  }
  function addReply(id: number) {
    const body = replyDraft[id]?.trim();
    if (!body) return;
    const reply: Reply = {
      id: Date.now(),
      body,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    save(messages.map(m =>
      m.id === id
        ? { ...m, resolved: true, replies: [...(m.replies || []), reply] }
        : m
    ));
    setReplyDraft(d => ({ ...d, [id]: "" }));
    setReplyOpen(r => ({ ...r, [id]: false }));
  }

  const unresolved = messages.filter(m => !m.resolved);
  const resolved   = messages.filter(m =>  m.resolved);

  const MSG_S: React.CSSProperties = {
    background: "var(--color-bg)", border: "1px solid var(--color-border)",
    color: "var(--color-text)", fontFamily: "var(--font-body)",
    fontSize: "0.8125rem", padding: "0.5rem 0.75rem", width: "100%", outline: "none",
  };

  function renderCard(m: ContactMessage) {
    const isOpen = replyOpen[m.id];
    return (
      <div key={m.id} style={{
        border: `1px solid ${m.resolved ? "var(--color-border)" : "var(--ucla-blue)"}`,
        background: "var(--color-surface)",
        marginBottom: "0.75rem",
        opacity: m.resolved ? 0.72 : 1,
      }}>
        {/* Message header */}
        <div style={{
          padding: "0.875rem 1rem",
          borderBottom: "1px solid var(--color-divider)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
              marginBottom: "0.25rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem",
                color: "var(--color-text)" }}>{m.name}</span>
              <a href={`mailto:${m.email}`}
                style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)", textDecoration: "none" }}>
                {m.email}
              </a>
              <span style={{ fontSize: "0.5625rem", color: "var(--color-text-faint)",
                fontVariantNumeric: "tabular-nums" }}>{m.timestamp}</span>
              {m.resolved && (
                <span style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.2em",
                  textTransform: "uppercase", background: "var(--color-surface-dynamic)",
                  color: "var(--color-text-faint)", padding: "1px 5px" }}>Resolved</span>
              )}
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)",
              lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {m.message}
            </p>
          </div>
        </div>

        {/* Replies thread */}
        {(m.replies || []).length > 0 && (
          <div style={{
            borderBottom: "1px solid var(--color-divider)",
            background: "var(--color-surface-2)",
          }}>
            {(m.replies || []).map(r => (
              <div key={r.id} style={{
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderBottom: "1px solid var(--color-divider)",
                position: "relative",
              }}>
                {/* vertical thread line */}
                <div style={{
                  position: "absolute", left: "1.125rem", top: 0, bottom: 0,
                  width: 2, background: "var(--ucla-blue)", opacity: 0.25,
                }} />
                {/* arrow connector */}
                <div style={{
                  position: "absolute", left: "1rem", top: "0.875rem",
                  width: 12, height: 12,
                  borderLeft: `2px solid var(--ucla-blue)`,
                  borderBottom: `2px solid var(--ucla-blue)`,
                  opacity: 0.4,
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem",
                  marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "var(--ucla-blue)" }}>Staff Reply</span>
                  <span style={{ fontSize: "0.5625rem", color: "var(--color-text-faint)" }}>{r.timestamp}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)",
                  lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions row */}
        <div style={{
          padding: "0.625rem 1rem",
          display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
        }}>
          {!isOpen && (
            <BTN variant="primary" onClick={() => {
              setReplyOpen(r => ({ ...r, [m.id]: true }));
              // open native mail too
              window.location.href = `mailto:${m.email}?subject=Re: LAMT 2026 Message&body=Hi ${m.name},%0A%0A`;
            }}>Reply</BTN>
          )}
          {!m.resolved ? (
            <BTN variant="ghost" onClick={() => markResolved(m.id)}>Mark Resolved</BTN>
          ) : (
            <BTN variant="ghost" onClick={() => markUnresolved(m.id)}>Unresolve</BTN>
          )}
          <BTN variant="danger" onClick={() => deleteMsg(m.id)}>Delete</BTN>
        </div>

        {/* Inline reply composer */}
        {isOpen && (
          <div style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            padding: "0.875rem 1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem",
              marginBottom: "0.5rem" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: "var(--ucla-blue)" }} aria-hidden>
                <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
              </svg>
              <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--ucla-blue)" }}>Write Reply</span>
            </div>
            <textarea
              style={{ ...MSG_S, minHeight: 80, resize: "vertical", marginBottom: "0.5rem" }}
              value={replyDraft[m.id] || ""}
              onChange={e => setReplyDraft(d => ({ ...d, [m.id]: e.target.value }))}
              placeholder={`Reply to ${m.name}…`}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <BTN variant="primary"
                onClick={() => addReply(m.id)}
                disabled={!replyDraft[m.id]?.trim()}>
                Save & Mark Resolved
              </BTN>
              <BTN variant="ghost" onClick={() =>
                setReplyOpen(r => ({ ...r, [m.id]: false }))
              }>Cancel</BTN>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {messages.length === 0 ? (
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
          padding: "3rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>No messages yet.</p>
        </div>
      ) : (
        <>
          {unresolved.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <SL>Unresolved ({unresolved.length})</SL>
              {unresolved.map(renderCard)}
            </div>
          )}
          {resolved.length > 0 && (
            <div>
              <SL>Resolved ({resolved.length})</SL>
              {resolved.map(renderCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── ANNOUNCEMENTS TAB ────────────────────────────────────────────────────────
function AnnouncementsTab() {
  const [updates, setUpdates] = useState<Update[]>([...DEFAULT_UPDATES]);
  const [title,   setTitle]   = useState("");
  const [body,    setBody]    = useState("");

  function post() {
    if (!body.trim()) return;
    const u: Update = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: title.trim() || undefined,
      body: body.trim(),
    };
    const next = [u, ...updates];
    setUpdates(next);
    try { sessionStorage.setItem("lamt_updates", JSON.stringify(next)); } catch {}
    setTitle(""); setBody("");
  }

  function deleteUpdate(id: number) {
    const next = updates.filter(u => u.id !== id);
    setUpdates(next);
    try { sessionStorage.setItem("lamt_updates", JSON.stringify(next)); } catch {}
  }

  const IS: React.CSSProperties = {
    background: "var(--color-bg)", border: "1px solid var(--color-border)",
    color: "var(--color-text)", fontFamily: "var(--font-body)",
    fontSize: "0.875rem", padding: "0.5rem 0.75rem", width: "100%", outline: "none",
  };

  return (
    <div>
      <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
        marginBottom: "1.5rem" }}>
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-2)" }}>
          <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--color-text-faint)" }}>Post Update</span>
        </div>
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <input style={IS} value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Title (optional)" />
          <textarea style={{ ...IS, minHeight: 100, resize: "vertical" }}
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Update text…" required />
          <BTN variant="primary" onClick={post} disabled={!body.trim()}>Post Update</BTN>
        </div>
      </div>

      {updates.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", textAlign: "center",
          padding: "2rem" }}>No updates posted yet.</p>
      ) : (
        updates.map(u => (
          <div key={u.id} style={{ border: "1px solid var(--color-border)",
            background: "var(--color-surface)", marginBottom: "0.625rem" }}>
            <div style={{ padding: "0.875rem 1rem", display: "flex",
              alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.5625rem", color: "var(--color-text-faint)",
                  marginBottom: "0.25rem" }}>{u.timestamp}</p>
                {u.title && (
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "0.9375rem", color: "var(--color-text)", marginBottom: "0.25rem" }}>
                    {u.title}
                  </p>
                )}
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)",
                  lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{u.body}</p>
              </div>
              <BTN variant="danger" onClick={() => deleteUpdate(u.id)}>Delete</BTN>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── SCHEDULE TAB ─────────────────────────────────────────────────────────────
function ScheduleTab() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([...DEFAULT_SCHEDULE]);

  function update(i: number, key: keyof ScheduleItem, val: string) {
    const next = schedule.map((s, j) => j === i ? { ...s, [key]: val } : s);
    setSchedule(next);
    try { sessionStorage.setItem("lamt_schedule", JSON.stringify(next)); } catch {}
  }

  const IS: React.CSSProperties = {
    background: "var(--color-bg)", border: "1px solid var(--color-border)",
    color: "var(--color-text)", fontFamily: "var(--font-body)",
    fontSize: "0.75rem", padding: "0.375rem 0.625rem", outline: "none",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.8125rem" }}>
        <thead>
          <tr style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
            {["Time","End","Event","Location","Original Time","Reason"].map(h => (
              <th key={h} style={{ padding: "0.5rem 0.625rem", textAlign: "left",
                fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--color-text-faint)",
                whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((s, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-divider)" }}>
              {(["time","end","event","location","originalTime","adjustmentReason"] as (keyof ScheduleItem)[]).map(k => (
                <td key={k} style={{ padding: "0.375rem 0.5rem" }}>
                  <input
                    style={{ ...IS, width: k === "event" || k === "location" || k === "adjustmentReason" ? 180 : 88 }}
                    value={(s[k] as string) || ""}
                    onChange={e => update(i, k, e.target.value)}
                    placeholder="—"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass,   setPass]   = useState("");
  const [err,    setErr]    = useState(false);
  const [tab,    setTab]    = useState<"updates"|"schedule"|"messages">("updates");
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    function count() {
      try {
        const msgs: ContactMessage[] = JSON.parse(sessionStorage.getItem("lamt_messages") || "[]");
        setMsgCount(msgs.filter(m => !m.resolved).length);
      } catch {}
    }
    count();
    const id = setInterval(count, 3000);
    return () => clearInterval(id);
  }, []);

  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--color-bg)" }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (pass === ADMIN_PASS) setAuthed(true);
          else { setErr(true); setPass(""); }
        }}
        style={{ background: "var(--color-surface)", border: "2px solid var(--ucla-blue)",
          padding: "2rem", width: 320, display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.25rem" }}>
            LAMT 2026
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.125rem",
            color: "var(--ucla-blue)", letterSpacing: "0.05em" }}>Admin</div>
        </div>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(false); }}
          placeholder="Password"
          style={{ background: "var(--color-bg)", border: `1px solid ${err ? "#c0392b" : "var(--color-border)"}`,
            color: "var(--color-text)", fontFamily: "var(--font-body)",
            fontSize: "0.9375rem", padding: "0.625rem 0.75rem", outline: "none" }}
          autoFocus />
        {err && <p style={{ fontSize: "0.75rem", color: "#c0392b", textAlign: "center" }}>Incorrect password</p>}
        <button type="submit"
          style={{ background: "var(--ucla-blue)", color: "#fff", border: "none",
            fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "0.625rem",
            letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.625rem",
            cursor: "pointer" }}>Sign In</button>
      </form>
    </div>
  );

  const TABS: { id: typeof tab; label: string }[] = [
    { id: "updates",  label: "Announcements" },
    { id: "schedule", label: "Schedule" },
    { id: "messages", label: `Messages${msgCount > 0 ? ` (${msgCount})` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "var(--ucla-blue)",
        borderBottom: "2px solid var(--ucla-gold)",
        padding: "0.75rem 3%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem",
          letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff" }}>
          LAMT 2026 Admin
        </span>
        <a href="/live" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "var(--ucla-gold)", textDecoration: "none" }}>
          View Live Page →
        </a>
      </header>

      {/* tab bar */}
      <div style={{
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        padding: "0 3%",
        display: "flex", gap: 0,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "0.75rem 1.25rem",
              fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700,
              letterSpacing: "0.08em",
              color: tab === t.id ? "var(--ucla-blue)" : "var(--color-text-muted)",
              borderBottom: tab === t.id ? "2px solid var(--ucla-blue)" : "2px solid transparent",
              position: "relative",
            }}
          >
            {t.label}
            {t.id === "messages" && msgCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                background: "#c0392b", color: "#fff",
                fontSize: "0.4375rem", fontWeight: 800,
                borderRadius: "9999px", width: 14, height: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{msgCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* content */}
      <main style={{ padding: "1.5rem 3% 4rem", maxWidth: 900, margin: "0 auto" }}>
        {tab === "updates"  && <AnnouncementsTab />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "messages" && <MessagesTab />}
      </main>
    </div>
  );
}
