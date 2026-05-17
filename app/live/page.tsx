"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ScheduleItem, Update, ContactMessage } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

// ─── TOURNAMENT OVER FLAG ───────────────────────────────────────────────────
// Set to true after the event ends
const TOURNAMENT_OVER = false;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseTime(t: string): number {
  const [time, period] = t.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hrs = h;
  if (period === "PM" && h !== 12) hrs += 12;
  if (period === "AM" && h === 12) hrs = 0;
  return hrs * 60 + m;
}

function getCurrentIdx(schedule: ScheduleItem[], now: Date): number {
  const mins = now.getHours() * 60 + now.getMinutes();
  let cur = -1;
  for (let i = 0; i < schedule.length; i++) {
    const s = parseTime(schedule[i].time);
    const e = parseTime(schedule[i].end);
    if (mins >= s && mins < e) return i;
    if (mins >= s) cur = i;
  }
  return cur;
}

function getProgress(schedule: ScheduleItem[], now: Date, idx: number): number {
  if (idx < 0) return 0;
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = parseTime(schedule[idx].time);
  const e = parseTime(schedule[idx].end);
  return Math.min(100, Math.max(0, ((mins - s) / (e - s)) * 100));
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
      <span style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.6875rem",
        letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-text-faint)",
        whiteSpace: "nowrap",
      }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
    </div>
  );
}

// ─── SCHEDULE SECTION ────────────────────────────────────────────────────────
function ScheduleSection({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const currentIdx = getCurrentIdx(schedule, now);
  const progress   = getProgress(schedule, now, currentIdx);
  const current    = schedule[currentIdx];
  const next       = schedule[currentIdx + 1];

  return (
    <section style={{ marginBottom: "2rem" }}>
      <SectionHeader title="Schedule" />
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", textAlign: "left",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderBottom: expanded ? "none" : "1px solid var(--color-border)",
          padding: "1rem 1.25rem", cursor: "pointer",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}
        aria-expanded={expanded}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem",
            letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-muted)",
          }}>Sunday, May 17, 2026</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {current && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--ucla-gold)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ucla-gold)",
                  display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                Live
              </span>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--color-text-faint)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
              aria-hidden><path d="M6 9l6 6 6-6" /></svg>
          </div>
        </div>
        {current ? (
          <>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)",
                color: "var(--color-text)", marginBottom: "0.25rem" }}>{current.event}</p>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                {current.time}–{current.end} · {current.location}
              </p>
            </div>
            <div style={{ height: 3, background: "var(--color-surface-2)", marginTop: "0.125rem" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--ucla-blue)", transition: "width 2s linear" }} />
            </div>
            {next && (
              <p style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)", marginTop: "0.125rem" }}>
                Next: {next.event} at {next.time}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Tournament begins at {schedule[0].time}
          </p>
        )}
      </button>

      {expanded && (
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <div style={{ borderBottom: "1px solid var(--color-border)", padding: "0.625rem 1.25rem",
            background: "var(--color-surface-2)" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)" }}>
              Tentative Schedule
            </p>
          </div>
          {schedule.map((item, i) => (
            <div key={i} style={{
              padding: "0.875rem 1.25rem",
              borderBottom: i < schedule.length - 1 ? "1px solid var(--color-divider)" : "none",
              background: i === currentIdx ? "rgba(39,116,174,0.07)" : "transparent",
              display: "grid", gridTemplateColumns: "5.5rem 1fr", gap: "0.75rem", alignItems: "start",
            }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, fontVariantNumeric: "tabular-nums",
                  color: i === currentIdx ? "var(--ucla-blue)" : "var(--color-text-faint)" }}>
                  {item.time}
                </p>
                {item.originalTime && (
                  <p style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)", textDecoration: "line-through" }}>
                    was {item.originalTime}
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
                  <p style={{ fontSize: "0.6875rem", color: "#c0392b", marginTop: "0.25rem",
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
  return (
    <section style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.6875rem",
          letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-text-faint)",
          whiteSpace: "nowrap",
        }}>Live Updates</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
        {updates.length > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.375rem",
            fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--ucla-gold)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ucla-gold)",
              display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            Latest
          </span>
        )}
      </div>
      {updates.length === 0 ? (
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
          padding: "2.5rem 1.25rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Updates will appear here throughout the day.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {updates.map((u) => (
            <div key={u.id} style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
              padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.375rem" }}>
                {u.timestamp}
              </p>
              {u.title && (
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)",
                  color: "var(--color-text)", marginBottom: "0.5rem" }}>{u.title}</p>
              )}
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                {u.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── MAP SECTION ─────────────────────────────────────────────────────────────
// Location pin data: approximate pixel positions on the 540×420 campus map image
const MAP_PINS = [
  { id: "ms",  label: "MS Building",     shortLabel: "MS",  top: "52%", left: "61%",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
  { id: "cos", label: "Court of Sciences", shortLabel: "CoS", top: "74%", left: "55%",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA" },
  { id: "lot8",label: "Lot 8 Parking",   shortLabel: "P8",  top: "38%", left: "78%",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=UCLA+Parking+Structure+8" },
  { id: "bru", label: "Bruin Walk Entry", shortLabel: "BW",  top: "64%", left: "35%",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Bruin+Walk+UCLA" },
];

function MapSection() {
  const [expanded, setExpanded] = useState(false);
  const [locPerms, setLocPerms] = useState<"idle"|"granted"|"denied">("idle");
  const [coords,  setCoords]   = useState<{ lat: number; lng: number } | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);

  function requestLocation() {
    if (!navigator.geolocation) { setLocPerms("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocPerms("granted"); },
      () => setLocPerms("denied")
    );
  }

  function dirUrl(pin: typeof MAP_PINS[0]) {
    if (locPerms === "granted" && coords) {
      return `https://www.google.com/maps/dir/${coords.lat},${coords.lng}/${encodeURIComponent(pin.label + " UCLA")}`;
    }
    return pin.directionsUrl;
  }

  return (
    <section style={{ marginBottom: "2rem" }}>
      <SectionHeader title="Map & Locations" />

      {/* ── COLLAPSED: annotated campus map thumbnail ── */}
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: "100%", background: "none", border: "1px solid var(--color-border)",
          cursor: "pointer", padding: 0, display: "block", position: "relative", overflow: "hidden",
        }}
        aria-label="Open full map"
      >
        {/* Placeholder map — UCLA campus color-coded SVG */}
        <svg viewBox="0 0 540 280" width="100%" style={{ display: "block" }} aria-hidden>
          {/* Base campus ground */}
          <rect width="540" height="280" fill="#e8e4dc" />
          {/* Campus walkways */}
          <rect x="240" y="0" width="18" height="280" fill="#d4cfc5" />
          <rect x="0" y="130" width="540" height="16" fill="#d4cfc5" />
          <rect x="120" y="80" width="12" height="200" fill="#d4cfc5" />
          <rect x="380" y="60" width="12" height="220" fill="#d4cfc5" />
          {/* Generic campus buildings (gray) */}
          <rect x="30" y="30" width="70" height="55" rx="1" fill="#c8c4bc" />
          <rect x="120" y="20" width="90" height="50" rx="1" fill="#c8c4bc" />
          <rect x="300" y="20" width="65" height="45" rx="1" fill="#c8c4bc" />
          <rect x="400" y="25" width="80" height="50" rx="1" fill="#c8c4bc" />
          <rect x="30" y="155" width="75" height="55" rx="1" fill="#c8c4bc" />
          <rect x="130" y="160" width="55" height="45" rx="1" fill="#c8c4bc" />
          <rect x="420" y="155" width="85" height="60" rx="1" fill="#c8c4bc" />
          <rect x="30" y="215" width="60" height="45" rx="1" fill="#c8c4bc" />
          <rect x="410" y="220" width="90" height="45" rx="1" fill="#c8c4bc" />
          {/* MS Building — highlighted blue */}
          <rect x="300" y="115" width="70" height="60" rx="1" fill="#2774AE" opacity="0.85" />
          <text x="335" y="149" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">MS</text>
          {/* Court of Sciences — highlighted gold */}
          <rect x="255" y="185" width="80" height="45" rx="1" fill="#FFB81C" opacity="0.85" />
          <text x="295" y="212" textAnchor="middle" fill="#003B5C" fontSize="8" fontWeight="700" fontFamily="sans-serif">CoS</text>
          {/* Lot 8 Parking — highlighted */}
          <rect x="395" y="85" width="55" height="38" rx="1" fill="#6b8e6e" opacity="0.8" />
          <text x="422" y="108" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">P8</text>
          {/* Bruin Walk */}
          <rect x="148" y="128" width="14" height="5" rx="1" fill="#888" />
          {/* Compass */}
          <text x="510" y="268" textAnchor="middle" fill="#888" fontSize="10" fontFamily="sans-serif">N ↑</text>
          {/* "Tap to expand" overlay */}
          <rect x="0" y="0" width="540" height="280" fill="rgba(0,0,0,0)" />
        </svg>
        {/* Location labels overlay */}
        <div style={{ position: "absolute", top: "41%", left: "61%", transform: "translate(-50%,-50%)" }}>
          <span style={{ background: "var(--ucla-blue)", color: "#fff", fontSize: "0.5625rem",
            fontWeight: 800, letterSpacing: "0.08em", padding: "2px 6px", textTransform: "uppercase" }}>
            MS Building
          </span>
        </div>
        <div style={{ position: "absolute", top: "73%", left: "54%", transform: "translate(-50%,-50%)" }}>
          <span style={{ background: "var(--ucla-gold)", color: "#003B5C", fontSize: "0.5625rem",
            fontWeight: 800, letterSpacing: "0.08em", padding: "2px 6px", textTransform: "uppercase" }}>
            Court of Sciences
          </span>
        </div>
        <div style={{ position: "absolute", top: "33%", left: "79%", transform: "translate(-50%,-50%)" }}>
          <span style={{ background: "#3d6b40", color: "#fff", fontSize: "0.5625rem",
            fontWeight: 800, letterSpacing: "0.08em", padding: "2px 6px", textTransform: "uppercase" }}>
            Parking Lot 8
          </span>
        </div>
        {/* Tap hint */}
        <div style={{
          position: "absolute", bottom: 8, right: 10,
          background: "rgba(0,0,0,0.55)", color: "#fff",
          fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.1em",
          padding: "3px 8px", textTransform: "uppercase",
        }}>
          Tap to expand
        </div>
      </button>

      {/* ── EXPANDED MAP MODAL ── */}
      {expanded && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.75)" }}
          onClick={() => { setExpanded(false); setActivePin(null); }}
          role="dialog" aria-modal aria-label="Campus Map"
        >
          <div
            style={{ position: "relative", width: "min(540px, 95vw)",
              background: "var(--color-bg)", border: "2px solid var(--ucla-blue)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ background: "var(--ucla-blue)", padding: "0.625rem 1rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: "2px solid var(--ucla-gold)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8125rem",
                letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff" }}>
                UCLA Campus — LAMT Venues
              </span>
              <button onClick={() => { setExpanded(false); setActivePin(null); }}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)",
                  cursor: "pointer", padding: "0.25rem", display: "flex" }} aria-label="Close map">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Map + pins */}
            <div style={{ position: "relative" }}>
              <svg viewBox="0 0 540 320" width="100%" style={{ display: "block" }} aria-hidden>
                <rect width="540" height="320" fill="#e8e4dc" />
                <rect x="240" y="0" width="18" height="320" fill="#d4cfc5" />
                <rect x="0" y="150" width="540" height="16" fill="#d4cfc5" />
                <rect x="120" y="80" width="12" height="240" fill="#d4cfc5" />
                <rect x="380" y="60" width="12" height="260" fill="#d4cfc5" />
                <rect x="30" y="30" width="70" height="55" rx="1" fill="#c8c4bc" />
                <rect x="120" y="20" width="90" height="50" rx="1" fill="#c8c4bc" />
                <rect x="300" y="20" width="65" height="45" rx="1" fill="#c8c4bc" />
                <rect x="400" y="25" width="80" height="50" rx="1" fill="#c8c4bc" />
                <rect x="30" y="175" width="75" height="55" rx="1" fill="#c8c4bc" />
                <rect x="130" y="180" width="55" height="45" rx="1" fill="#c8c4bc" />
                <rect x="420" y="175" width="85" height="60" rx="1" fill="#c8c4bc" />
                <rect x="30" y="245" width="60" height="50" rx="1" fill="#c8c4bc" />
                <rect x="410" y="250" width="90" height="50" rx="1" fill="#c8c4bc" />
                {/* MS Building */}
                <rect x="300" y="130" width="70" height="65" rx="1" fill="#2774AE" opacity="0.9" />
                <text x="335" y="168" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">MS</text>
                {/* Court of Sciences */}
                <rect x="255" y="210" width="80" height="50" rx="1" fill="#FFB81C" opacity="0.9" />
                <text x="295" y="239" textAnchor="middle" fill="#003B5C" fontSize="9" fontWeight="800" fontFamily="sans-serif">CoS</text>
                {/* Lot 8 */}
                <rect x="395" y="95" width="55" height="42" rx="1" fill="#3d6b40" opacity="0.85" />
                <text x="422" y="120" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">Lot 8</text>
                <text x="510" y="308" textAnchor="middle" fill="#888" fontSize="11" fontFamily="sans-serif">N ↑</text>
              </svg>
              {/* Interactive pins */}
              {MAP_PINS.map(pin => (
                <button
                  key={pin.id}
                  onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                  style={{
                    position: "absolute", top: pin.top, left: pin.left,
                    transform: "translate(-50%,-100%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                  }}
                  aria-label={pin.label}
                >
                  <svg width="22" height="28" viewBox="0 0 22 28" aria-hidden>
                    <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 17 11 17s11-8.75 11-17C22 4.925 17.075 0 11 0z"
                      fill={activePin === pin.id ? "var(--ucla-gold)" : "var(--ucla-blue)"} />
                    <circle cx="11" cy="11" r="4" fill="white" />
                  </svg>
                </button>
              ))}
              {/* Active pin popup */}
              {activePin && (() => {
                const pin = MAP_PINS.find(p => p.id === activePin)!;
                return (
                  <div style={{
                    position: "absolute", top: pin.top, left: pin.left,
                    transform: "translate(-50%, -240%)",
                    background: "var(--color-bg)", border: "2px solid var(--ucla-blue)",
                    padding: "0.5rem 0.75rem", minWidth: 160, zIndex: 10,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  }}>
                    <p style={{ fontWeight: 800, fontSize: "0.8125rem", color: "var(--color-text)",
                      marginBottom: "0.375rem", letterSpacing: "0.02em" }}>{pin.label}</p>
                    <a href={dirUrl(pin)} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--ucla-blue)",
                        textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Get Directions →
                    </a>
                  </div>
                );
              })()}
            </div>

            {/* Location list */}
            <div style={{ borderTop: "1px solid var(--color-border)", padding: "0.75rem 1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {MAP_PINS.map(pin => (
                  <a key={pin.id} href={dirUrl(pin)} target="_blank" rel="noopener noreferrer"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      padding: "0.5rem 0.75rem", textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text)" }}>
                      {pin.label}
                    </span>
                  </a>
                ))}
              </div>
              {locPerms === "idle" && (
                <button onClick={requestLocation}
                  style={{ width: "100%", marginTop: "0.5rem", border: "1px solid var(--color-border)",
                    background: "transparent", color: "var(--color-text-muted)", fontSize: "0.6875rem",
                    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "0.5rem", cursor: "pointer" }}>
                  Use My Location for Directions
                </button>
              )}
              {locPerms === "granted" && (
                <p style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)", fontWeight: 700,
                  textAlign: "center", marginTop: "0.375rem" }}>
                  Location active — routing from your position
                </p>
              )}
              <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                  Full Interactive Campus Map →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── INFO & HELP SECTION (inline, not floating button) ────────────────────────
function InfoSection() {
  const [open, setOpen] = useState(false);

  return (
    <section style={{ marginBottom: "2rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderBottom: open ? "none" : "1px solid var(--color-border)",
          padding: "1rem 1.25rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
        aria-expanded={open}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color: "var(--ucla-blue)" }} aria-hidden>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem",
            letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)" }}>
            Info & Help
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "var(--color-text-faint)", transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
          aria-hidden><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
          padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Wi-Fi */}
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Wi-Fi</p>
            <div style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)",
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
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Emergency</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {[
                { href: "tel:911", label: "911", sub: "Emergency", stroke: "#c0392b" },
                { href: "tel:3108254321", label: "310-825-4321", sub: "UCLA UCPD Non-Emergency", stroke: "var(--ucla-blue)" },
              ].map(item => (
                <a key={item.href} href={item.href}
                  style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)",
                    padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                    textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 9.79 19.79 19.79 0 0 1 1.49 1.1 2 2 0 0 1 3.5-.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/>
                  </svg>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>{item.label}</p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Restrooms */}
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Restrooms</p>
            <div style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)",
              padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}><strong>MS Building</strong> — near elevators on each floor</p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}><strong>Court of Sciences</strong> — Geology & Life Sciences buildings</p>
            </div>
          </div>

          {/* Disputes */}
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Disputes</p>
            <div style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)", padding: "0.75rem 1rem" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}>Submit during <strong>Lunch at Court of Sciences</strong></p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Contact Staff</p>
            <a href="mailto:uclamathtournament@gmail.com"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)",
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
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Campus Map</p>
            <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)",
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
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "0.5rem" }}>Parking</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {[
                { href: "https://www.google.com/maps/dir/?api=1&destination=Lot+8+UCLA+Parking", label: "Lot 8 — Nearest to MS Building", sub: "Get directions →" },
                { href: "https://transportation.ucla.edu/campus-parking/visitor-parking", label: "All UCLA Visitor Parking", sub: "transportation.ucla.edu →" },
              ].map(item => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                  style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)",
                    padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                    textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)" }}>{item.label}</p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--ucla-blue)" }}>{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── CONTACT / SEND MESSAGE SECTION ──────────────────────────────────────────
function ContactSection() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [msg,     setMsg]     = useState("");
  const [status,  setStatus]  = useState<"idle"|"sent"|"error">("idle");

  const INPUT_S: React.CSSProperties = {
    background: "var(--color-bg)", border: "1px solid var(--color-border)",
    color: "var(--color-text)", fontFamily: "var(--font-body)",
    fontSize: "0.875rem", padding: "0.625rem 0.75rem", width: "100%", outline: "none",
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !msg) return;
    try {
      const existing: ContactMessage[] = JSON.parse(sessionStorage.getItem("lamt_messages") || "[]");
      const newMsg: ContactMessage = {
        id: Date.now(), name, email, message: msg,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        resolved: false,
      };
      sessionStorage.setItem("lamt_messages", JSON.stringify([newMsg, ...existing]));
      setStatus("sent");
      setName(""); setEmail(""); setMsg("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section style={{ marginBottom: "2rem" }}>
      <SectionHeader title="Send a Message" />
      {status === "sent" ? (
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
          padding: "1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem",
            color: "var(--ucla-blue)", marginBottom: "0.375rem" }}>Message received.</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Staff will reply to your email as soon as possible.
          </p>
          <button onClick={() => setStatus("idle")}
            style={{ marginTop: "1rem", background: "transparent", border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)", fontSize: "0.6875rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.375rem 0.75rem",
              cursor: "pointer" }}>
            Send Another
          </button>
        </div>
      ) : (
        <form onSubmit={submit}
          style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
            padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "var(--color-text-faint)" }}>Name</label>
              <input style={INPUT_S} value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "var(--color-text-faint)" }}>Email</label>
              <input style={INPUT_S} type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--color-text-faint)" }}>Message</label>
            <textarea style={{ ...INPUT_S, minHeight: 80, resize: "vertical" }}
              value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Questions, concerns, or anything else..." required />
          </div>
          {status === "error" && (
            <p style={{ fontSize: "0.8125rem", color: "#c0392b", fontWeight: 600 }}>Something went wrong. Please try again.</p>
          )}
          <button type="submit"
            disabled={!name || !email || !msg}
            style={{
              alignSelf: "flex-start",
              background: "var(--ucla-blue)", color: "#fff",
              border: "none", padding: "0.625rem 1.25rem",
              fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "0.75rem",
              letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
              opacity: (!name || !email || !msg) ? 0.5 : 1,
              transition: "opacity 150ms",
            }}>
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LivePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [updates,  setUpdates]  = useState<Update[]>(DEFAULT_UPDATES);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("lamt_schedule");
      const u = sessionStorage.getItem("lamt_updates");
      if (s) setSchedule(JSON.parse(s));
      if (u) setUpdates(JSON.parse(u));
    } catch {}
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ── HEADER ── */}
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
        {TOURNAMENT_OVER ? (
          <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            LAMT 2026
          </span>
        ) : (
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
        )}
      </header>

      {/* ── TOURNAMENT OVER BANNER ── */}
      {TOURNAMENT_OVER && (
        <div style={{ background: "var(--ucla-blue)", borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "2rem 3%" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)",
            color: "#fff", letterSpacing: "0.02em", marginBottom: "0.375rem" }}>
            Thank you for coming to LAMT 2026.
          </p>
          <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.75)" }}>
            We look forward to seeing you soon.
          </p>
        </div>
      )}

      {/* ── CONTENT ── */}
      <main style={{ padding: "1.5rem 3% 4rem" }}>
        <UpdatesSection updates={updates} />
        <ScheduleSection schedule={schedule} />
        <MapSection />
        <InfoSection />
        <ContactSection />
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
