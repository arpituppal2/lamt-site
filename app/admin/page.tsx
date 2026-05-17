"use client";

import { useState, useEffect } from "react";
import { SCHEDULE as DEFAULT_SCHEDULE, UPDATES as DEFAULT_UPDATES } from "../live/page";
import type { ScheduleItem, Update } from "../live/page";

const ADMIN_CODE = "BRUINSATLAMT";

// ─── FIELD ────────────────────────────────────────────────────────────────────
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

const TEXTAREA_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  minHeight: 80,
  resize: "vertical",
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [code,     setCode]     = useState("");
  const [error,    setError]    = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE.map(i => ({ ...i })));
  const [updates,  setUpdates]  = useState<Update[]>(DEFAULT_UPDATES.map(u => ({ ...u })));
  const [saved,    setSaved]    = useState(false);

  // New update form
  const [newTitle,    setNewTitle]    = useState("");
  const [newTimestamp,setNewTimestamp]= useState("");
  const [newBody,     setNewBody]     = useState("");

  useEffect(() => {
    // Pre-load any session overrides already saved
    try {
      const s = sessionStorage.getItem("lamt_schedule");
      const u = sessionStorage.getItem("lamt_updates");
      if (s) setSchedule(JSON.parse(s));
      if (u) setUpdates(JSON.parse(u));
    } catch {}
  }, []);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === ADMIN_CODE) {
      setAuthed(true); setError("");
    } else {
      setError("Incorrect access code.");
    }
  }

  function updateScheduleItem(idx: number, field: keyof ScheduleItem, value: string) {
    setSchedule(prev => {
      const next = [...prev];
      const item = { ...next[idx] };
      // If the time field is being changed and originalTime isn't set yet, save it
      if ((field === "time" || field === "end") && !item.originalTime) {
        if (field === "time")  item.originalTime = item.time;
        if (field === "end")   item.originalEnd  = item.end;
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

  function publish() {
    try {
      sessionStorage.setItem("lamt_schedule", JSON.stringify(schedule));
      sessionStorage.setItem("lamt_updates",  JSON.stringify(updates));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  }

  // ── AUTH GATE ────────────────────────────────────────────────────────────
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
              <input
                type="password"
                value={code}
                onChange={e => { setCode(e.target.value); setError(""); }}
                placeholder="Enter code"
                style={INPUT_STYLE}
                autoFocus
                autoComplete="off"
              />
            </Field>
            {error && (
              <p style={{ fontSize: "0.8125rem", color: "#c0392b", fontWeight: 600 }}>{error}</p>
            )}
            <button type="submit" className="btn-filled">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  // ── ADMIN PANEL ─────────────────────────────────────────────────────────
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
        <button
          onClick={publish}
          style={{
            background: saved ? "var(--ucla-gold)" : "transparent",
            border: `1px solid ${saved ? "var(--ucla-gold)" : "rgba(255,255,255,0.5)"}`,
            color: saved ? "#003B5C" : "#fff",
            fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "0.375rem 0.875rem", cursor: "pointer",
            transition: "all 200ms",
          }}
        >
          {saved ? "Published" : "Publish Changes"}
        </button>
      </header>

      <main style={{ padding: "1.5rem 3% 4rem", maxWidth: 800 }}>

        {/* ── POST ANNOUNCEMENT ──────────────────────────────────────── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8125rem",
              letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)" }}>
              Post Announcement
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
          </div>
          <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
            padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Title">
                <input style={INPUT_STYLE} value={newTitle}
                  onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Opening Ceremony starting now" />
              </Field>
              <Field label="Timestamp (auto if blank)">
                <input style={INPUT_STYLE} value={newTimestamp}
                  onChange={e => setNewTimestamp(e.target.value)} placeholder="e.g. 8:45 AM" />
              </Field>
            </div>
            <Field label="Body">
              <textarea style={TEXTAREA_STYLE} value={newBody}
                onChange={e => setNewBody(e.target.value)}
                placeholder="Announcement text. Supports newlines." />
            </Field>
            <button onClick={addUpdate} className="btn-filled"
              style={{ alignSelf: "flex-start" }}
              disabled={!newTitle && !newBody}>
              Add Announcement
            </button>
          </div>
        </section>

        {/* ── EXISTING ANNOUNCEMENTS ─────────────────────────────────── */}
        {updates.length > 0 && (
          <section style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8125rem",
                letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)" }}>
                Active Announcements
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
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
                      color: "var(--color-text-faint)", flexShrink: 0,
                      transition: "border-color var(--transition-ui), color var(--transition-ui)" }}
                    aria-label="Remove announcement">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SCHEDULE EDITOR ────────────────────────────────────────── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8125rem",
              letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)" }}>
              Schedule
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
            <span style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)" }}>Changing a time auto-saves the original</span>
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
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
        </section>

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-divider)",
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
      </main>
    </div>
  );
}
