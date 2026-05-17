"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── TOURNAMENT OVER FLAG ───────────────────────────────────────────────────
// Set to true after the event ends to show the thank-you state
const TOURNAMENT_OVER = false;

// ─── SCHEDULE DATA ──────────────────────────────────────────────────────────
// To adjust a time: change `time`/`end`, set `originalTime`/`originalEnd` to
// the original values, and add an `adjustmentReason` string.
export type ScheduleItem = {
  time: string;
  end: string;
  originalTime?: string;
  originalEnd?: string;
  adjustmentReason?: string;
  event: string;
  location: string;
};

export const SCHEDULE: ScheduleItem[] = [
  { time: "8:00 AM",  end: "8:45 AM",  event: "Contestant Check-In",    location: "Outside MS 4000A" },
  { time: "8:45 AM",  end: "9:15 AM",  event: "Opening Ceremony",       location: "MS 4000A" },
  { time: "9:15 AM",  end: "10:30 AM", event: "Secret Team Round",      location: "MS 4000A, MS 5200" },
  { time: "10:30 AM", end: "11:30 AM", event: "Algebra / Number Theory", location: "MS 4000A, MS 5200" },
  { time: "11:30 AM", end: "12:30 PM", event: "Combinatorics",          location: "MS 4000A, MS 5200" },
  { time: "12:30 PM", end: "1:30 PM",  event: "Lunch & Disputes",       location: "Court of Sciences" },
  { time: "1:30 PM",  end: "2:45 PM",  event: "Geometry",               location: "MS 4000A, MS 5200" },
  { time: "2:45 PM",  end: "4:15 PM",  event: "Guts Round",             location: "MS 4000A, MS 5200" },
  { time: "4:15 PM",  end: "6:00 PM",  event: "Activities",             location: "MS 4000A, MS 5200" },
  { time: "6:00 PM",  end: "7:00 PM",  event: "Awards Ceremony",        location: "MS 4000A" },
];

// ─── LIVE UPDATES ────────────────────────────────────────────────────────────
// Prepend new updates to the top. Format: { id, timestamp, title, body }
export type Update = { id: number; timestamp: string; title: string; body: string };

export const UPDATES: Update[] = [
  // TEMPLATE — uncomment and fill in:
  // {
  //   id: 1,
  //   timestamp: "8:45 AM",
  //   title: "Opening Ceremony starting now",
  //   body: "Please make your way to MS 4000A. We begin in 5 minutes.",
  // },
];

// ─── LOCATIONS ───────────────────────────────────────────────────────────────
const LOCATIONS = [
  { name: "MS 4000A",         label: "Mathematical Sciences 4000A", directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
  { name: "MS 5200",          label: "Mathematical Sciences 5200",  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
  { name: "MS 5138",          label: "Mathematical Sciences 5138",  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
  { name: "Court of Sciences",label: "Court of Sciences",          directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseTime(t: string): number {
  const [time, period] = t.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hrs = h;
  if (period === "PM" && h !== 12) hrs += 12;
  if (period === "AM" && h === 12) hrs = 0;
  return hrs * 60 + m;
}

function getCurrentIdx(now: Date): number {
  const mins = now.getHours() * 60 + now.getMinutes();
  let cur = -1;
  for (let i = 0; i < SCHEDULE.length; i++) {
    const s = parseTime(SCHEDULE[i].time);
    const e = parseTime(SCHEDULE[i].end);
    if (mins >= s && mins < e) return i;
    if (mins >= s) cur = i;
  }
  return cur;
}

function getProgress(now: Date, idx: number): number {
  if (idx < 0) return 0;
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = parseTime(SCHEDULE[idx].time);
  const e = parseTime(SCHEDULE[idx].end);
  return Math.min(100, Math.max(0, ((mins - s) / (e - s)) * 100));
}

// ─── SCHEDULE SECTION ────────────────────────────────────────────────────────
function ScheduleSection({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const currentIdx = getCurrentIdx(now);
  const progress   = getProgress(now, currentIdx);
  const current    = schedule[currentIdx];
  const next       = schedule[currentIdx + 1];

  return (
    <section style={{ marginBottom: "2rem" }}>
      {/* Collapsed bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          textAlign: "left",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "1rem 1.25rem",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        aria-expanded={expanded}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="section-label">Schedule</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {current && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--ucla-gold)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ucla-gold)", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                Live
              </span>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--color-text-faint)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
              aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        {current ? (
          <>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)", color: "var(--color-text)", marginBottom: "0.25rem" }}>
                {current.event}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                {current.time}–{current.end} · {current.location}
              </p>
            </div>
            {/* Progress bar */}
            <div style={{ height: 3, background: "var(--color-surface-2)", marginTop: "0.25rem" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--ucla-blue)", transition: "width 2s linear" }} />
            </div>
            {next && (
              <p style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)", marginTop: "0.125rem" }}>
                Next: {next.event} at {next.time}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Tournament begins at {schedule[0].time}</p>
        )}
      </button>

      {/* Expanded full schedule */}
      {expanded && (
        <div style={{ border: "1px solid var(--color-border)", borderTop: "none", background: "var(--color-surface)" }}>
          <div style={{ borderBottom: "1px solid var(--color-border)", padding: "0.75rem 1.25rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem",
              letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)" }}>
              Tentative Schedule — Sunday, May 17, 2026
            </p>
          </div>
          {schedule.map((item, i) => (
            <div key={i} style={{
              padding: "0.875rem 1.25rem",
              borderBottom: i < schedule.length - 1 ? "1px solid var(--color-divider)" : "none",
              background: i === currentIdx ? "rgba(39,116,174,0.07)" : "transparent",
              display: "grid",
              gridTemplateColumns: "5.5rem 1fr",
              gap: "0.75rem",
              alignItems: "start",
            }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: i === currentIdx ? "var(--ucla-blue)" : "var(--color-text-faint)", fontVariantNumeric: "tabular-nums" }}>
                  {item.time}
                </p>
                {/* Strikethrough original if adjusted */}
                {item.originalTime && (
                  <p style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)", textDecoration: "line-through" }}>
                    {item.originalTime}
                  </p>
                )}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem",
                  color: i === currentIdx ? "var(--ucla-blue)" : "var(--color-text)" }}>
                  {i === currentIdx && (
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                      background: "var(--ucla-gold)", marginRight: "0.5rem", verticalAlign: "middle",
                      animation: "pulse 2s ease-in-out infinite" }} />
                  )}
                  {item.event}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                  {item.location}
                </p>
                {item.adjustmentReason && (
                  <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: "0.25rem",
                    paddingTop: "0.25rem", borderTop: "1px solid var(--color-divider)" }}>
                    {item.adjustmentReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── UPDATES SECTION ─────────────────────────────────────────────────────────
function UpdatesSection({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return (
      <section style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span className="section-label">Live Updates</span>
          <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
        </div>
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
          padding: "2.5rem 1.25rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Updates will appear here throughout the day.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <span className="section-label">Live Updates</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem",
          fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--ucla-gold)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ucla-gold)",
            display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Latest
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {updates.map((u) => (
          <div key={u.id} style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", padding: "1rem 1.25rem" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.375rem" }}>
              {u.timestamp}
            </p>
            {u.title && (
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)",
                color: "var(--color-text)", marginBottom: "0.5rem" }}>
                {u.title}
              </p>
            )}
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
              {u.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MAP SECTION ─────────────────────────────────────────────────────────────
function MapSection() {
  const [locPerms, setLocPerms] = useState<"idle"|"granted"|"denied">("idle");
  const [coords,  setCoords]   = useState<{ lat: number; lng: number } | null>(null);

  function requestLocation() {
    if (!navigator.geolocation) { setLocPerms("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocPerms("granted"); },
      () => setLocPerms("denied")
    );
  }

  return (
    <section style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <span className="section-label">Map & Locations</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
      </div>
      <div style={{ border: "1px solid var(--color-border)", height: 220, marginBottom: "0.5rem", overflow: "hidden" }}>
        <iframe
          src="https://maps.google.com/maps?q=Mathematical+Sciences+Building+UCLA&z=16&output=embed"
          width="100%" height="100%" style={{ border: 0 }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="UCLA Campus Map" className="map-iframe"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem", marginBottom: "0.5rem" }}>
        {LOCATIONS.map((loc) => (
          <a key={loc.name}
            href={locPerms === "granted" && coords
              ? `https://www.google.com/maps/dir/${coords.lat},${coords.lng}/${encodeURIComponent(loc.label + " UCLA")}`
              : loc.directionsUrl}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem",
              border: "1px solid var(--color-border)", background: "var(--color-surface)",
              padding: "0.625rem 0.75rem", textDecoration: "none",
              transition: "border-color var(--transition-ui)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--ucla-blue)", marginTop: 2, flexShrink: 0 }} aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text)" }}>{loc.name}</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)", marginTop: 2 }}>Directions →</p>
            </div>
          </a>
        ))}
      </div>
      {locPerms === "idle" && (
        <button onClick={requestLocation}
          style={{ width: "100%", border: "1px solid var(--color-border)", background: "transparent",
            color: "var(--color-text-muted)", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.625rem",
            cursor: "pointer", transition: "border-color var(--transition-ui), color var(--transition-ui)" }}
        >
          Use My Location for Directions
        </button>
      )}
      {locPerms === "granted" && (
        <p style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)", fontWeight: 700, textAlign: "center" }}>
          ✓ Location active — directions route from your position
        </p>
      )}
      {locPerms === "denied" && (
        <p style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)", textAlign: "center" }}>
          Enable location in browser settings for routing.
        </p>
      )}
      <p style={{ marginTop: "0.5rem", textAlign: "center" }}>
        <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
          Full UCLA Campus Map →
        </a>
      </p>
    </section>
  );
}

// ─── INFO DRAWER ─────────────────────────────────────────────────────────────
function InfoDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Info & Help"
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 40,
          width: 44, height: 44,
          background: "var(--ucla-blue)", color: "#fff",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background var(--transition-ui)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          role="dialog" aria-modal aria-label="Info & Help">
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setOpen(false)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 480, margin: "0 1rem 1rem",
            background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--color-divider)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem",
                color: "var(--color-text)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Info & Help
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close"
                style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-faint)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ padding: "1rem 1.25rem", maxHeight: "65vh", overflowY: "auto",
              display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Wi-Fi */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Wi-Fi</p>
                <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                  padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", letterSpacing: "0.05em" }}>UCLA-WEB</span>
                </div>
              </div>

              {/* Emergency */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Emergency</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <a href="tel:911"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                      textDecoration: "none", transition: "border-color var(--transition-ui)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 9.79 19.79 19.79 0 0 1 1.49 1.1 2 2 0 0 1 3.5-.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/>
                    </svg>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>911</p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>Emergency</p>
                    </div>
                  </a>
                  <a href="tel:3108254321"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                      textDecoration: "none", transition: "border-color var(--transition-ui)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 9.79 19.79 19.79 0 0 1 1.49 1.1 2 2 0 0 1 3.5-.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/>
                    </svg>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>310-825-4321</p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>UCLA UCPD Non-Emergency</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Restrooms */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Restrooms</p>
                <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                  padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}><strong>MS Building</strong> — near elevators on each floor</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}><strong>Court of Sciences</strong> — Geology & Life Sciences buildings</p>
                </div>
              </div>

              {/* Disputes */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Disputes</p>
                <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", padding: "0.75rem 1rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}>Submit during <strong>Lunch at Court of Sciences</strong></p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Contact Staff</p>
                <a href="mailto:uclamathtournament@gmail.com"
                  style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                    padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                    textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <p style={{ fontSize: "0.875rem", color: "var(--ucla-blue)", fontWeight: 600 }}>uclamathtournament@gmail.com</p>
                </a>
              </div>

              {/* Campus Map */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Campus Map</p>
                <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
                  style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                    padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                    textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
                  </svg>
                  <p style={{ fontSize: "0.875rem", color: "var(--ucla-blue)", fontWeight: 600 }}>Interactive UCLA Campus Map →</p>
                </a>
              </div>

              {/* Parking */}
              <div>
                <p className="section-label" style={{ marginBottom: "0.5rem" }}>Parking</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=Lot+8+UCLA+Parking" target="_blank" rel="noopener noreferrer"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                      textDecoration: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>Lot 8 — Nearest to MS Building</p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)" }}>Get directions →</p>
                    </div>
                  </a>
                  <a href="https://transportation.ucla.edu/campus-parking/visitor-parking" target="_blank" rel="noopener noreferrer"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                      textDecoration: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>All UCLA Visitor Parking</p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)" }}>transportation.ucla.edu →</p>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LivePage() {
  // Allow admin-injected schedule/updates via sessionStorage (set by /admin)
  const [schedule, setSchedule] = useState<ScheduleItem[]>(SCHEDULE);
  const [updates,  setUpdates]  = useState<Update[]>(UPDATES);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("lamt_schedule");
      const u = sessionStorage.getItem("lamt_updates");
      if (s) setSchedule(JSON.parse(s));
      if (u) setUpdates(JSON.parse(u));
    } catch {}
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", transition: "background 0.3s" }}>
      {/* ── HEADER ─ stands alone from main site nav ─────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "var(--ucla-blue)",
        borderBottom: "2px solid var(--ucla-gold)",
        padding: "0.75rem 3%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" aria-label="Back to LAMT main site"
          style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <Image src="/LAMTBear.png" alt="LAMT" width={28} height={28}
            style={{ height: 28, width: "auto", objectFit: "contain", opacity: 0.95 }} />
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem",
            letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff"
          }}>LAMT</span>
        </Link>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "var(--ucla-gold)",
          border: "1px solid var(--ucla-gold)",
          padding: "0.25rem 0.625rem",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--ucla-gold)",
            display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Live
        </span>
      </header>

      {/* ── TOURNAMENT OVER banner ──────────────────────────────────── */}
      {TOURNAMENT_OVER && (
        <div style={{
          background: "var(--ucla-blue)", borderBottom: "1px solid rgba(255,255,255,0.12)",
          padding: "2rem 3%",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)",
            color: "#fff", letterSpacing: "0.02em", marginBottom: "0.375rem" }}>
            Thank you for coming to LAMT 2026.
          </p>
          <p style={{ fontSize: "0.9375rem", color: "var(--ucla-blue-lightest)" }}>
            We look forward to seeing you soon.
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <main style={{ padding: "1.5rem 3% 4rem" }}>
        <UpdatesSection updates={updates} />
        <ScheduleSection schedule={schedule} />
        <MapSection />
      </main>

      <InfoDrawer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
