"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── SCHEDULE DATA ────────────────────────────────────────────────────────────
const SCHEDULE = [
  { time: "8:00 AM",  end: "8:45 AM",  event: "Contestant Check-In",     location: "Outside MS 4000A" },
  { time: "8:45 AM",  end: "9:15 AM",  event: "Opening Ceremony",        location: "MS 4000A" },
  { time: "9:15 AM",  end: "10:30 AM", event: "Secret Team Round",       location: "MS 4000A, MS 5200" },
  { time: "10:30 AM", end: "11:30 AM", event: "Algebra / Number Theory",  location: "MS 4000A, MS 5200" },
  { time: "11:30 AM", end: "12:30 PM", event: "Combinatorics",           location: "MS 4000A, MS 5200" },
  { time: "12:30 PM", end: "1:30 PM",  event: "Lunch & Disputes",        location: "Court of Sciences" },
  { time: "1:30 PM",  end: "2:45 PM",  event: "Geometry",                location: "MS 4000A, MS 5200" },
  { time: "2:45 PM",  end: "4:15 PM",  event: "Guts Round",              location: "MS 4000A, MS 5200" },
  { time: "4:15 PM",  end: "6:00 PM",  event: "Activities",              location: "MS 4000A, MS 5200" },
  { time: "6:00 PM",  end: "7:00 PM",  event: "Awards Ceremony",         location: "MS 4000A" },
];

// ─── LIVE UPDATES ─────────────────────────────────────────────────────────────
// To add a new update: prepend to this array. Format:
// { id: number, timestamp: string, title: string, body: string }
const UPDATES: { id: number; timestamp: string; title: string; body: string }[] = [
  // TEMPLATE — uncomment and edit to post an update:
  // {
  //   id: 1,
  //   timestamp: "8:45 AM",
  //   title: "Opening Ceremony starting now!",
  //   body: "Please make your way to MS 4000A. We are beginning in 5 minutes.",
  // },
];

// ─── MAP LOCATIONS ────────────────────────────────────────────────────────────
const LOCATIONS = [
  {
    name: "MS 4000A",
    label: "Mathematical Sciences 4000A",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA",
  },
  {
    name: "MS 5200",
    label: "Mathematical Sciences 5200",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA",
  },
  {
    name: "MS 5138",
    label: "Mathematical Sciences 5138",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+Building+UCLA",
  },
  {
    name: "Court of Sciences",
    label: "Court of Sciences",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseTime(timeStr: string): number {
  const [time, period] = timeStr.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hours = h;
  if (period === "PM" && h !== 12) hours += 12;
  if (period === "AM" && h === 12) hours = 0;
  return hours * 60 + m;
}

function getCurrentEventIndex(now: Date): number {
  const minutes = now.getHours() * 60 + now.getMinutes();
  let current = -1;
  for (let i = 0; i < SCHEDULE.length; i++) {
    const start = parseTime(SCHEDULE[i].time);
    const end = parseTime(SCHEDULE[i].end);
    if (minutes >= start && minutes < end) return i;
    if (minutes >= start) current = i;
  }
  return current;
}

function getProgressInEvent(now: Date, idx: number): number {
  if (idx < 0) return 0;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(SCHEDULE[idx].time);
  const end = parseTime(SCHEDULE[idx].end);
  return Math.min(100, Math.max(0, ((minutes - start) / (end - start)) * 100));
}

// ─── SCHEDULE SECTION ─────────────────────────────────────────────────────────
function ScheduleSection() {
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const currentIdx = getCurrentEventIndex(now);
  const progress = getProgressInEvent(now, currentIdx);
  const current = SCHEDULE[currentIdx];
  const next = SCHEDULE[currentIdx + 1];

  return (
    <section className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
        aria-expanded={expanded}
        aria-controls="schedule-panel"
      >
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 transition-all hover:border-[rgba(39,116,174,0.4)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Schedule</span>
            <div className="flex items-center gap-2">
              {current && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FFD100] uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse inline-block" />
                  Live
                </span>
              )}
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`text-[var(--color-text-faint)] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          {current ? (
            <>
              <p className="text-[var(--color-text)] font-semibold text-base mb-1">{current.event}</p>
              <p className="text-[var(--color-text-muted)] text-sm mb-3">{current.time} – {current.end} · {current.location}</p>
              <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2774AE] rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {next && (
                <p className="mt-2 text-[11px] text-[var(--color-text-faint)]">Next: {next.event} at {next.time}</p>
              )}
            </>
          ) : (
            <p className="text-[var(--color-text-muted)] text-sm">Tournament day — {SCHEDULE[0].time} start</p>
          )}
        </div>
      </button>

      {expanded && (
        <div id="schedule-panel" className="mt-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-widest">Tentative Schedule</h2>
            <p className="text-[11px] text-[var(--color-text-faint)] mt-0.5">Sunday, May 17, 2026</p>
          </div>
          <div className="divide-y divide-[var(--color-divider)]">
            {SCHEDULE.map((item, i) => (
              <div
                key={i}
                className={`px-5 py-3.5 flex items-start gap-4 ${i === currentIdx ? 'bg-[rgba(39,116,174,0.08)]' : ''}`}
              >
                <div className="min-w-[72px]">
                  <span className={`text-xs font-semibold tabular-nums ${i === currentIdx ? 'text-[#2774AE]' : 'text-[var(--color-text-faint)]'}`}>
                    {item.time}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${i === currentIdx ? 'text-[#2774AE]' : 'text-[var(--color-text)]'}`}>
                    {i === currentIdx && <span className="mr-2 inline-block w-1.5 h-1.5 rounded-full bg-[#FFD100] align-middle animate-pulse" />}
                    {item.event}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── UPDATES SECTION ──────────────────────────────────────────────────────────
function UpdatesSection() {
  if (UPDATES.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Live Updates</span>
          <div className="flex-1 h-px bg-[var(--color-divider)]" />
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-5 py-10 text-center">
          <div className="w-8 h-8 mx-auto mb-3 text-[var(--color-text-faint)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/>
            </svg>
          </div>
          <p className="text-[var(--color-text-muted)] text-sm">Updates will appear here throughout the day.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Live Updates</span>
        <div className="flex-1 h-px bg-[var(--color-divider)]" />
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FFD100] uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
          Latest
        </span>
      </div>
      <div className="space-y-3">
        {UPDATES.map((update) => (
          <div key={update.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[var(--color-text-faint)] uppercase tracking-wide">{update.timestamp}</span>
            </div>
            {update.title && (
              <p className="text-[var(--color-text)] font-semibold text-base mb-2">{update.title}</p>
            )}
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">{update.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MAP SECTION ──────────────────────────────────────────────────────────────
function MapSection() {
  const [locationPerms, setLocationPerms] = useState<"idle" | "granted" | "denied">("idle");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  function requestLocation() {
    if (!navigator.geolocation) { setLocationPerms("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationPerms("granted");
      },
      () => setLocationPerms("denied")
    );
  }

  const mapSrc = `https://maps.google.com/maps?q=Mathematical+Sciences+Building+UCLA&z=16&output=embed`;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Map & Locations</span>
        <div className="flex-1 h-px bg-[var(--color-divider)]" />
      </div>
      <div className="rounded-lg overflow-hidden border border-[var(--color-border)] mb-4" style={{ height: 240 }}>
        <iframe
          src={mapSrc}
          width="100%" height="100%" style={{ border: 0 }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="UCLA Campus Map"
          className="map-iframe"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {LOCATIONS.map((loc) => (
          <a
            key={loc.name}
            href={locationPerms === "granted" && userCoords
              ? `https://www.google.com/maps/dir/${userCoords.lat},${userCoords.lng}/${encodeURIComponent(loc.label + " UCLA")}`
              : loc.directionsUrl
            }
            target="_blank" rel="noopener noreferrer"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex items-start gap-2 hover:border-[rgba(39,116,174,0.4)] transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-[#2774AE]" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p className="text-xs font-bold text-[var(--color-text)]">{loc.name}</p>
              <p className="text-[10px] text-[#2774AE] group-hover:underline mt-0.5">Directions →</p>
            </div>
          </a>
        ))}
      </div>
      {locationPerms === "idle" && (
        <button
          onClick={requestLocation}
          className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Use my location for directions
        </button>
      )}
      {locationPerms === "granted" && (
        <p className="text-center text-[11px] text-[#2774AE] font-medium">✓ Location active — directions will route from your position</p>
      )}
      {locationPerms === "denied" && (
        <p className="text-center text-[11px] text-[var(--color-text-faint)]">Enable location in browser settings for turn-by-turn directions.</p>
      )}
      <div className="mt-3 text-center">
        <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#2774AE] hover:underline">
          Full UCLA Campus Map →
        </a>
      </div>
    </section>
  );
}

// ─── INFO DRAWER ──────────────────────────────────────────────────────────────
function InfoSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#2774AE] text-white shadow-lg flex items-center justify-center hover:bg-[#005587] transition-colors"
        aria-label="Info & Help"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Info & Help">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-divider)]">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Info & Help</h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-faint)]" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Wi-Fi</p>
                <div className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2774AE] shrink-0" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                  <span className="text-sm font-semibold text-[var(--color-text)]">UCLA-WEB</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Emergency</p>
                <div className="space-y-2">
                  <a href="tel:911" className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3 border border-[var(--color-border)] hover:border-red-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 shrink-0" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 9.79 19.79 19.79 0 0 1 1.49 1.1 2 2 0 0 1 3.5-.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/></svg>
                    <div><p className="text-sm font-semibold text-[var(--color-text)]">911</p><p className="text-[11px] text-[var(--color-text-muted)]">Emergency</p></div>
                  </a>
                  <a href="tel:3108254321" className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3 border border-[var(--color-border)] hover:border-[rgba(39,116,174,0.4)] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2774AE] shrink-0" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 9.79 19.79 19.79 0 0 1 1.49 1.1 2 2 0 0 1 3.5-.09h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"/></svg>
                    <div><p className="text-sm font-semibold text-[var(--color-text)]">310-825-4321</p><p className="text-[11px] text-[var(--color-text-muted)]">UCLA UCPD Non-Emergency</p></div>
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Restrooms</p>
                <div className="bg-[var(--color-surface)] rounded-lg px-4 py-3 space-y-1.5">
                  <p className="text-sm text-[var(--color-text)]"><span className="font-semibold">MS Building</span> — restrooms on each floor near the elevators</p>
                  <p className="text-sm text-[var(--color-text)]"><span className="font-semibold">Court of Sciences</span> — restrooms in surrounding buildings (Geology, Life Sciences)</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Disputes</p>
                <div className="bg-[var(--color-surface)] rounded-lg px-4 py-3">
                  <p className="text-sm text-[var(--color-text)]">Submit disputes during <span className="font-semibold">Lunch at Court of Sciences</span></p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Contact Staff</p>
                <a href="mailto:uclamathtournament@gmail.com" className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3 border border-[var(--color-border)] hover:border-[rgba(39,116,174,0.4)] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2774AE] shrink-0" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <p className="text-sm text-[#2774AE] font-medium">uclamathtournament@gmail.com</p>
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Campus Map</p>
                <a href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer" className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3 border border-[var(--color-border)] hover:border-[rgba(39,116,174,0.4)] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2774AE] shrink-0" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  <p className="text-sm text-[#2774AE] font-medium">Interactive UCLA Campus Map</p>
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">Parking</p>
                <div className="space-y-2">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=Lot+8+UCLA+Parking" target="_blank" rel="noopener noreferrer" className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3 border border-[var(--color-border)] hover:border-[rgba(39,116,174,0.4)] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2774AE] shrink-0" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">Lot 8 (Nearest to MS)</p>
                      <p className="text-[11px] text-[#2774AE]">Get directions →</p>
                    </div>
                  </a>
                  <a href="https://transportation.ucla.edu/campus-parking/visitor-parking" target="_blank" rel="noopener noreferrer" className="bg-[var(--color-surface)] rounded-lg px-4 py-3 flex items-center gap-3 border border-[var(--color-border)] hover:border-[rgba(39,116,174,0.4)] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#2774AE] shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">All UCLA Visitor Parking</p>
                      <p className="text-[11px] text-[#2774AE]">transportation.ucla.edu →</p>
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
  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-300">
      {/* HEADER — completely disconnected from main site nav */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Back to LAMT main site">
            <div className="flex items-center gap-2 text-[var(--color-text)] hover:text-[#2774AE] transition-colors">
              <Image
                src="/LAMTBear.png"
                alt="LAMT Logo"
                width={32} height={32}
                className="h-8 w-auto object-contain opacity-90"
              />
              <span className="font-bold text-sm tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>LAMT</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[rgba(39,116,174,0.1)] text-[#2774AE] dark:text-[#8BB8E8] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="bg-[#2774AE] dark:bg-black text-white px-4 pt-8 pb-7">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8BB8E8] mb-2">Sunday, May 17th</p>
          <h1
            className="text-3xl font-bold leading-tight mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            LAMT <span style={{ color: '#FFD100' }}>2026</span>
          </h1>
          <p className="text-[#8BB8E8] text-sm font-medium">Los Angeles Math Tournament</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <UpdatesSection />
        <ScheduleSection />
        <MapSection />
      </main>

      {/* Floating info button */}
      <InfoSection />
    </div>
  );
}
