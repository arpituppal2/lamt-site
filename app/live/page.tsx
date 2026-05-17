"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ScheduleItem, Update, ContactMessage } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
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

// ─── SHARED MODAL WRAPPER ─────────────────────────────────────────────────────
function Modal({ onClose, title, icon, children, wide }: {
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
      role="dialog" aria-modal aria-label={title}
    >
      <div
        style={{
          width: wide ? "min(740px,96vw)" : "min(520px,96vw)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #e8e8ea",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
          background: "#fafafa",
        }}>
          <span style={{
            fontWeight: 700, fontSize: "1rem", color: "#1a1a1a",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            {icon && <span style={{ fontSize: "1.1rem" }}>{icon}</span>}
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#ebebed", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#888",
            }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {/* scrollable body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL SUBSCRIBE STRIP ────────────────────────────────────────────────────
function SubscribeStrip() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{
      background: "#f5f5f7",
      borderBottom: "1px solid #e8e8ea",
      padding: "0.5rem 2.5%",
      display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
    }}>
      <span style={{
        fontSize: "0.75rem", fontWeight: 600, color: "#555",
        display: "flex", alignItems: "center", gap: "0.4rem"
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Get email notifications
      </span>
      {sent ? (
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2774AE" }}>✓ Subscribed!</span>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
          style={{ display: "flex", gap: "0", flex: 1, minWidth: 240, maxWidth: 480 }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required
            style={{
              flex: 1, background: "#fff", border: "1px solid #d4d4d8",
              borderRight: "none", color: "#1a1a1a", fontSize: "0.8125rem",
              padding: "0.375rem 0.75rem", outline: "none", fontFamily: "inherit",
              borderRadius: "6px 0 0 6px",
            }}
          />
          <button type="submit" style={{
            background: "#2774AE", color: "#fff", border: "none",
            fontSize: "0.75rem", fontWeight: 700,
            padding: "0.375rem 1rem", cursor: "pointer",
            borderRadius: "0 6px 6px 0",
          }}>Subscribe</button>
        </form>
      )}
    </div>
  );
}

// ─── SCHEDULE MODAL CONTENT ───────────────────────────────────────────────────
function ScheduleModalContent({ schedule, currentIdx }: { schedule: ScheduleItem[]; currentIdx: number }) {
  return (
    <div>
      {schedule.map((item, i) => (
        <div key={i} style={{
          padding: "1rem 1.5rem",
          borderBottom: i < schedule.length - 1 ? "1px solid #f0f0f0" : "none",
          background: i === currentIdx ? "#f0f7ff" : "transparent",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ minWidth: 80 }}>
              {item.originalTime ? (
                <p style={{ fontSize: "0.75rem", color: "#aaa", textDecoration: "line-through", lineHeight: 1.3 }}>{item.originalTime}</p>
              ) : null}
              <p style={{
                fontSize: "0.8125rem", fontWeight: 700, lineHeight: 1.3,
                color: i === currentIdx ? "#2774AE" : "#333",
              }}>{item.time}</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700,
                  color: i === currentIdx ? "#2774AE" : "#1a1a1a" }}>
                  {i === currentIdx && (
                    <span style={{
                      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                      background: "#FFB81C", marginRight: 6, verticalAlign: "middle",
                      animation: "pulse 2s ease-in-out infinite"
                    }} />
                  )}
                  {item.event}
                </p>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#888", marginTop: "0.125rem" }}>
                {item.time}–{item.end} · {item.location}
              </p>
              {item.adjustmentReason && (
                <p style={{ fontSize: "0.75rem", color: "#c0392b", marginTop: "0.25rem", fontWeight: 600 }}>
                  {item.adjustmentReason}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SCHEDULE WIDGET ─────────────────────────────────────────────────────────
function ScheduleWidget({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow]     = useState(new Date());
  const [open, setOpen]   = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const currentIdx = getCurrentIdx(schedule, now);
  const progress   = getProgress(schedule, now, currentIdx);
  const current    = schedule[currentIdx];
  const next       = schedule[currentIdx + 1];

  return (
    <>
      <div style={{
        background: "#fff", border: "1px solid #e8e8ea",
        borderRadius: 12, overflow: "hidden", marginBottom: "1rem",
      }}>
        {/* collapsed header */}
        <button
          onClick={() => setOpen(true)}
          aria-label="View full schedule"
          style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "0.875rem 1rem", textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{
              fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#999",
            }}>Full Schedule</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {current && (
                <span style={{
                  fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#FFB81C",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFB81C",
                    display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                  Live
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
          {current ? (
            <>
              <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{current.event}</p>
              <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: 8 }}>
                {current.time}–{current.end} · {current.location}
              </p>
              {/* progress bar */}
              <div style={{ height: 3, background: "#f0f0f0", borderRadius: 999 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "#2774AE",
                  borderRadius: 999, transition: "width 2s linear" }} />
              </div>
              {next && (
                <p style={{ fontSize: "0.6875rem", color: "#bbb", marginTop: 6 }}>
                  Next: {next.event} at {next.time}
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: "0.8125rem", color: "#888" }}>Begins at {schedule[0]?.time}</p>
          )}
        </button>
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)} title="Schedule" icon="🏅">
          <ScheduleModalContent schedule={schedule} currentIdx={currentIdx} />
        </Modal>
      )}
    </>
  );
}

// ─── MAP WIDGET ───────────────────────────────────────────────────────────────
const VENUES = [
  { id: "ms",     label: "MS 4000A / 5200", lat: 34.0690, lng: -118.4421,
    directionsBase: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
  { id: "cos",    label: "Court of Sciences", lat: 34.0677, lng: -118.4414,
    directionsBase: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA" },
  { id: "ms5138", label: "MS 5138",           lat: 34.0693, lng: -118.4418,
    directionsBase: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
];

function MapWidget() {
  const [open, setOpen]         = useState(false);
  const [userCoords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locState, setLocState] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const mapRef                  = useRef<HTMLDivElement>(null);
  const leafletMapRef           = useRef<any>(null);

  function requestLocation() {
    if (!navigator.geolocation) { setLocState("denied"); return; }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      p => { setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocState("granted"); },
      () => setLocState("denied")
    );
  }

  function dirUrl(v: typeof VENUES[0]) {
    return locState === "granted" && userCoords
      ? `${v.directionsBase}&origin=${userCoords.lat},${userCoords.lng}`
      : v.directionsBase;
  }

  useEffect(() => {
    if (!open) return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    function initMap() {
      if (!mapRef.current || leafletMapRef.current) return;
      const L = (window as any).L;
      if (!L) return;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([34.0690, -118.4421], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 19,
      }).addTo(map);
      const pinSVG = (color: string) => L.divIcon({
        className: "",
        html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 19 11 19s11-10.75 11-19C22 4.925 17.075 0 11 0z" fill="${color}"/><circle cx="11" cy="11" r="4" fill="white"/></svg>`,
        iconSize: [22, 30], iconAnchor: [11, 30], popupAnchor: [0, -32],
      });
      VENUES.forEach(v => {
        L.marker([v.lat, v.lng], { icon: pinSVG("#2774AE") })
          .addTo(map)
          .bindPopup(`<div style="font-family:sans-serif;min-width:160px"><p style="font-weight:800;font-size:13px;margin-bottom:6px;color:#0a0a0a">${v.label}</p><a href="${v.directionsBase}" target="_blank" style="font-size:11px;font-weight:700;color:#2774AE;text-decoration:none;text-transform:uppercase;letter-spacing:.08em">Get Directions →</a></div>`);
      });
      if (userCoords) {
        L.marker([userCoords.lat, userCoords.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:14px;height:14px;border-radius:50%;background:#FFB81C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7],
          })
        }).addTo(map).bindPopup("Your location");
      }
      leafletMapRef.current = map;
      setTimeout(() => map.invalidateSize(), 100);
    }
    if ((window as any).L) {
      initMap();
    } else {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = initMap;
      document.head.appendChild(s);
    }
    return () => {
      if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userCoords]);

  return (
    <>
      {/* thumbnail */}
      <div style={{ background: "#fff", border: "1px solid #e8e8ea", borderRadius: 12, overflow: "hidden", marginBottom: "1rem" }}>
        <button
          onClick={() => { setOpen(true); if (locState === "idle") requestLocation(); }}
          aria-label="Open campus map"
          style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, position: "relative" }}
        >
          {/* static SVG thumbnail — matches screenshot style */}
          <svg viewBox="0 0 380 210" width="100%" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="380" height="210" fill="#f5f0eb"/>
            {/* street grid */}
            <rect x="0" y="30" width="380" height="6" fill="#e2dbd3"/>
            <rect x="0" y="100" width="380" height="6" fill="#e2dbd3"/>
            <rect x="0" y="165" width="380" height="6" fill="#e2dbd3"/>
            <rect x="55" y="0" width="6" height="210" fill="#e2dbd3"/>
            <rect x="160" y="0" width="6" height="210" fill="#e2dbd3"/>
            <rect x="265" y="0" width="6" height="210" fill="#e2dbd3"/>
            <rect x="345" y="0" width="6" height="210" fill="#e2dbd3"/>
            {/* campus outline */}
            <polygon points="75,38 315,38 315,172 75,172" fill="#e8f0e8" opacity="0.7"/>
            <polygon points="75,38 315,38 315,172 75,172" fill="none" stroke="#5a9a5a" strokeWidth="1.3" strokeDasharray="5,3"/>
            {/* generic buildings */}
            <rect x="85" y="45" width="40" height="28" rx="2" fill="#d4cfc8"/>
            <rect x="85" y="82" width="28" height="18" rx="2" fill="#d4cfc8"/>
            <rect x="88" y="120" width="36" height="22" rx="2" fill="#d4cfc8"/>
            <rect x="148" y="45" width="34" height="20" rx="2" fill="#d4cfc8"/>
            <rect x="148" y="120" width="28" height="20" rx="2" fill="#d4cfc8"/>
            <rect x="258" y="45" width="38" height="26" rx="2" fill="#d4cfc8"/>
            <rect x="262" y="82" width="28" height="18" rx="2" fill="#d4cfc8"/>
            {/* MS Building — UCLA blue outline, filled like BmMT style */}
            <rect x="195" y="50" width="56" height="46" rx="2" fill="none" stroke="#2774AE" strokeWidth="2"/>
            <rect x="198" y="53" width="50" height="40" rx="1" fill="rgba(39,116,174,0.18)"/>
            <text x="223" y="78" textAnchor="middle" fill="#2774AE" fontSize="9" fontWeight="800" fontFamily="'Arial Narrow',Arial,sans-serif" letterSpacing="0.5">MS Bldg</text>
            {/* Court of Sciences — outlined gold */}
            <rect x="190" y="128" width="64" height="32" rx="2" fill="none" stroke="#2774AE" strokeWidth="2"/>
            <rect x="193" y="131" width="58" height="26" rx="1" fill="rgba(39,116,174,0.1)"/>
            <text x="222" y="150" textAnchor="middle" fill="#2774AE" fontSize="7.5" fontWeight="800" fontFamily="'Arial Narrow',Arial,sans-serif">Court of Sci</text>
            {/* location pins */}
            <circle cx="223" cy="73" r="5" fill="#2774AE"/>
            <circle cx="222" cy="145" r="5" fill="#2774AE"/>
            {/* badge */}
            <rect x="8" y="188" width="110" height="16" rx="4" fill="rgba(0,0,0,0.5)"/>
            <circle cx="20" cy="196" r="4" fill="#e74c3c"/>
            <text x="28" y="200" fill="white" fontSize="7.5" fontWeight="700" fontFamily="Arial,sans-serif">Map · 3 locations</text>
            {/* expand hint */}
            <rect x="268" y="188" width="104" height="16" rx="4" fill="rgba(0,0,0,0.4)"/>
            <text x="320" y="200" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial,sans-serif">Tap to expand ↗</text>
          </svg>
          {locState === "granted" && (
            <div style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(0,0,0,0.6)", color: "#FFB81C",
              fontSize: "0.5625rem", fontWeight: 700, padding: "3px 8px",
              borderRadius: 4, letterSpacing: "0.08em",
            }}>📍 Location active</div>
          )}
        </button>
      </div>

      {/* full map modal */}
      {open && (
        <Modal onClose={() => setOpen(false)} title="Campus Map" icon="📍" wide>
          <div style={{ display: "flex", flexDirection: "column", height: "min(540px,70vh)" }}>
            <div ref={mapRef} style={{ flex: 1, minHeight: 0 }} />
            <div style={{
              borderTop: "1px solid #e8e8ea", background: "#fafafa",
              padding: "0.625rem 1rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "0.5rem", flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {VENUES.map(v => (
                  <a key={v.id} href={dirUrl(v)} target="_blank" rel="noopener noreferrer"
                    style={{
                      border: "1px solid #d4d4d8", borderRadius: 6,
                      background: "#fff", padding: "0.25rem 0.625rem",
                      textDecoration: "none", fontSize: "0.6875rem",
                      fontWeight: 600, color: "#2774AE",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {v.label}
                  </a>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {locState === "idle" && (
                  <button onClick={requestLocation}
                    style={{
                      background: "transparent", border: "1px solid #d4d4d8",
                      borderRadius: 6, color: "#555", fontSize: "0.6875rem",
                      fontWeight: 600, padding: "0.25rem 0.625rem", cursor: "pointer",
                    }}>Use My Location</button>
                )}
                {locState === "loading" && <span style={{ fontSize: "0.6875rem", color: "#888" }}>Locating…</span>}
                {locState === "granted" && <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#2774AE" }}>📍 Routing from your location</span>}
                <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#2774AE", textDecoration: "none" }}>
                  Full Campus Map →
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── INFO & HELP WIDGET ───────────────────────────────────────────────────────
const INFO_ITEMS = [
  { icon: "wifi",  emoji: "📶", label: "Wi-Fi",            detail: "UCLA-WEB", href: null },
  { icon: "phone", emoji: "🚨", label: "Emergency",         detail: "911 or UCPD: 310-825-4321", href: "tel:3108254321" },
  { icon: "info",  emoji: "ℹ️", label: "Information Desk",  detail: "Outside MS 4000A (from 8 AM)", href: null },
  { icon: "users", emoji: "🚻", label: "Restrooms",         detail: "Near elevators, MS Building", href: null },
  { icon: "file",  emoji: "📋", label: "Disputes",          detail: "Court of Sciences during Lunch", href: null },
  { icon: "mail",  emoji: "✉️", label: "Contact Staff",     detail: "uclamathtournament@gmail.com", href: "mailto:uclamathtournament@gmail.com" },
  { icon: "map",   emoji: "🗺️", label: "Campus Map",        detail: "maps.ucla.edu", href: "https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" },
  { icon: "car",   emoji: "🅿️", label: "Parking",           detail: "Structure 2 (nearest)", href: "https://www.google.com/maps/dir/?api=1&destination=UCLA+Parking+Structure+2" },
];

function InfoWidget() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      {/* inline 2x4 grid of icon buttons */}
      <div style={{ background: "#fff", border: "1px solid #e8e8ea", borderRadius: 12, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{
          padding: "0.625rem 1rem",
          borderBottom: "1px solid #f0f0f0",
        }}>
          <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#999" }}>Info & Help</span>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }}>
          {INFO_ITEMS.map((item, i) => {
            const isLast = i === INFO_ITEMS.length - 1;
            const isOdd  = i % 2 === 0;
            const cell = (
              <div style={{
                padding: "0.875rem",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "0.375rem",
                borderRight: isOdd ? "1px solid #f0f0f0" : "none",
                borderBottom: i < INFO_ITEMS.length - 2 ? "1px solid #f0f0f0" : "none",
                textAlign: "center",
                cursor: item.href ? "pointer" : "default",
                textDecoration: "none",
                transition: "background 150ms",
              }}>
                <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{item.emoji}</span>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#1a1a1a" }}>{item.label}</span>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ textDecoration: "none" }}>
                {cell}
              </a>
            ) : (
              <button key={item.label} onClick={() => setModalOpen(true)}
                style={{ background: "none", border: "none" }}>
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      {/* full info modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} title="Info & Help" icon="📓">
          {INFO_ITEMS.map((item, i) => {
            const row = (
              <div style={{
                padding: "0.875rem 1.5rem",
                borderBottom: i < INFO_ITEMS.length - 1 ? "1px solid #f5f5f7" : "none",
                display: "flex", alignItems: "center", gap: "1rem",
              }}>
                <span style={{ fontSize: "1.375rem", width: 32, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a1a1a" }}>{item.label}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#888", marginTop: 2 }}>{item.detail}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ display: "block", textDecoration: "none" }}>
                {row}
              </a>
            ) : (
              <div key={item.label}>{row}</div>
            );
          })}
        </Modal>
      )}
    </>
  );
}

// ─── UPDATES FEED ─────────────────────────────────────────────────────────────
function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8ea", borderRadius: 12, overflow: "hidden", marginBottom: "1.5rem" }}>
      <div style={{
        padding: "0.875rem 1.25rem",
        borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fafafa",
      }}>
        <span style={{
          fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "#FFB81C",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFB81C",
            display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Live Updates
        </span>
        <span style={{ fontSize: "0.6875rem", color: "#bbb", fontWeight: 600 }}>
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>

      {updates.length === 0 ? (
        <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "#bbb" }}>Updates will appear here throughout the day.</p>
        </div>
      ) : (
        updates.map((u, i) => (
          <div key={u.id} style={{
            padding: "1.25rem 1.5rem",
            borderBottom: i < updates.length - 1 ? "1px solid #f5f5f7" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              {i === 0 && (
                <span style={{
                  background: "#FFB81C", color: "#003B5C",
                  fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.2em",
                  textTransform: "uppercase", padding: "2px 7px", borderRadius: 3,
                }}>Latest</span>
              )}
              <span style={{ fontSize: "0.75rem", color: "#bbb", fontVariantNumeric: "tabular-nums" }}>{u.timestamp}</span>
            </div>
            {u.title && (
              <p style={{
                fontWeight: 800, fontSize: "1.0625rem", color: "#1a1a1a",
                marginBottom: "0.5rem", lineHeight: 1.3,
              }}>{u.title}</p>
            )}
            <p style={{ fontSize: "0.875rem", color: "#444", lineHeight: 1.75, whiteSpace: "pre-line" }}>
              {u.body}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [msg,    setMsg]    = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const IS: React.CSSProperties = {
    background: "#fff", border: "1px solid #d4d4d8",
    borderRadius: 8, color: "#1a1a1a", fontFamily: "inherit",
    fontSize: "0.875rem", padding: "0.5625rem 0.75rem", width: "100%", outline: "none",
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const key = "lamt_messages";
      const existing: ContactMessage[] = JSON.parse(sessionStorage.getItem(key) || "[]");
      sessionStorage.setItem(key, JSON.stringify([{
        id: Date.now(), name, email, message: msg,
        timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
        resolved: false, replies: [],
      }, ...existing]));
    } catch {}
    setStatus("sent"); setName(""); setEmail(""); setMsg("");
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8ea", borderRadius: 12, overflow: "hidden" }}>
      <div style={{
        padding: "0.875rem 1.25rem",
        borderBottom: "1px solid #f0f0f0",
        background: "#fafafa",
      }}>
        <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "#999" }}>Send a Message</span>
      </div>
      {status === "sent" ? (
        <div style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#2774AE", marginBottom: 4 }}>Message received.</p>
          <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: "1.25rem" }}>Staff will reply to your email soon.</p>
          <button onClick={() => setStatus("idle")}
            style={{
              background: "transparent", border: "1px solid #d4d4d8", borderRadius: 6,
              color: "#888", fontSize: "0.75rem", fontWeight: 700,
              padding: "0.4rem 0.875rem", cursor: "pointer",
            }}>Send Another</button>
        </div>
      ) : (
        <form onSubmit={submit} style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>Name</label>
              <input style={IS} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email</label>
              <input style={IS} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>Message</label>
            <textarea style={{ ...IS, minHeight: 80, resize: "vertical" }}
              value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Questions, concerns, anything..." required />
          </div>
          <button type="submit" disabled={!name || !email || !msg} style={{
            alignSelf: "flex-start", background: "#2774AE", color: "#fff",
            border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.8125rem",
            padding: "0.5625rem 1.25rem", cursor: "pointer",
            opacity: (!name || !email || !msg) ? 0.4 : 1,
            transition: "opacity 150ms",
          }}>Send Message</button>
        </form>
      )}
    </div>
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
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)" }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "#2774AE",
        borderBottom: "2px solid #FFB81C",
        padding: "0.75rem 3%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem",
          textDecoration: "none" }} aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT" width={30} height={30}
            style={{ height: 30, width: "auto", objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.6)", lineHeight: 1 }}>
              Sunday, May 17th
            </div>
            <div style={{
              fontWeight: 800, fontSize: "0.9375rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#fff", lineHeight: 1.15,
            }}>LAMT 2026</div>
          </div>
        </Link>
        {!TOURNAMENT_OVER && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#FFB81C",
            border: "1.5px solid #FFB81C", padding: "0.25rem 0.625rem", borderRadius: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFB81C",
              display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            Live
          </span>
        )}
      </header>

      {/* ── EMAIL SUBSCRIBE STRIP ── */}
      <SubscribeStrip />

      {/* ── TWO-COLUMN LAYOUT ── */}
      <main
        id="live-main"
        style={{
          display: "grid",
          gridTemplateColumns: "min(360px, 36%) 1fr",
          minHeight: "calc(100vh - 90px)",
          alignItems: "start",
        }}
      >
        {/* LEFT: Schedule + Map + Info */}
        <aside style={{
          padding: "1.25rem",
          position: "sticky",
          top: 90,
          maxHeight: "calc(100vh - 90px)",
          overflowY: "auto",
          borderRight: "1px solid #e8e8ea",
          background: "#f5f5f7",
        }}>
          <ScheduleWidget schedule={schedule} />
          <MapWidget />
          <InfoWidget />
        </aside>

        {/* RIGHT: Updates + Contact */}
        <section style={{ padding: "1.25rem 1.75rem 4rem" }}>
          <UpdatesFeed updates={updates} />
          <ContactForm />
        </section>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        @media (max-width: 720px) {
          #live-main { grid-template-columns: 1fr !important; }
          aside {
            border-right: none !important; border-bottom: 1px solid #e8e8ea;
            position: static !important; max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}
