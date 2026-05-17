"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ScheduleItem, Update, ContactMessage } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const TOURNAMENT_OVER = false;
// Mapbox public token — safe to expose in client code
const MAPBOX_TOKEN = "pk.eyJ1IjoibGFtdC10b3VybmFtZW50IiwiYSI6ImNtYXhhbHF1OTBkdHQya3NleHl6eGV1NGYifQ.placeholder";
// UCLA Math Sciences Building center
const MAP_CENTER: [number, number] = [-118.4421, 34.0690];

const VENUES = [
  { id: "ms",     label: "MS 4000A / 5200",  coords: [-118.4421, 34.0690] as [number,number],
    hint: "Math Sciences Bldg, main rooms",
    gmaps: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+UCLA&destination_place_id=ChIJDU6i_dS3woARoVbP-dMqj7A" },
  { id: "cos",    label: "Court of Sciences", coords: [-118.4414, 34.0677] as [number,number],
    hint: "Lunch & Disputes",
    gmaps: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA" },
  { id: "ms5138", label: "MS 5138",            coords: [-118.4418, 34.0693] as [number,number],
    hint: "Secondary overflow room",
    gmaps: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+UCLA" },
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

// ─── SHARED MODAL ─────────────────────────────────────────────────────────────
function Modal({ onClose, title, icon, children, wide }: {
  onClose: () => void; title: string; icon?: string;
  children: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        background: "rgba(0,0,0,0.52)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.25rem",
      }}
      role="dialog" aria-modal aria-label={title}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: wide ? "min(780px,96vw)" : "min(560px,96vw)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 18,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{
          padding: "1.125rem 1.5rem",
          borderBottom: "1px solid #e8e8ea",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0, background: "#fafafa",
        }}>
          <span style={{ fontWeight: 700, fontSize: "1.0625rem", color: "#1a1a1a",
            display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {icon && <span>{icon}</span>}
            {title}
          </span>
          <button onClick={onClose} aria-label="Close"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#ebebed", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#666",
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── SUBSCRIBE STRIP ──────────────────────────────────────────────────────────
function SubscribeStrip() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);
  return (
    <div style={{
      background: "#f0f0f2", borderBottom: "1px solid #e0e0e3",
      padding: "0.5rem 2.5%",
      display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
    }}>
      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#555",
        display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Get email notifications
      </span>
      {sent ? (
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2774AE" }}>✓ Subscribed!</span>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
          style={{ display: "flex", gap: 0, flex: 1, minWidth: 240, maxWidth: 460 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required
            style={{
              flex: 1, background: "#fff", border: "1px solid #ccc",
              borderRight: "none", color: "#1a1a1a", fontSize: "0.875rem",
              padding: "0.4rem 0.875rem", outline: "none", fontFamily: "inherit",
              borderRadius: "7px 0 0 7px",
            }}
          />
          <button type="submit" style={{
            background: "#2774AE", color: "#fff", border: "none",
            fontSize: "0.8125rem", fontWeight: 700,
            padding: "0.4rem 1.125rem", cursor: "pointer",
            borderRadius: "0 7px 7px 0",
          }}>Subscribe</button>
        </form>
      )}
    </div>
  );
}

// ─── SCHEDULE MODAL ROWS ──────────────────────────────────────────────────────
function ScheduleRows({ schedule, currentIdx }: { schedule: ScheduleItem[]; currentIdx: number }) {
  return (
    <div>
      {schedule.map((item, i) => (
        <div key={i} style={{
          padding: "1.125rem 1.625rem",
          borderBottom: i < schedule.length - 1 ? "1px solid #f0f0f0" : "none",
          background: i === currentIdx ? "rgba(39,116,174,0.06)" : "transparent",
        }}>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            <div style={{ minWidth: 86, flexShrink: 0 }}>
              {item.originalTime && (
                <p style={{ fontSize: "0.8125rem", color: "#bbb", textDecoration: "line-through", lineHeight: 1.3 }}>
                  {item.originalTime}
                </p>
              )}
              <p style={{ fontSize: "0.9375rem", fontWeight: 700, lineHeight: 1.3,
                color: i === currentIdx ? "#2774AE" : "#333" }}>
                {item.time}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "1rem", fontWeight: 700,
                color: i === currentIdx ? "#2774AE" : "#1a1a1a", lineHeight: 1.3 }}>
                {i === currentIdx && (
                  <span style={{
                    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                    background: "#FFB81C", marginRight: 7, verticalAlign: "middle",
                    animation: "pulse 2s ease-in-out infinite",
                  }} />
                )}
                {item.event}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#888", marginTop: 3 }}>
                {item.time}–{item.end} · {item.location}
              </p>
              {item.adjustmentReason && (
                <p style={{ fontSize: "0.8125rem", color: "#c0392b", marginTop: 4, fontWeight: 600 }}>
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
  const [now, setNow]   = useState(new Date());
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
    <>
      <div style={{
        background: "#fff", border: "1px solid #e8e8ea",
        borderRadius: 14, overflow: "hidden", marginBottom: "1.125rem",
      }}>
        <button onClick={() => setOpen(true)} aria-label="View full schedule"
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "1rem 1.125rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "0.625rem" }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#999" }}>Schedule</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {current && (
                <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#FFB81C",
                  display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFB81C",
                    display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                  Live
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc"
                strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
          {current ? (
            <>
              <p style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 5 }}>{current.event}</p>
              <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: 10 }}>
                {current.time}–{current.end} · {current.location}
              </p>
              <div style={{ height: 4, background: "#f0f0f0", borderRadius: 999 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "#2774AE",
                  borderRadius: 999, transition: "width 2s linear" }} />
              </div>
              {next && (
                <p style={{ fontSize: "0.8125rem", color: "#bbb", marginTop: 7 }}>
                  Next: {next.event} at {next.time}
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: "0.9375rem", color: "#888" }}>Begins at {schedule[0]?.time}</p>
          )}
        </button>
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)} title="Schedule" icon="🏅">
          <ScheduleRows schedule={schedule} currentIdx={currentIdx} />
        </Modal>
      )}
    </>
  );
}

// ─── MAP WIDGET ───────────────────────────────────────────────────────────────
function MapWidget() {
  const [open, setOpen]         = useState(false);
  const [userCoords, setCoords] = useState<[number,number]|null>(null);
  const [locState, setLocState] = useState<"idle"|"loading"|"granted"|"denied">("idle");
  const mapRef                  = useRef<HTMLDivElement>(null);
  const mapInstanceRef          = useRef<any>(null);
  const userMarkerRef           = useRef<any>(null);

  function requestLocation() {
    if (!navigator.geolocation) { setLocState("denied"); return; }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      p => {
        setCoords([p.coords.longitude, p.coords.latitude]);
        setLocState("granted");
      },
      () => setLocState("denied")
    );
  }

  function dirUrl(v: typeof VENUES[0]) {
    if (locState === "granted" && userCoords) {
      return `${v.gmaps}&origin=${userCoords[1]},${userCoords[0]}`;
    }
    return v.gmaps;
  }

  // Load Mapbox and init map when modal opens
  useEffect(() => {
    if (!open) return;

    function init() {
      const mapboxgl = (window as any).mapboxgl;
      if (!mapboxgl || !mapRef.current || mapInstanceRef.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: MAP_CENTER,
        zoom: 16.5,
        pitch: 30,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      // Add venue markers
      VENUES.forEach(v => {
        const el = document.createElement("div");
        el.style.cssText = [
          "width:28px", "height:38px",
          `background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='38' viewBox='0 0 28 38'%3E%3Cpath d='M14 0C6.268 0 0 6.268 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.268 21.732 0 14 0z' fill='%232774AE'/%3E%3Ccircle cx='14' cy='14' r='5' fill='white'/%3E%3C/svg%3E")`,
          "background-size:contain", "background-repeat:no-repeat",
          "cursor:pointer",
        ].join(";");

        new mapboxgl.Marker({ element: el })
          .setLngLat(v.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 28, closeButton: false })
              .setHTML(`
                <div style="font-family:-apple-system,sans-serif;min-width:170px;padding:2px 0">
                  <p style="font-weight:800;font-size:14px;margin:0 0 4px;color:#0a0a0a">${v.label}</p>
                  <p style="font-size:12px;color:#888;margin:0 0 8px">${v.hint}</p>
                  <a href="${v.gmaps}" target="_blank" rel="noopener"
                    style="font-size:11px;font-weight:700;color:#2774AE;text-decoration:none;
                           text-transform:uppercase;letter-spacing:.08em">
                    Get Directions →
                  </a>
                </div>`
              )
          )
          .addTo(map);
      });

      mapInstanceRef.current = map;
      setTimeout(() => map.resize(), 120);
    }

    // Load CSS
    if (!document.getElementById("mapbox-css")) {
      const link = document.createElement("link");
      link.id = "mapbox-css"; link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

    // Load JS
    if ((window as any).mapboxgl) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js";
      s.onload = init;
      document.head.appendChild(s);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Drop user marker when coords arrive after map is already loaded
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;
    if (userMarkerRef.current) { userMarkerRef.current.remove(); }
    const el = document.createElement("div");
    el.style.cssText = [
      "width:16px","height:16px","border-radius:50%",
      "background:#FFB81C","border:2.5px solid white",
      "box-shadow:0 2px 8px rgba(0,0,0,0.4)",
    ].join(";");
    const m = new (window as any).mapboxgl.Marker({ element: el })
      .setLngLat(userCoords)
      .addTo(map);
    userMarkerRef.current = m;
  }, [userCoords]);

  return (
    <>
      {/* thumbnail — tapping opens real map */}
      <div style={{
        background: "#fff", border: "1px solid #e8e8ea",
        borderRadius: 14, overflow: "hidden", marginBottom: "1.125rem",
      }}>
        <button
          onClick={() => { setOpen(true); if (locState === "idle") requestLocation(); }}
          aria-label="Open campus map"
          style={{ display: "block", width: "100%", background: "none", border: "none",
            cursor: "pointer", padding: 0, position: "relative" }}
        >
          {/* Static placeholder that looks like a zoomed-in campus map */}
          <div style={{
            width: "100%", aspectRatio: "16/9",
            background: "linear-gradient(145deg, #e8f0e8 0%, #dce8dc 40%, #d0d8c8 100%)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Road lines */}
            <svg viewBox="0 0 380 213" width="100%" height="100%" style={{ position: "absolute", inset: 0 }} aria-hidden>
              {/* Background */}
              <rect width="380" height="213" fill="#e8f0e8"/>
              {/* Streets */}
              <rect x="0" y="85" width="380" height="8" fill="#d8cfc4" opacity="0.8"/>
              <rect x="0" y="155" width="380" height="7" fill="#d8cfc4" opacity="0.8"/>
              <rect x="62" y="0" width="7" height="213" fill="#d8cfc4" opacity="0.8"/>
              <rect x="190" y="0" width="7" height="213" fill="#d8cfc4" opacity="0.8"/>
              <rect x="310" y="0" width="6" height="213" fill="#d8cfc4" opacity="0.7"/>
              {/* Campus outline */}
              <polygon points="72,20 320,20 320,175 72,175" fill="rgba(180,210,180,0.35)" stroke="#4a8a4a" strokeWidth="1.5" strokeDasharray="6,3"/>
              {/* Building footprints */}
              <rect x="82" y="28" width="44" height="32" rx="2" fill="#ccc8c0" opacity="0.9"/>
              <rect x="140" y="28" width="36" height="22" rx="2" fill="#ccc8c0" opacity="0.9"/>
              <rect x="260" y="28" width="42" height="30" rx="2" fill="#ccc8c0" opacity="0.9"/>
              <rect x="82" y="110" width="38" height="24" rx="2" fill="#ccc8c0" opacity="0.9"/>
              <rect x="265" y="95" width="34" height="22" rx="2" fill="#ccc8c0" opacity="0.9"/>
              {/* MS Building — highlighted */}
              <rect x="190" y="35" width="58" height="44" rx="3" fill="rgba(39,116,174,0.22)" stroke="#2774AE" strokeWidth="2"/>
              <text x="219" y="61" textAnchor="middle" fill="#2774AE" fontSize="9.5" fontWeight="800" fontFamily="-apple-system,sans-serif">MS Bldg</text>
              {/* Court of Sciences */}
              <rect x="185" y="118" width="68" height="34" rx="3" fill="rgba(39,116,174,0.12)" stroke="#2774AE" strokeWidth="1.5"/>
              <text x="219" y="139" textAnchor="middle" fill="#2774AE" fontSize="8.5" fontWeight="700" fontFamily="-apple-system,sans-serif">Court of Sci</text>
              {/* Pins */}
              <ellipse cx="219" cy="56" rx="4" ry="5" fill="#2774AE"/>
              <ellipse cx="219" cy="134" rx="4" ry="5" fill="#2774AE"/>
              {/* Bottom badge */}
              <rect x="0" y="195" width="380" height="18" fill="rgba(0,0,0,0.35)"/>
              <circle cx="16" cy="204" r="5" fill="#e74c3c"/>
              <text x="26" y="208" fill="white" fontSize="8.5" fontWeight="700" fontFamily="-apple-system,sans-serif">📍 Map — tap to open live map</text>
            </svg>
            {locState === "granted" && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                background: "rgba(0,0,0,0.65)", color: "#FFB81C",
                fontSize: "0.625rem", fontWeight: 700, padding: "3px 9px",
                borderRadius: 5, letterSpacing: "0.08em",
              }}>📍 Location active</div>
            )}
          </div>
        </button>
      </div>

      {/* Full Mapbox modal */}
      {open && (
        <Modal onClose={() => setOpen(false)} title="Campus Map" icon="📍" wide>
          <div style={{ display: "flex", flexDirection: "column", height: "min(560px,72vh)" }}>
            <div ref={mapRef} style={{ flex: 1, minHeight: 0 }} />
            <div style={{
              borderTop: "1px solid #e8e8ea", background: "#fafafa",
              padding: "0.75rem 1.25rem",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {VENUES.map(v => (
                  <a key={v.id} href={dirUrl(v)} target="_blank" rel="noopener noreferrer"
                    style={{
                      border: "1px solid #d4d4d8", borderRadius: 7,
                      background: "#fff", padding: "0.3rem 0.75rem",
                      textDecoration: "none", fontSize: "0.8125rem",
                      fontWeight: 600, color: "#2774AE",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
                      borderRadius: 7, color: "#555", fontSize: "0.8125rem",
                      fontWeight: 600, padding: "0.3rem 0.75rem", cursor: "pointer",
                    }}>Use My Location</button>
                )}
                {locState === "loading" && <span style={{ fontSize: "0.8125rem", color: "#888" }}>Locating…</span>}
                {locState === "granted" && <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2774AE" }}>📍 Routing from your location</span>}
                <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2774AE", textDecoration: "none" }}>
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

// ─── INFO WIDGET ──────────────────────────────────────────────────────────────
const INFO_ITEMS = [
  { emoji: "📶", label: "Wi-Fi",           detail: "UCLA-WEB (no password)", href: null },
  { emoji: "🚨", label: "Emergency",        detail: "911 or UCPD: 310-825-4321", href: "tel:3108254321" },
  { emoji: "ℹ️", label: "Info Desk",        detail: "Outside MS 4000A (8 AM+)", href: null },
  { emoji: "🚻", label: "Restrooms",        detail: "MS Building, near elevators", href: null },
  { emoji: "📋", label: "Disputes",         detail: "Court of Sciences (Lunch)", href: null },
  { emoji: "✉️", label: "Contact Staff",    detail: "uclamathtournament@gmail.com", href: "mailto:uclamathtournament@gmail.com" },
  { emoji: "🗺️", label: "Campus Map",       detail: "maps.ucla.edu", href: "https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" },
  { emoji: "🅿️", label: "Parking",          detail: "Structure 2 (nearest)", href: "https://www.google.com/maps/dir/?api=1&destination=UCLA+Parking+Structure+2" },
];

function InfoWidget() {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div style={{ background: "#fff", border: "1px solid #e8e8ea", borderRadius: 14, overflow: "hidden", marginBottom: "1.125rem" }}>
        <div style={{ padding: "0.75rem 1.125rem", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#999" }}>Info & Help</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {INFO_ITEMS.map((item, i) => {
            const isOdd = i % 2 === 0;
            const notLastRow = i < INFO_ITEMS.length - 2;
            const inner = (
              <div style={{
                padding: "1rem",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "0.375rem", textAlign: "center",
                borderRight: isOdd ? "1px solid #f0f0f0" : "none",
                borderBottom: notLastRow ? "1px solid #f0f0f0" : "none",
              }}>
                <span style={{ fontSize: "1.625rem", lineHeight: 1 }}>{item.emoji}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1a1a1a" }}>{item.label}</span>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ textDecoration: "none" }}>{inner}</a>
            ) : (
              <button key={item.label} onClick={() => setModal(true)}
                style={{ background: "none", border: "none", cursor: "pointer" }}>{inner}</button>
            );
          })}
        </div>
      </div>
      {modal && (
        <Modal onClose={() => setModal(false)} title="Info & Help" icon="📓">
          {INFO_ITEMS.map((item, i) => {
            const row = (
              <div style={{
                padding: "1rem 1.625rem",
                borderBottom: i < INFO_ITEMS.length - 1 ? "1px solid #f5f5f7" : "none",
                display: "flex", alignItems: "center", gap: "1.125rem",
              }}>
                <span style={{ fontSize: "1.5rem", width: 34, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1a" }}>{item.label}</p>
                  <p style={{ fontSize: "0.875rem", color: "#888", marginTop: 2 }}>{item.detail}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ display: "block", textDecoration: "none" }}>{row}</a>
            ) : (
              <div key={item.label}>{row}</div>
            );
          })}
        </Modal>
      )}
    </>
  );
}

// ─── UPDATE CARD — with inline prose expand/collapse ─────────────────────────
const PREVIEW_LINES = 3; // How many lines to show collapsed

function UpdateCard({ update, isFirst }: { update: Update; isFirst: boolean }) {
  const [expanded, setExpanded] = useState(isFirst); // First update open by default
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    // Check if text overflows the clamped height
    const clamped = el.scrollHeight > el.clientHeight + 2;
    setNeedsExpand(clamped);
  }, [update.body]);

  return (
    <div style={{
      padding: "1.5rem 1.75rem",
      borderBottom: "1px solid #f0f0f2",
    }}>
      {/* Timestamp + LATEST badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
        {isFirst && (
          <span style={{
            background: "#FFB81C", color: "#003B5C",
            fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.22em",
            textTransform: "uppercase", padding: "2px 8px", borderRadius: 3,
          }}>Latest</span>
        )}
        <span style={{ fontSize: "0.8125rem", color: "#bbb", fontVariantNumeric: "tabular-nums" }}>
          {update.timestamp}
        </span>
      </div>

      {/* Title */}
      {update.title && (
        <p style={{
          fontWeight: 800, fontSize: "1.125rem", color: "#1a1a1a",
          marginBottom: "0.625rem", lineHeight: 1.3,
        }}>{update.title}</p>
      )}

      {/* Body — clamped when collapsed, full when expanded */}
      <p
        ref={bodyRef}
        style={{
          fontSize: "0.9375rem",
          color: "#444",
          lineHeight: 1.8,
          whiteSpace: "pre-line",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical" as any,
          WebkitLineClamp: expanded ? "unset" : PREVIEW_LINES,
          maxWidth: "72ch",
        }}
      >
        {update.body}
      </p>

      {/* Expand / Collapse toggle — only renders if text is actually long enough */}
      {(needsExpand || expanded) && update.body.split("\n").join("").length > 280 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            marginTop: "0.625rem",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.875rem", fontWeight: 700,
            color: "#2774AE", padding: 0,
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          {expanded ? (
            <>
              Show less
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </>
          ) : (
            <>
              Read more
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── UPDATES FEED ─────────────────────────────────────────────────────────────
function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e8e8ea",
      borderRadius: 14, overflow: "hidden", marginBottom: "1.5rem",
    }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1.75rem",
        borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fafafa",
      }}>
        <span style={{
          fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "#FFB81C",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFB81C",
            display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Live Updates
        </span>
        <span style={{ fontSize: "0.8125rem", color: "#bbb", fontWeight: 600 }}>
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>

      {updates.length === 0 ? (
        <div style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", color: "#bbb" }}>Updates will appear here throughout the day.</p>
        </div>
      ) : (
        updates.map((u, i) => (
          <UpdateCard key={u.id} update={u} isFirst={i === 0} />
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
  const [status, setStatus] = useState<"idle"|"sent">("idle");

  const IS: React.CSSProperties = {
    background: "#fff", border: "1px solid #d4d4d8",
    borderRadius: 9, color: "#1a1a1a", fontFamily: "inherit",
    fontSize: "0.9375rem", padding: "0.625rem 0.875rem",
    width: "100%", outline: "none",
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const existing: ContactMessage[] = JSON.parse(sessionStorage.getItem("lamt_messages") || "[]");
      sessionStorage.setItem("lamt_messages", JSON.stringify([{
        id: Date.now(), name, email, message: msg,
        timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
        resolved: false, replies: [],
      }, ...existing]));
    } catch {}
    setStatus("sent"); setName(""); setEmail(""); setMsg("");
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8ea", borderRadius: 14, overflow: "hidden" }}>
      <div style={{
        padding: "1rem 1.75rem",
        borderBottom: "1px solid #f0f0f0", background: "#fafafa",
      }}>
        <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "#999" }}>Send a Message</span>
      </div>
      {status === "sent" ? (
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "#2774AE", marginBottom: 6 }}>Message received.</p>
          <p style={{ fontSize: "0.9375rem", color: "#888", marginBottom: "1.5rem" }}>Staff will reply to your email soon.</p>
          <button onClick={() => setStatus("idle")}
            style={{
              background: "transparent", border: "1px solid #d4d4d8", borderRadius: 7,
              color: "#888", fontSize: "0.875rem", fontWeight: 700,
              padding: "0.5rem 1rem", cursor: "pointer",
            }}>Send Another</button>
        </div>
      ) : (
        <form onSubmit={submit} style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#999",
                letterSpacing: "0.1em", textTransform: "uppercase" }}>Name</label>
              <input style={IS} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#999",
                letterSpacing: "0.1em", textTransform: "uppercase" }}>Email</label>
              <input style={IS} type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#999",
              letterSpacing: "0.1em", textTransform: "uppercase" }}>Message</label>
            <textarea style={{ ...IS, minHeight: 90, resize: "vertical" }}
              value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Questions, concerns, anything..." required />
          </div>
          <button type="submit" disabled={!name || !email || !msg} style={{
            alignSelf: "flex-start", background: "#2774AE", color: "#fff",
            border: "none", borderRadius: 9, fontWeight: 700, fontSize: "0.9375rem",
            padding: "0.625rem 1.375rem", cursor: "pointer",
            opacity: (!name || !email || !msg) ? 0.4 : 1,
            transition: "opacity 150ms",
          }}>Send Message</button>
        </form>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
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
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f7",
      fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
      fontSize: "16px",
    }}>

      {/* ── HEADER ── logo only, no "LAMT Live" text ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "#2774AE",
        borderBottom: "2.5px solid #FFB81C",
        padding: "0.75rem 3%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          textDecoration: "none",
        }} aria-label="Back to LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT" width={34} height={34}
            style={{ height: 34, width: "auto", objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>
              Sunday, May 17th
            </div>
            <div style={{
              fontWeight: 800, fontSize: "1rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#fff", lineHeight: 1.2,
            }}>LAMT 2026</div>
          </div>
        </Link>
        {!TOURNAMENT_OVER && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#FFB81C",
            border: "1.5px solid #FFB81C", padding: "0.3rem 0.75rem", borderRadius: 7,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFB81C",
              display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            Live
          </span>
        )}
      </header>

      <SubscribeStrip />

      {/* ── TWO-COLUMN LAYOUT ── */}
      <main
        id="live-main"
        style={{
          display: "grid",
          gridTemplateColumns: "min(380px,38%) 1fr",
          minHeight: "calc(100vh - 96px)",
          alignItems: "start",
        }}
      >
        {/* LEFT sidebar */}
        <aside style={{
          padding: "1.375rem 1.25rem",
          position: "sticky",
          top: 96,
          maxHeight: "calc(100vh - 96px)",
          overflowY: "auto",
          borderRight: "1px solid #e0e0e3",
          background: "#f5f5f7",
        }}>
          <ScheduleWidget schedule={schedule} />
          <MapWidget />
          <InfoWidget />
        </aside>

        {/* RIGHT: updates + contact */}
        <section style={{ padding: "1.5rem 2rem 5rem" }}>
          <UpdatesFeed updates={updates} />
          <ContactForm />
        </section>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        @media (max-width: 740px) {
          #live-main { grid-template-columns: 1fr !important; }
          aside {
            border-right: none !important; border-bottom: 1px solid #e0e0e3;
            position: static !important; max-height: none !important;
          }
        }
        .mapboxgl-popup-content { padding: 14px 16px !important; border-radius: 10px !important; }
      `}</style>
    </div>
  );
}
