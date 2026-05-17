"use client";

import { useState, useEffect, useRef } from "react";
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

function timeAgo(ts: string): string {
  // ts is something like "8:00 AM" — just return it directly
  return ts;
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
const SL = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
    <span style={{
      fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.625rem",
      letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--color-text-faint)",
      whiteSpace: "nowrap",
    }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
  </div>
);

// ─── EMAIL SUBSCRIBE STRIP ────────────────────────────────────────────────────
function SubscribeStrip() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      padding: "0.625rem 2.5%",
      display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
    }}>
      <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-muted)",
        letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Get email notifications
      </span>
      {sent ? (
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ucla-blue)" }}>Subscribed!</span>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
          style={{ display: "flex", gap: "0.5rem", flex: 1, minWidth: 240, maxWidth: 480 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required
            style={{
              flex: 1, background: "var(--color-bg)", border: "1px solid var(--color-border)",
              color: "var(--color-text)", fontSize: "0.8125rem", padding: "0.375rem 0.625rem",
              fontFamily: "var(--font-body)", outline: "none",
            }} />
          <button type="submit" style={{
            background: "var(--ucla-blue)", color: "#fff", border: "none",
            fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "0.375rem 0.875rem", cursor: "pointer",
          }}>Subscribe</button>
        </form>
      )}
    </div>
  );
}

// ─── SCHEDULE WIDGET (left column) ────────────────────────────────────────────
function ScheduleWidget({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const currentIdx = getCurrentIdx(schedule, now);
  const progress   = getProgress(schedule, now, currentIdx);
  const current    = schedule[currentIdx];
  const next       = schedule[currentIdx + 1];

  return (
    <div style={{
      border: "1px solid var(--color-border)",
      background: "var(--color-surface)",
      marginBottom: "1rem",
    }}>
      {/* collapsed header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "0.875rem 1rem", textAlign: "left",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.25em",
            textTransform: "uppercase", color: "var(--color-text-faint)",
          }}>Full Schedule</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {current && (
              <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "var(--ucla-gold)",
                display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%",
                  background: "var(--ucla-gold)", display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite" }} />
                Live
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--color-text-faint)",
                transform: open ? "rotate(180deg)" : "none", transition: "transform 180ms" }}
              aria-hidden><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>

        {current ? (
          <>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem",
                color: "var(--color-text)" }}>{current.event}</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                {current.time}–{current.end} · {current.location}
              </p>
            </div>
            <div style={{ height: 2, background: "var(--color-surface-2)" }}>
              <div style={{ height: "100%", width: `${progress}%`,
                background: "var(--ucla-blue)", transition: "width 2s linear" }} />
            </div>
            {next && (
              <p style={{ fontSize: "0.625rem", color: "var(--color-text-faint)" }}>
                Next: {next.event} at {next.time}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Begins at {schedule[0].time}
          </p>
        )}
      </button>

      {/* expanded full schedule */}
      {open && (
        <div style={{ borderTop: "1px solid var(--color-border)" }}>
          {schedule.map((item, i) => (
            <div key={i} style={{
              padding: "0.75rem 1rem",
              borderBottom: i < schedule.length - 1 ? "1px solid var(--color-divider)" : "none",
              background: i === currentIdx ? "rgba(39,116,174,0.07)" : "transparent",
              display: "grid", gridTemplateColumns: "4.5rem 1fr", gap: "0.625rem",
            }}>
              <div>
                <p style={{ fontSize: "0.6875rem", fontWeight: 700,
                  color: i === currentIdx ? "var(--ucla-blue)" : "var(--color-text-faint)",
                  fontVariantNumeric: "tabular-nums" }}>
                  {item.time}
                </p>
                {item.originalTime && (
                  <p style={{ fontSize: "0.5625rem", color: "var(--color-text-faint)",
                    textDecoration: "line-through" }}>was {item.originalTime}</p>
                )}
              </div>
              <div>
                <p style={{ fontSize: "0.8125rem", fontWeight: 700,
                  color: i === currentIdx ? "var(--ucla-blue)" : "var(--color-text)" }}>
                  {i === currentIdx && (
                    <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%",
                      background: "var(--ucla-gold)", marginRight: "0.4rem", verticalAlign: "middle",
                      animation: "pulse 2s ease-in-out infinite" }} />
                  )}
                  {item.event}
                </p>
                <p style={{ fontSize: "0.625rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                  {item.location}
                </p>
                {item.adjustmentReason && (
                  <p style={{ fontSize: "0.5625rem", color: "#c0392b", marginTop: "0.25rem" }}>
                    {item.adjustmentReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAP WIDGET (left column) ─────────────────────────────────────────────────
// Leaflet loaded from CDN; we render a static thumbnail that opens a Leaflet modal
const VENUES = [
  { id: "ms",  label: "MS 4000A / MS 5200",   lat: 34.0690, lng: -118.4421,
    directionsBase: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
  { id: "cos", label: "Court of Sciences",      lat: 34.0677, lng: -118.4414,
    directionsBase: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA" },
  { id: "ms5138", label: "MS 5138",            lat: 34.0693, lng: -118.4418,
    directionsBase: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA" },
];

function MapWidget() {
  const [open, setOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{lat:number;lng:number}|null>(null);
  const [locState, setLocState] = useState<"idle"|"loading"|"granted"|"denied">("idle");
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletLoadedRef = useRef(false);

  function requestLocation() {
    if (!navigator.geolocation) { setLocState("denied"); return; }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUserCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocState("granted");
      },
      () => setLocState("denied")
    );
  }

  function dirUrl(venue: typeof VENUES[0]) {
    if (locState === "granted" && userCoords) {
      return `${venue.directionsBase}&origin=${userCoords.lat},${userCoords.lng}`;
    }
    return venue.directionsBase;
  }

  // Initialize Leaflet map when modal opens
  useEffect(() => {
    if (!open) return;
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    // Load Leaflet JS
    function initMap() {
      if (!mapRef.current || leafletMapRef.current) return;
      const L = (window as any).L;
      if (!L) return;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([34.0690, -118.4421], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      // Campus boundary polygon (approximate)
      const campusBounds = [
        [34.0756, -118.4465], [34.0756, -118.4354],
        [34.0650, -118.4354], [34.0650, -118.4465],
      ];
      L.polygon(campusBounds as any, {
        color: "#2774AE", fillColor: "#2774AE", fillOpacity: 0.05,
        weight: 1.5, dashArray: "6,4",
      }).addTo(map);
      // Custom pin icon
      const pinSVG = (color: string) => L.divIcon({
        className: "",
        html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 19 11 19s11-10.75 11-19C22 4.925 17.075 0 11 0z"
            fill="${color}"/>
          <circle cx="11" cy="11" r="4" fill="white"/>
        </svg>`,
        iconSize: [22, 30], iconAnchor: [11, 30], popupAnchor: [0, -32],
      });
      VENUES.forEach(v => {
        L.marker([v.lat, v.lng], { icon: pinSVG("#2774AE") })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif; min-width:160px">
              <p style="font-weight:800; font-size:13px; margin-bottom:6px; color:#0a0a0a">${v.label}</p>
              <a href="${v.directionsBase}" target="_blank"
                style="font-size:11px; font-weight:700; color:#2774AE; text-decoration:none; letter-spacing:.08em; text-transform:uppercase">
                Get Directions →
              </a>
            </div>
          `);
      });
      // User location
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
    } else if (!leafletLoadedRef.current) {
      leafletLoadedRef.current = true;
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }
    return () => {
      if (!open && leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [open, userCoords]);

  return (
    <>
      {/* ── THUMBNAIL (click to open) ── */}
      <div style={{ border: "1px solid var(--color-border)", marginBottom: "1rem", overflow: "hidden" }}>
        <button
          onClick={() => { setOpen(true); if (locState === "idle") requestLocation(); }}
          aria-label="Open campus map"
          style={{
            display: "block", width: "100%", background: "none", border: "none",
            cursor: "pointer", padding: 0, position: "relative",
          }}
        >
          {/* SVG thumbnail of UCLA area — matches BmMT style */}
          <svg viewBox="0 0 400 220" width="100%" style={{ display: "block" }}
            xmlns="http://www.w3.org/2000/svg" aria-hidden>
            {/* background */}
            <rect width="400" height="220" fill="#f0ede6"/>
            {/* streets */}
            <rect x="0"   y="34"  width="400" height="7"  fill="#e0dbd2"/>
            <rect x="0"   y="108" width="400" height="7"  fill="#e0dbd2"/>
            <rect x="0"   y="176" width="400" height="7"  fill="#e0dbd2"/>
            <rect x="58"  y="0"   width="7"   height="220" fill="#e0dbd2"/>
            <rect x="168" y="0"   width="7"   height="220" fill="#e0dbd2"/>
            <rect x="276" y="0"   width="7"   height="220" fill="#e0dbd2"/>
            <rect x="352" y="0"   width="7"   height="220" fill="#e0dbd2"/>
            {/* campus fill */}
            <polygon points="80,42 320,42 320,180 80,180" fill="#e6efe6" opacity="0.6"/>
            <polygon points="80,42 320,42 320,180 80,180" fill="none" stroke="#4a8c4a" strokeWidth="1.2" strokeDasharray="5,3"/>
            {/* generic gray buildings */}
            <rect x="90"  y="50"  width="44" height="30" rx="1" fill="#ccc"/>
            <rect x="90"  y="90"  width="30" height="20" rx="1" fill="#ccc"/>
            <rect x="95"  y="130" width="38" height="25" rx="1" fill="#ccc"/>
            <rect x="155" y="50"  width="36" height="22" rx="1" fill="#ccc"/>
            <rect x="155" y="130" width="30" height="22" rx="1" fill="#ccc"/>
            <rect x="270" y="50"  width="40" height="28" rx="1" fill="#ccc"/>
            <rect x="270" y="90"  width="30" height="20" rx="1" fill="#ccc"/>
            {/* MS Building — UCLA blue */}
            <rect x="210" y="55"  width="52" height="44" rx="1" fill="#2774AE"/>
            <rect x="214" y="59"  width="44" height="36" rx="1" fill="#1c5a8f"/>
            <text x="236" y="81" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="800"
              fontFamily="'Arial Narrow',Arial,sans-serif" letterSpacing="0.5">MS</text>
            {/* Court of Sciences — gold */}
            <rect x="200" y="136" width="60" height="32" rx="1" fill="#FFB81C"/>
            <text x="230" y="157" textAnchor="middle" fill="#003B5C" fontSize="7.5" fontWeight="800"
              fontFamily="'Arial Narrow',Arial,sans-serif">Court of Sci</text>
            {/* pin dot MS */}
            <circle cx="236" cy="77" r="4" fill="white" stroke="#2774AE" strokeWidth="1.5"/>
            {/* "6 locations" label */}
            <rect x="10" y="193" width="90" height="20" rx="2" fill="rgba(0,0,0,0.55)"/>
            <circle cx="22" cy="203" r="4" fill="#e74c3c"/>
            <text x="30" y="207" fill="white" fontSize="8" fontWeight="700"
              fontFamily="Arial,sans-serif">Map · 3 locations</text>
          </svg>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.45))",
            padding: "0.5rem 0.75rem 0.5rem",
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "0.625rem", fontWeight: 800, color: "#fff",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Tap to open map
            </span>
            {locState === "granted" && (
              <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "#FFB81C",
                letterSpacing: "0.08em", textTransform: "uppercase" }}>
                📍 Location active
              </span>
            )}
          </div>
        </button>
      </div>

      {/* ── FULL MAP MODAL ── */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setOpen(false)}
          role="dialog" aria-modal aria-label="Campus map"
        >
          <div
            style={{
              width: "min(700px, 96vw)", height: "min(600px, 88vh)",
              display: "flex", flexDirection: "column",
              background: "var(--color-bg)",
              border: "2px solid var(--ucla-blue)",
              overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* modal header */}
            <div style={{
              background: "var(--ucla-blue)",
              borderBottom: "2px solid var(--ucla-gold)",
              padding: "0.625rem 1rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.75rem",
                letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff",
                display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" style={{ color: "var(--ucla-gold)" }} aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Campus Map
              </span>
              <button onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)",
                  cursor: "pointer", padding: "0.25rem", display: "flex" }} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Leaflet map */}
            <div ref={mapRef} style={{ flex: 1, minHeight: 0 }} />

            {/* footer */}
            <div style={{
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              padding: "0.625rem 1rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "0.75rem", flexWrap: "wrap",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {VENUES.map(v => (
                  <a key={v.id} href={dirUrl(v)} target="_blank" rel="noopener noreferrer"
                    style={{
                      border: "1px solid var(--color-border)", background: "var(--color-bg)",
                      padding: "0.3rem 0.625rem", textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" style={{ color: "var(--ucla-blue)", flexShrink: 0 }} aria-hidden>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--color-text)" }}>
                      {v.label}
                    </span>
                  </a>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {locState === "idle" && (
                  <button onClick={requestLocation}
                    style={{
                      background: "transparent", border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)", fontSize: "0.5625rem", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "0.3rem 0.625rem", cursor: "pointer",
                    }}>Use My Location</button>
                )}
                {locState === "loading" && (
                  <span style={{ fontSize: "0.5625rem", color: "var(--color-text-muted)" }}>Locating…</span>
                )}
                {locState === "granted" && (
                  <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--ucla-blue)" }}>📍 Routing from your position</span>
                )}
                <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--ucla-blue)",
                    textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
                    whiteSpace: "nowrap" }}>
                  Full Campus Map →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── INFO & HELP WIDGET (left column) ─────────────────────────────────────────
const INFO_ITEMS = [
  { icon: "wifi",   label: "Wi-Fi",           detail: "UCLA-WEB", href: null },
  { icon: "phone",  label: "Emergency",        detail: "911 or UCPD: 310-825-4321", href: "tel:3108254321" },
  { icon: "info",   label: "Information Desk", detail: "Outside MS 4000A (from 8 AM)", href: null },
  { icon: "users",  label: "Restrooms",        detail: "Near elevators, MS Building", href: null },
  { icon: "file",   label: "Disputes",         detail: "Court of Sciences during Lunch", href: null },
  { icon: "mail",   label: "Contact Staff",    detail: "uclamathtournament@gmail.com", href: "mailto:uclamathtournament@gmail.com" },
  { icon: "map",    label: "Campus Map",       detail: "maps.ucla.edu", href: "https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" },
  { icon: "car",    label: "Parking",          detail: "Lot 2 (Structure 2) – nearest", href: "https://www.google.com/maps/dir/?api=1&destination=UCLA+Parking+Structure+2" },
];

function iconSVG(icon: string) {
  const s = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    style: { color: "var(--ucla-blue)", flexShrink: 0 }, "aria-hidden": true };
  switch(icon) {
    case "wifi":  return <svg {...s}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
    case "phone": return <svg {...s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 9.79 19.79 19.79 0 0 1 1.49 1.1 2 2 0 0 1 3.5-.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/></svg>;
    case "info":  return <svg {...s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case "users": return <svg {...s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "file":  return <svg {...s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case "mail":  return <svg {...s}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "map":   return <svg {...s}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
    case "car":   return <svg {...s}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
    default:      return <svg {...s}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

function InfoWidget() {
  return (
    <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
      marginBottom: "1rem" }}>
      <div style={{ padding: "0.625rem 1rem", borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface-2)" }}>
        <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "var(--color-text-faint)" }}>Info & Help</span>
      </div>
      {INFO_ITEMS.map((item, i) => {
        const row = (
          <div style={{
            padding: "0.625rem 1rem",
            borderBottom: i < INFO_ITEMS.length - 1 ? "1px solid var(--color-divider)" : "none",
            display: "flex", alignItems: "center", gap: "0.75rem",
            textDecoration: "none",
            background: "transparent",
          }}>
            {iconSVG(item.icon)}
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-text)" }}>{item.label}</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>{item.detail}</p>
            </div>
          </div>
        );
        return item.href ? (
          <a key={item.label} href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{ display: "block", textDecoration: "none",
              borderBottom: i < INFO_ITEMS.length - 1 ? "1px solid var(--color-divider)" : "none" }}>
            {row}
          </a>
        ) : (
          <div key={item.label}>{row}</div>
        );
      })}
    </div>
  );
}

// ─── UPDATES FEED (right column, full height) ─────────────────────────────────
function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem",
        padding: "0 0 0.75rem" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "var(--ucla-gold)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ucla-gold)",
            display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Live Updates
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
        <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--color-text-faint)",
          letterSpacing: "0.1em" }}>
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>

      {updates.length === 0 ? (
        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)",
          padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Updates will appear here throughout the day.
          </p>
        </div>
      ) : (
        updates.map((u, i) => (
          <div key={u.id} style={{
            border: "1px solid var(--color-border)",
            borderTop: i > 0 ? "none" : "1px solid var(--color-border)",
            background: "var(--color-surface)",
            padding: "1.25rem 1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
              {i === 0 && (
                <span style={{
                  background: "var(--ucla-gold)", color: "#003B5C",
                  fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.2em",
                  textTransform: "uppercase", padding: "2px 6px",
                }}>Latest</span>
              )}
              <span style={{ fontSize: "0.6875rem", color: "var(--color-text-faint)",
                fontVariantNumeric: "tabular-nums" }}>{u.timestamp}</span>
            </div>
            {u.title && (
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "1rem", color: "var(--color-text)", marginBottom: "0.625rem",
                lineHeight: 1.3 }}>{u.title}</p>
            )}
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)",
              lineHeight: 1.7, whiteSpace: "pre-line" }}>{u.body}</p>
          </div>
        ))
      )}
    </div>
  );
}

// ─── CONTACT FORM (inline in right column) ────────────────────────────────────
function ContactForm() {
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [msg,    setMsg]    = useState("");
  const [status, setStatus] = useState<"idle"|"sent">("idle");

  const IS: React.CSSProperties = {
    background: "var(--color-bg)", border: "1px solid var(--color-border)",
    color: "var(--color-text)", fontFamily: "var(--font-body)",
    fontSize: "0.8125rem", padding: "0.5rem 0.75rem", width: "100%", outline: "none",
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const key = "lamt_messages";
      const existing: ContactMessage[] = JSON.parse(sessionStorage.getItem(key) || "[]");
      sessionStorage.setItem(key, JSON.stringify([{
        id: Date.now(), name, email, message: msg,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        resolved: false, replies: [],
      }, ...existing]));
      setStatus("sent"); setName(""); setEmail(""); setMsg("");
    } catch { setStatus("sent"); }
  }

  return (
    <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "0",
      background: "var(--color-surface)", border: "1px solid var(--color-border)",
      borderTop: "none" }}>
      <div style={{ padding: "0.875rem 1.5rem", borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface-2)", display: "flex", alignItems: "center",
        justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "var(--color-text-faint)" }}>
          Send a Message
        </span>
      </div>
      {status === "sent" ? (
        <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem",
            color: "var(--ucla-blue)", marginBottom: "0.25rem" }}>Message received.</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
            Staff will reply to your email soon.
          </p>
          <button onClick={() => setStatus("idle")}
            style={{ background: "transparent", border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)", fontSize: "0.625rem", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "0.375rem 0.75rem", cursor: "pointer" }}>Send Another</button>
        </div>
      ) : (
        <form onSubmit={submit}
          style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--color-text-faint)" }}>Name</label>
              <input style={IS} value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--color-text-faint)" }}>Email</label>
              <input style={IS} type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--color-text-faint)" }}>Message</label>
            <textarea style={{ ...IS, minHeight: 72, resize: "vertical" }}
              value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Questions, concerns, anything..." required />
          </div>
          <button type="submit" disabled={!name || !email || !msg}
            style={{
              alignSelf: "flex-start",
              background: "var(--ucla-blue)", color: "#fff", border: "none",
              fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "0.625rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "0.5rem 1.125rem", cursor: "pointer",
              opacity: (!name || !email || !msg) ? 0.5 : 1,
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
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "var(--ucla-blue)",
        borderBottom: "2px solid var(--ucla-gold)",
        padding: "0.75rem 3%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem",
          textDecoration: "none" }} aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT" width={28} height={28}
            style={{ height: 28, width: "auto", objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.65)", lineHeight: 1 }}>
              Sunday, May 17th
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem",
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", lineHeight: 1.1 }}>
              LAMT 2026
            </div>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {!TOURNAMENT_OVER && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.375rem",
              fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--ucla-gold)",
              border: "1px solid var(--ucla-gold)", padding: "0.25rem 0.625rem",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--ucla-gold)",
                display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
              Live
            </span>
          )}
        </div>
      </header>

      {/* ── EMAIL SUBSCRIBE STRIP ── */}
      <SubscribeStrip />

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <main style={{
        display: "grid",
        gridTemplateColumns: "min(340px, 35%) 1fr",
        gap: 0,
        minHeight: "calc(100vh - 90px)",
        alignItems: "start",
      }}>
        {/* LEFT COLUMN: Schedule + Map + Info */}
        <aside style={{
          borderRight: "1px solid var(--color-border)",
          padding: "1.25rem 1.25rem 3rem",
          position: "sticky",
          top: 90,
          maxHeight: "calc(100vh - 90px)",
          overflowY: "auto",
        }}>
          <ScheduleWidget schedule={schedule} />
          <MapWidget />
          <InfoWidget />
        </aside>

        {/* RIGHT COLUMN: Updates + Contact */}
        <section style={{ padding: "1.25rem 2rem 4rem" }}>
          <UpdatesFeed updates={updates} />
          <ContactForm />
        </section>
      </main>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @media (max-width: 700px) {
          main { grid-template-columns: 1fr !important; }
          aside {
            border-right: none !important; border-bottom: 1px solid var(--color-border);
            position: static !important; max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}
