"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ContactMessage, ScheduleItem, Update } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

const TOURNAMENT_OVER = false;

const STORAGE_KEYS = {
  messages: "lamt_messages",
  schedule: "lamt_schedule",
  updates: "lamt_updates",
};

const MAP_EMBED_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=-118.4465%2C34.0667%2C-118.4385%2C34.0715&layer=mapnik&marker=34.0690%2C-118.4428";

const VENUES = [
  {
    label: "MS 4000A / MS 5200",
    detail: "Primary testing rooms in the Mathematical Sciences Building.",
    href: "https://www.google.com/maps/search/?api=1&query=UCLA+Mathematical+Sciences+Building",
  },
  {
    label: "Court of Sciences",
    detail: "Lunch, disputes, and outdoor gathering point.",
    href: "https://www.google.com/maps/search/?api=1&query=Court+of+Sciences+UCLA",
  },
  {
    label: "Parking Structure 2",
    detail: "Closest public parking reference for arrival.",
    href: "https://www.google.com/maps/search/?api=1&query=UCLA+Parking+Structure+2",
  },
];

const HELP_ITEMS = [
  { label: "Info Desk", detail: "Outside MS 4000A starting at 8:00 AM.", href: null },
  { label: "Wi-Fi", detail: "Use UCLA-WEB; no password is required.", href: null },
  { label: "Restrooms", detail: "Use the MS Building restrooms near the elevators.", href: null },
  { label: "Disputes", detail: "Disputes are handled at Court of Sciences during lunch.", href: null },
  { label: "Emergency", detail: "Call 911 or UCPD at 310-825-4321.", href: "tel:3108254321" },
  { label: "Contact Staff", detail: "uclamathtournament@gmail.com", href: "mailto:uclamathtournament@gmail.com" },
];

function parseTime(value: string): number {
  const [time, period] = value.split(" ");
  const [hour, minute] = time.split(":").map(Number);
  let hours = hour;

  if (period === "PM" && hour !== 12) hours += 12;
  if (period === "AM" && hour === 12) hours = 0;

  return hours * 60 + minute;
}

function getTimelineState(schedule: ScheduleItem[], now: Date | null) {
  if (!now) return { currentIdx: -1, nextIdx: -1, progress: 0 };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentIdx = schedule.findIndex((item) => {
    const start = parseTime(item.time);
    const end = parseTime(item.end);
    return currentMinutes >= start && currentMinutes < end;
  });
  const nextIdx = schedule.findIndex((item) => currentMinutes < parseTime(item.time));

  if (currentIdx === -1) return { currentIdx, nextIdx, progress: 0 };

  const start = parseTime(schedule[currentIdx].time);
  const end = parseTime(schedule[currentIdx].end);
  const progress = Math.min(100, Math.max(0, ((currentMinutes - start) / (end - start)) * 100));

  return { currentIdx, nextIdx, progress };
}

function readStored<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

function LiveStatus({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const { currentIdx, nextIdx, progress } = getTimelineState(schedule, now);
  const current = schedule[currentIdx];
  const next = current ? schedule[currentIdx + 1] : schedule[nextIdx];

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Status</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">
            {current ? "Happening Now" : next ? "Next Up" : "Schedule Complete"}
          </h2>
        </div>
        {!TOURNAMENT_OVER && (
          <span className="inline-flex border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] px-3 py-1 text-sm font-extrabold uppercase text-[var(--ucla-blue-deep)]">
            Live
          </span>
        )}
      </div>

      <div className="lamt-panel-body">
        <p className="text-2xl font-extrabold text-[var(--color-text)]">{current?.event || next?.event || "Thanks for joining LAMT."}</p>
        {(current || next) && (
          <p className="mt-2 text-lg font-bold text-[var(--color-text-secondary)]">
            {(current || next)?.time}-{(current || next)?.end} / {(current || next)?.location}
          </p>
        )}
        {current && (
          <>
            <div className="mt-5 h-3 border-2 border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <div className="h-full bg-[var(--ucla-gold)]" style={{ width: `${progress}%` }} />
            </div>
            {next && <p className="mt-3 text-sm font-bold text-[var(--color-text-muted)]">Next: {next.event} at {next.time}</p>}
          </>
        )}
        {!current && next && <p className="mt-3 text-sm font-bold text-[var(--color-text-muted)]">The next scheduled event starts at {next.time}.</p>}
      </div>
    </section>
  );
}

function ScheduleTable({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Schedule</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Tournament Day Timeline</h2>
        </div>
      </div>
      <div className="lamt-panel-body overflow-x-auto">
        <table className="lamt-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={`${item.time}-${item.event}`}>
                <td className="tabular-nums text-[var(--color-text-secondary)]">
                  {item.originalTime && <span className="mb-1 block text-sm text-[var(--color-text-muted)] line-through">{item.originalTime}</span>}
                  {item.time}-{item.end}
                </td>
                <td>
                  <span className="font-extrabold text-[var(--color-text)]">{item.event}</span>
                  {item.adjustmentReason && <span className="mt-1 block text-sm font-bold text-[#9F2A18]">{item.adjustmentReason}</span>}
                </td>
                <td className="text-[var(--color-text-secondary)]">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" className="section-row">
      <h2 className="section-title">Campus Map</h2>
      <div className="grid gap-5">
        <div className="h-[420px] min-h-[20rem] border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
          <iframe
            title="UCLA Mathematical Sciences and Court of Sciences map"
            className="map-iframe"
            src={MAP_EMBED_SRC}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {VENUES.map((venue) => (
            <a key={venue.label} className="lamt-panel p-4 hover:border-[var(--ucla-gold)]" href={venue.href} target="_blank" rel="noopener noreferrer">
              <h3 className="font-extrabold text-[var(--color-text)]">{venue.label}</h3>
              <p className="section-copy mt-2 text-sm">{venue.detail}</p>
              <span className="mt-4 inline-flex text-sm font-extrabold uppercase text-[var(--color-border-strong)]">Open Map</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Live Updates</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Staff Announcements</h2>
        </div>
        <span className="font-bold text-[var(--color-text-muted)]">
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>
      {updates.length === 0 ? (
        <div className="lamt-panel-body">
          <p className="section-copy">Updates will appear here throughout the day.</p>
        </div>
      ) : (
        <div>
          {updates.map((update, index) => (
            <article key={update.id} className="border-b-2 border-[var(--color-border)] p-5 last:border-b-0">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {index === 0 && (
                  <span className="border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] px-2 py-1 text-xs font-extrabold uppercase text-[var(--ucla-blue-deep)]">
                    Latest
                  </span>
                )}
                <span className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</span>
              </div>
              {update.title && <h3 className="mb-3 text-xl font-extrabold text-[var(--color-text)]">{update.title}</h3>}
              <p className="section-copy whitespace-pre-line">{update.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function HelpSection() {
  return (
    <section className="section-row">
      <h2 className="section-title">Info & Help</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {HELP_ITEMS.map((item) => {
          const content = (
            <>
              <h3 className="font-extrabold text-[var(--color-text)]">{item.label}</h3>
              <p className="section-copy mt-2 text-sm">{item.detail}</p>
            </>
          );

          return item.href ? (
            <a key={item.label} href={item.href} className="lamt-panel p-4 hover:border-[var(--ucla-gold)]">
              {content}
            </a>
          ) : (
            <article key={item.label} className="lamt-panel p-4">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function submit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const existing = readStored<ContactMessage[]>(STORAGE_KEYS.messages, []);
      window.localStorage.setItem(
        STORAGE_KEYS.messages,
        JSON.stringify([
          {
            id: Date.now(),
            name,
            email,
            message,
            timestamp: new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
            resolved: false,
            replies: [],
          },
          ...existing,
        ])
      );
    } catch {}

    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section className="section-row">
      <h2 className="section-title">Message Staff</h2>
      <div className="lamt-panel">
        {status === "sent" ? (
          <div className="lamt-panel-body">
            <h3 className="text-xl font-extrabold text-[var(--color-text)]">Message received.</h3>
            <p className="section-copy mt-2">Staff will reply to your email soon.</p>
            <button type="button" onClick={() => setStatus("idle")} className="btn-outline mt-5">
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="lamt-panel-body grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="grid gap-2">
                <span className="label-caps">Name</span>
                <input className="lamt-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
              </label>
              <label className="grid gap-2">
                <span className="label-caps">Email</span>
                <input className="lamt-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="label-caps">Message</span>
              <textarea className="lamt-textarea" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Questions, concerns, anything..." required />
            </label>
            <button type="submit" disabled={!name || !email || !message} className="btn-outline justify-self-start disabled:opacity-40">
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function LivePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [updates, setUpdates] = useState<Update[]>(DEFAULT_UPDATES);

  useEffect(() => {
    function syncStoredData() {
      try {
        setSchedule(readStored<ScheduleItem[]>(STORAGE_KEYS.schedule, DEFAULT_SCHEDULE));
        setUpdates(readStored<Update[]>(STORAGE_KEYS.updates, DEFAULT_UPDATES));
      } catch {}
    }

    syncStoredData();

    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.schedule || event.key === STORAGE_KEYS.updates) {
        syncStoredData();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Live Operations</p>
          <span className="gold-rule" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="page-title">LAMT 2026 Tournament Day</h1>
            <p className="page-summary mt-5">
              Schedule status, staff announcements, UCLA venue directions, and tournament-day help for Sunday, May 17, 2026.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#announcements" className="btn-filled">
                Announcements
              </a>
              <a href="#schedule" className="btn-filled">
                Schedule
              </a>
              <a href="#map" className="btn-outline">
                Campus Map
              </a>
              <a href="#help" className="btn-outline">
                Help
              </a>
            </div>
          </div>
          <Link href="/" aria-label="Back to LAMT home" className="hidden border-2 border-[var(--ucla-gold)] bg-[var(--color-surface)] p-4 lg:block">
            <Image src="/LAMTBear.png" alt="LAMT" width={150} height={150} priority className="h-36 w-36 object-contain" />
          </Link>
        </div>
      </header>

      <section id="announcements" className="section-row">
        <h2 className="section-title">Announcements</h2>
        <UpdatesFeed updates={updates} />
      </section>

      <section id="schedule" className="section-row">
        <h2 className="section-title">Today</h2>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <LiveStatus schedule={schedule} />
          <ScheduleTable schedule={schedule} />
        </div>
      </section>

      <MapSection />

      <div id="help">
        <HelpSection />
      </div>

      <ContactForm />
    </div>
  );
}
