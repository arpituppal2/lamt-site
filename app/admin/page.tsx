"use client";

import { useState, useEffect } from "react";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "../live/types";
import type { ScheduleItem, Update, ContactMessage } from "../live/types";

const ADMIN_CODE = "BRUINSATLAMT";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "var(--color-text-faint)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  fontFamily: "var(--font-body)",
  fontSize: "0.875rem",
  padding: "0.625rem 0.75rem",
  width: "100%",
  outline: "none",
};

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8125rem",
  letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)",
};

const DIVIDER = <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />;

type Tab = "announcements" | "schedule" | "messages";

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [code,     setCode]     = useState("");
  const [codeErr,  setCodeErr]  = useState("");
  const [tab,      setTab]      = useState<Tab>("announcements");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE.map(i => ({ ...i })));
  const [updates,  setUpdates]  = useState<Update[]>(DEFAULT_UPDATES.map(u => ({ ...u })));
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [saved,    setSaved]    = useState(false);

  // New update form
  const [newTitle,     setNewTitle]     = useState("");
  const [newTimestamp, setNewTimestamp] = useState("");
  const [newBody,      setNewBody]      = useState("");

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("lamt_schedule");
      const u = sessionStorage.getItem("lamt_updates");
      const m = sessionStorage.getItem("lamt_messages");
      if (s) setSchedule(JSON.parse(s));
      if (u) setUpdates(JSON.parse(u));
      if (m) setMessages(JSON.parse(m));
    } catch {}
  }, []);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === ADMIN_CODE) { setAuthed(true); setCodeErr(""); }
    else setCodeErr("Incorrect access code.");
  }

  function updateScheduleItem(idx: number, field: keyof ScheduleItem, value: string) {
    setSchedule(prev => {
      const next = [...prev];
      const item = { ...next[idx] };
      if ((field === "time" || field === "end") && !item.originalTime) {
        if (field === "time") item.originalTime = item.time;
        if (field === "end")  item.originalEnd  = item.end;
      }
      (item as Record<string, string>)[field] = value;
      next[idx] = item;
      return next;
    });
    setSaved(false);
  }

  function addUpdate() {
    if (!newTitle && !newBody) return;
    const u: Update = {
      id: Date.now(),
      timestamp: newTimestamp || new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: newTitle,
      body: newBody,
    };
    setUpdates(prev => [u, ...prev]);
    setNewTitle(""); setNewTimestamp(""); setNewBody("");
    setSaved(false);
  }

  function removeUpdate(id: number) {
    setUpdates(prev => prev.filter(u => u.id !== id));
    setSaved(false);
  }

  function resolveMessage(id: number) {
    setMessages(prev => {
      const next = prev.map(m => m.id === id ? { ...m, resolved: true } : m);
      sessionStorage.setItem("lamt_messages", JSON.stringify(next));
      return next;
    });
  }

  function unresolveMessage(id: number) {
    setMessages(prev => {
      const next = prev.map(m => m.id === id ? { ...m, resolved: false } : m);
      sessionStorage.setItem("lamt_messages", JSON.stringify(next));
      return next;
    });
  }

  function deleteMessage(id: number) {
    setMessages(prev => {
      const next = prev.filter(m => m.id !== id);
      sessionStorage.setItem("lamt_messages", JSON.stringify(next));
      return next;
    });
  }

  function publish() {
    try {
      sessionStorage.setItem("lamt_schedule", JSON.stringify(schedule));
      sessionStorage.setItem("lamt_updates",  JSON.stringify(updates));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  }

  // ── AUTH GATE ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "3%" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ borderBottom: "2px solid var(--ucla-gold)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem",
              letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text)" }}>
              LAMT Admin
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              Enter the access code to continue.
            </p>
          </div>
          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="Access Code">
              <input type="password" value={code}
                onChange={e => { setCode(e.target.value); setCodeErr(""); }}
                placeholder="Enter code" style={INPUT_STYLE} autoFocus autoComplete="off" />
            </Field>
            {codeErr && <p style={{ fontSize: "0.8125rem", color: "#c0392b", fontWeight: 600 }}>{codeErr}</p>}
            <button type="submit" className="btn-filled">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  const unresolvedCount = messages.filter(m => !m.resolved).length;

  // ── ADMIN PANEL ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Header */}
      <header style={{
        background: "var(--ucla-blue)", borderBottom: "2px solid var(--ucla-gold)",
        padding: "0.875rem 3%", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem",
          letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff" }}>
          LAMT Admin
        </span>
        <button onClick={publish} style={{
          background: saved ? "var(--ucla-gold)" : "transparent",
          border: `1px solid ${saved ? "var(--ucla-gold)" : "rgba(255,255,255,0.5)"}`,
          color: saved ? "#003B5C" : "#fff",
          fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 800,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "0.375rem 0.875rem", cursor: "pointer", transition: "all 200ms",
        }}>
          {saved ? "Published" : "Publish Changes"}
        </button>
      </header>

      {/* Tab nav */}
      <div style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)",
        display: "flex", padding: "0 3%" }}>
        {([
          { id: "announcements", label: "Announcements" },
          { id: "schedule",      label: "Schedule" },
          { id: "messages",      label: `Messages${unresolvedCount > 0 ? ` (${unresolvedCount})` : ""}` },
        ] as { id: Tab; label: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: "transparent", border: "none", borderBottom: tab === t.id ? "2px solid var(--ucla-blue)" : "2px solid transparent",
              padding: "0.75rem 1rem", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: tab === t.id ? "var(--ucla-blue)" : "var(--color-text-muted)",
              transition: "color 150ms, border-color 150ms",
              marginBottom: "-1px",
            }}>
            {t.label}
            {t.id === "messages" && unresolvedCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginLeft: "0.375rem", background: "#c0392b", color: "#fff",
                width: 18, height: 18, borderRadius: "50%", fontSize: "0.625rem", fontWeight: 800,
              }}>{unresolvedCount}</span>
            )}
          </button>
        ))}
      </div>

      <main style={{ padding: "1.5rem 3% 4rem", maxWidth: 860 }}>

        {/* ── ANNOUNCEMENTS TAB ── */}
        {tab === "announcements" && (
          <>
            <section style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={SECTION_LABEL}>Post Announcement</span>
                {DIVIDER}
              </div>
              <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <Field label="Title">
                    <input style={INPUT_STYLE} value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Opening Ceremony starting now" />
                  </Field>
                  <Field label="Timestamp (auto if blank)">
                    <input style={INPUT_STYLE} value={newTimestamp}
                      onChange={e => setNewTimestamp(e.target.value)} placeholder="e.g. 8:45 AM" />
                  </Field>
                </div>
                <Field label="Body">
                  <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: "vertical" }}
                    value={newBody} onChange={e => setNewBody(e.target.value)}
                    placeholder="Announcement text. Supports newlines." />
                </Field>
                <button onClick={addUpdate} className="btn-filled"
                  style={{ alignSelf: "flex-start" }}
                  disabled={!newTitle && !newBody}>
                  Add Announcement
                </button>
              </div>
            </section>

            {updates.length > 0 && (
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span style={SECTION_LABEL}>Active Announcements</span>
                  {DIVIDER}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {updates.map((u) => (
                    <div key={u.id} style={{
                      border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      padding: "0.875rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem",
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.25rem" }}>
                          {u.timestamp}
                        </p>
                        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)", marginBottom: "0.25rem" }}>{u.title}</p>
                        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{u.body}</p>
                      </div>
                      <button onClick={() => removeUpdate(u.id)}
                        style={{ background: "transparent", border: "1px solid var(--color-border)",
                          padding: "0.25rem 0.5rem", fontSize: "0.6875rem", fontWeight: 700,
                          letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                          color: "var(--color-text-faint)", flexShrink: 0 }}
                        aria-label="Remove announcement">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── SCHEDULE TAB ── */}
        {tab === "schedule" && (
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={SECTION_LABEL}>Schedule Editor</span>
              {DIVIDER}
              <span style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)", whiteSpace: "nowrap" }}>
                Editing a time saves the original automatically
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {schedule.map((item, i) => (
                <div key={i} style={{
                  border: "1px solid var(--color-border)", background: "var(--color-surface)",
                  padding: "1rem 1.25rem",
                }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem",
                    color: "var(--color-text)", marginBottom: "0.75rem" }}>
                    {item.event}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <Field label={item.originalTime ? `Start (was ${item.originalTime})` : "Start Time"}>
                      <input style={INPUT_STYLE} value={item.time}
                        onChange={e => updateScheduleItem(i, "time", e.target.value)} />
                    </Field>
                    <Field label={item.originalEnd ? `End (was ${item.originalEnd})` : "End Time"}>
                      <input style={INPUT_STYLE} value={item.end}
                        onChange={e => updateScheduleItem(i, "end", e.target.value)} />
                    </Field>
                    <Field label="Location">
                      <input style={INPUT_STYLE} value={item.location}
                        onChange={e => updateScheduleItem(i, "location", e.target.value)} />
                    </Field>
                  </div>
                  {(item.originalTime || item.adjustmentReason !== undefined) && (
                    <Field label="Reason for Adjustment">
                      <input style={INPUT_STYLE} value={item.adjustmentReason || ""}
                        onChange={e => updateScheduleItem(i, "adjustmentReason", e.target.value)}
                        placeholder="e.g. Check-in is running late." />
                    </Field>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem",
              borderTop: "1px solid var(--color-divider)",
              display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button onClick={publish} className="btn-filled">
                {saved ? "Published" : "Publish to /live"}
              </button>
              {saved && (
                <p style={{ fontSize: "0.8125rem", color: "var(--ucla-blue)", fontWeight: 600 }}>
                  Changes live — reload /live to verify.
                </p>
              )}
            </div>
          </section>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === "messages" && (
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={SECTION_LABEL}>Inbox</span>
              {DIVIDER}
              {unresolvedCount > 0 && (
                <span style={{ fontSize: "0.6875rem", color: "#c0392b", fontWeight: 700,
                  whiteSpace: "nowrap" }}>
                  {unresolvedCount} unresolved
                </span>
              )}
            </div>
            {messages.length === 0 ? (
              <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                padding: "2.5rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  No messages yet.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {messages.map(m => (
                  <div key={m.id} style={{
                    border: `1px solid ${m.resolved ? "var(--color-border)" : "var(--ucla-blue)"}`,
                    background: "var(--color-surface)",
                    padding: "1rem 1.25rem",
                    opacity: m.resolved ? 0.6 : 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                      gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>
                            {m.name}
                          </p>
                          <a href={`mailto:${m.email}`} style={{ fontSize: "0.75rem", color: "var(--ucla-blue)",
                            fontWeight: 600, textDecoration: "none" }}>{m.email}</a>
                          {m.resolved && (
                            <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em",
                              textTransform: "uppercase", color: "var(--color-text-faint)",
                              border: "1px solid var(--color-border)", padding: "1px 5px" }}>
                              Resolved
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)",
                          marginTop: "0.125rem" }}>{m.timestamp}</p>
                      </div>
                      <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                        {!m.resolved ? (
                          <>
                            <a href={`mailto:${m.email}?subject=Re: Your message to LAMT Staff`}
                              style={{
                                background: "var(--ucla-blue)", color: "#fff",
                                border: "none", padding: "0.25rem 0.625rem",
                                fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em",
                                textTransform: "uppercase", textDecoration: "none",
                                display: "inline-flex", alignItems: "center",
                              }}>
                              Reply
                            </a>
                            <button onClick={() => resolveMessage(m.id)}
                              style={{ background: "transparent", border: "1px solid var(--color-border)",
                                padding: "0.25rem 0.625rem", fontSize: "0.6875rem", fontWeight: 800,
                                letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                                color: "var(--color-text-faint)" }}>
                              Mark Resolved
                            </button>
                          </>
                        ) : (
                          <button onClick={() => unresolveMessage(m.id)}
                            style={{ background: "transparent", border: "1px solid var(--color-border)",
                              padding: "0.25rem 0.625rem", fontSize: "0.6875rem", fontWeight: 800,
                              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                              color: "var(--color-text-faint)" }}>
                            Unresolve
                          </button>
                        )}
                        <button onClick={() => deleteMessage(m.id)}
                          style={{ background: "transparent", border: "1px solid #c0392b30",
                            padding: "0.25rem 0.625rem", fontSize: "0.6875rem", fontWeight: 800,
                            letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                            color: "#c0392b" }}
                          aria-label="Delete message">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)",
                      lineHeight: 1.65, paddingTop: "0.5rem",
                      borderTop: "1px solid var(--color-divider)" }}>
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
