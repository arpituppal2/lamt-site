"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ScheduleItem, Update, ContactMessage } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";

const TOURNAMENT_OVER = false;

const VENUES = [
  {
    id: "ms",
    label: "MS 4000A / MS 5200",
    hint: "Math Sciences Building, main testing rooms",
    gmaps: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+UCLA&destination_place_id=ChIJDU6i_dS3woARoVbP-dMqj7A",
  },
  {
    id: "cos",
    label: "Court of Sciences",
    hint: "Lunch and disputes",
    gmaps: "https://www.google.com/maps/dir/?api=1&destination=Court+of+Sciences+UCLA",
  },
  {
    id: "ms5138",
    label: "MS 5138",
    hint: "Secondary overflow room",
    gmaps: "https://www.google.com/maps/dir/?api=1&destination=Mathematical+Sciences+UCLA",
  },
];

const INFO_ITEMS = [
  { code: "NET", label: "Wi-Fi", detail: "UCLA-WEB (no password)", href: null },
  { code: "911", label: "Emergency", detail: "911 or UCPD: 310-825-4321", href: "tel:3108254321" },
  { code: "DESK", label: "Info Desk", detail: "Outside MS 4000A (8 AM+)", href: null },
  { code: "REST", label: "Restrooms", detail: "MS Building, near elevators", href: null },
  { code: "DISP", label: "Disputes", detail: "Court of Sciences (Lunch)", href: null },
  { code: "MAIL", label: "Contact Staff", detail: "uclamathtournament@gmail.com", href: "mailto:uclamathtournament@gmail.com" },
  { code: "MAP", label: "Campus Map", detail: "maps.ucla.edu", href: "https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" },
  { code: "PARK", label: "Parking", detail: "Structure 2 (nearest)", href: "https://www.google.com/maps/dir/?api=1&destination=UCLA+Parking+Structure+2" },
];

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
    const start = parseTime(schedule[i].time);
    const end = parseTime(schedule[i].end);
    if (mins >= start && mins < end) return i;
    if (mins >= start) cur = i;
  }
  return cur;
}

function getProgress(schedule: ScheduleItem[], now: Date, idx: number): number {
  if (idx < 0) return 0;
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(schedule[idx].time);
  const end = parseTime(schedule[idx].end);
  return Math.min(100, Math.max(0, ((mins - start) / (end - start)) * 100));
}

function SubscribeStrip() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="lamt-panel">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (email) setSent(true);
        }}
        className="grid gap-3 p-4 lg:grid-cols-[auto_minmax(16rem,28rem)_auto] lg:items-center"
      >
        <p className="font-extrabold uppercase text-[var(--color-text)]">Email notifications</p>
        {sent ? (
          <p className="font-bold text-[var(--color-border-strong)]">Subscribed.</p>
        ) : (
          <>
            <input
              className="lamt-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" className="btn-outline">
              Subscribe
            </button>
          </>
        )}
      </form>
    </section>
  );
}

function ScheduleWidget({ schedule }: { schedule: ScheduleItem[] }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const currentIdx = now ? getCurrentIdx(schedule, now) : -1;
  const progress = now ? getProgress(schedule, now, currentIdx) : 0;
  const current = schedule[currentIdx];
  const next = schedule[currentIdx + 1];

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Schedule</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Tournament Day Timeline</h2>
        </div>
        {!TOURNAMENT_OVER && (
          <span className="border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] px-3 py-1 text-sm font-extrabold uppercase text-[var(--ucla-blue-deep)]">
            Live
          </span>
        )}
      </div>

      <div className="lamt-panel-body">
        {current ? (
          <div className="mb-6 border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-4">
            <p className="label-caps text-[var(--color-border-strong)]">Current</p>
            <p className="mt-2 text-2xl font-extrabold text-[var(--color-text)]">{current.event}</p>
            <p className="mt-1 text-[var(--color-text-secondary)]">
              {current.time}-{current.end} / {current.location}
            </p>
            <div className="mt-4 h-2 border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="h-full bg-[var(--ucla-gold)]" style={{ width: `${progress}%` }} />
            </div>
            {next && <p className="mt-3 text-sm text-[var(--color-text-muted)]">Next: {next.event} at {next.time}</p>}
          </div>
        ) : (
          <div className="mb-6 border-2 border-[var(--color-border)] p-4">
            <p className="label-caps">Status</p>
            <p className="mt-2 text-xl font-extrabold text-[var(--color-text)]">Begins at {schedule[0]?.time}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="lamt-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, idx) => (
                <tr key={`${item.time}-${item.event}`} className={idx === currentIdx ? "bg-[var(--color-surface-2)]" : undefined}>
                  <td className="tabular-nums">
                    {item.originalTime && (
                      <span className="mb-1 block text-sm text-[var(--color-text-muted)] line-through">{item.originalTime}</span>
                    )}
                    {item.time}-{item.end}
                  </td>
                  <td>
                    <span className="font-extrabold text-[var(--color-text)]">{item.event}</span>
                    {item.adjustmentReason && (
                      <span className="mt-1 block text-sm font-bold text-[#9F2A18]">{item.adjustmentReason}</span>
                    )}
                  </td>
                  <td className="text-[var(--color-text-secondary)]">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function MapWidget() {
  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Campus</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Venues and Directions</h2>
        </div>
        <a className="btn-outline" href="https://www.maps.ucla.edu/?id=2043#!ct/75713?s/" target="_blank" rel="noopener noreferrer">
          UCLA Map
        </a>
      </div>

      <div className="lamt-panel-body grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <svg viewBox="0 0 780 420" role="img" aria-label="Simplified UCLA venue map" className="h-full min-h-[18rem] w-full">
            <rect width="780" height="420" fill="var(--color-surface-2)" />
            <rect x="0" y="110" width="780" height="14" fill="var(--color-border)" opacity="0.55" />
            <rect x="0" y="292" width="780" height="14" fill="var(--color-border)" opacity="0.55" />
            <rect x="150" y="0" width="14" height="420" fill="var(--color-border)" opacity="0.45" />
            <rect x="394" y="0" width="14" height="420" fill="var(--color-border)" opacity="0.45" />
            <rect x="604" y="0" width="14" height="420" fill="var(--color-border)" opacity="0.45" />
            <rect x="210" y="60" width="190" height="110" fill="var(--color-surface)" stroke="var(--ucla-blue)" strokeWidth="5" />
            <text x="305" y="123" textAnchor="middle" fill="var(--ucla-blue-deep)" fontSize="28" fontWeight="800">MS Building</text>
            <rect x="350" y="236" width="220" height="88" fill="var(--color-surface)" stroke="var(--ucla-blue)" strokeWidth="5" />
            <text x="460" y="290" textAnchor="middle" fill="var(--ucla-blue-deep)" fontSize="25" fontWeight="800">Court of Sciences</text>
            <rect x="84" y="210" width="150" height="68" fill="var(--color-surface)" stroke="var(--ucla-gold)" strokeWidth="5" />
            <text x="159" y="252" textAnchor="middle" fill="var(--ucla-blue-deep)" fontSize="22" fontWeight="800">Parking 2</text>
            <rect x="530" y="66" width="110" height="72" fill="var(--color-surface)" stroke="var(--ucla-gold)" strokeWidth="5" />
            <text x="585" y="111" textAnchor="middle" fill="var(--ucla-blue-deep)" fontSize="20" fontWeight="800">MS 5138</text>
            <path d="M305 170 L460 236" stroke="var(--ucla-gold)" strokeWidth="8" />
            <path d="M400 115 L530 102" stroke="var(--ucla-gold)" strokeWidth="8" />
          </svg>
        </div>

        <div className="grid gap-3">
          {VENUES.map((venue) => (
            <a key={venue.id} href={venue.gmaps} target="_blank" rel="noopener noreferrer" className="border-2 border-[var(--color-border)] p-4 hover:border-[var(--ucla-gold)] hover:bg-[var(--color-surface-2)]">
              <p className="font-extrabold text-[var(--color-text)]">{venue.label}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{venue.hint}</p>
              <p className="mt-3 text-sm font-extrabold uppercase text-[var(--color-border-strong)]">Directions</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoWidget() {
  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Information</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Help Desk</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        {INFO_ITEMS.map((item) => {
          const content = (
            <div className="min-h-32 border-b-2 border-r-2 border-[var(--color-border)] p-4 last:border-r-0 hover:bg-[var(--color-surface-2)]">
              <p className="inline-flex border-2 border-[var(--color-border-strong)] px-2 py-1 text-xs font-extrabold text-[var(--color-border-strong)]">
                {item.code}
              </p>
              <p className="mt-3 font-extrabold text-[var(--color-text)]">{item.label}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.detail}</p>
            </div>
          );

          return item.href ? (
            <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

function UpdateCard({ update, isFirst }: { update: Update; isFirst: boolean }) {
  const [expanded, setExpanded] = useState(isFirst);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    setNeedsExpand(el.scrollHeight > el.clientHeight + 2);
  }, [update.body]);

  return (
    <article className="border-b-2 border-[var(--color-border)] p-5 last:border-b-0">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {isFirst && (
          <span className="border-2 border-[var(--ucla-gold)] bg-[var(--ucla-gold)] px-2 py-1 text-xs font-extrabold uppercase text-[var(--ucla-blue-deep)]">
            Latest
          </span>
        )}
        <span className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</span>
      </div>
      {update.title && <h3 className="mb-3 text-xl font-extrabold text-[var(--color-text)]">{update.title}</h3>}
      <p
        ref={bodyRef}
        className="section-copy"
        style={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : 4,
          whiteSpace: "pre-line",
        }}
      >
        {update.body}
      </p>
      {(needsExpand || expanded) && update.body.length > 280 && (
        <button type="button" onClick={() => setExpanded((open) => !open)} className="mt-4 btn-outline">
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </article>
  );
}

function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps text-[var(--color-border-strong)]">Live Updates</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Staff Announcements</h2>
        </div>
        <span className="font-bold text-[var(--color-text-muted)]">
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>
      {updates.length === 0 ? (
        <div className="p-12 text-center text-[var(--color-text-muted)]">Updates will appear here throughout the day.</div>
      ) : (
        updates.map((update, index) => <UpdateCard key={update.id} update={update} isFirst={index === 0} />)
      )}
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const existing: ContactMessage[] = JSON.parse(sessionStorage.getItem("lamt_messages") || "[]");
      sessionStorage.setItem(
        "lamt_messages",
        JSON.stringify([
          {
            id: Date.now(),
            name,
            email,
            message: msg,
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
    setMsg("");
  }

  return (
    <section className="lamt-panel">
      <div className="lamt-panel-header">
        <div>
          <p className="label-caps">Contact</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Send a Message</h2>
        </div>
      </div>
      {status === "sent" ? (
        <div className="lamt-panel-body">
          <p className="text-xl font-extrabold text-[var(--color-text)]">Message received.</p>
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
            <textarea className="lamt-textarea" value={msg} onChange={(event) => setMsg(event.target.value)} placeholder="Questions, concerns, anything..." required />
          </label>
          <button type="submit" disabled={!name || !email || !msg} className="btn-outline justify-self-start disabled:opacity-40">
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}

export default function LivePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [updates, setUpdates] = useState<Update[]>(DEFAULT_UPDATES);

  useEffect(() => {
    try {
      const storedSchedule = sessionStorage.getItem("lamt_schedule");
      const storedUpdates = sessionStorage.getItem("lamt_updates");
      if (storedSchedule) setSchedule(JSON.parse(storedSchedule));
      if (storedUpdates) setUpdates(JSON.parse(storedUpdates));
    } catch {}
  }, []);

  return (
    <div className="bg-[var(--color-bg)]">
      <header className="ucla-band site-pad border-b-4 border-[#FFD100] py-10">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <Link href="/" className="flex items-center gap-4" aria-label="Back to LAMT home">
            <Image src="/LAMTBear.png" alt="LAMT" width={72} height={72} className="h-16 w-auto object-contain" />
            <div>
              <p className="label-caps text-[#DAEBFE]">Sunday, May 17</p>
              <h1 className="text-3xl font-extrabold text-white">LAMT 2026 Live</h1>
            </div>
          </Link>
          <p className="max-w-3xl text-lg leading-relaxed text-[#DAEBFE]">
            Tournament day schedule, UCLA campus directions, staff updates, and help requests.
          </p>
          {!TOURNAMENT_OVER && (
            <span className="inline-flex border-2 border-[#FFD100] bg-[#FFD100] px-4 py-2 font-extrabold uppercase text-[#003B5C]">
              Live
            </span>
          )}
        </div>
      </header>

      <main className="site-pad grid gap-6 py-6">
        <SubscribeStrip />
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <ScheduleWidget schedule={schedule} />
          <UpdatesFeed updates={updates} />
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <MapWidget />
          <InfoWidget />
        </div>
        <ContactForm />
      </main>
    </div>
  );
}
