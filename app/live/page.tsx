"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ScheduleItem, Update, LiveChat as LiveChatType } from "./types";
import { DEFAULT_SCHEDULE, DEFAULT_UPDATES } from "./types";
import { api, ApiError } from "../lib/api";

const TOURNAMENT_OVER = false;

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
  { label: "Accessibility", detail: "All venues are wheelchair accessible. Request accommodations at the Info Desk or via live chat.", href: null },
  { label: "Lost & Found", detail: "Bring found items to the Info Desk. Lost something? Ask staff or use live chat.", href: null },
  { label: "Emergency", detail: "Call 911 or UCPD at 310-825-4321.", href: "tel:3108254321" },
  { label: "Contact Staff", detail: "Tap Live Help Desk below, or email us.", href: "mailto:uclamathtournament@gmail.com" },
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
    <section className="border-t-2 border-[var(--color-border)] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label-caps">Status</p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">
            {current ? "Happening Now" : next ? "Next Up" : "Schedule Complete"}
          </h2>
        </div>
        {!TOURNAMENT_OVER && (
          <span className="flex items-center gap-2 text-sm font-extrabold uppercase text-[var(--ucla-gold-dark)]">
            <span className="h-2 w-2 rounded-full bg-[var(--ucla-gold-dark)]" aria-hidden="true" />
            Live
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-2xl font-extrabold text-[var(--color-text)]">{current?.event || next?.event || "Thanks for joining LAMT."}</p>
        {(current || next) && (
          <p className="mt-2 text-lg font-bold text-[var(--color-text-secondary)]">
            {(current || next)?.time}-{(current || next)?.end} / {(current || next)?.location}
          </p>
        )}
        {current && (
          <>
            <div className="mt-5 h-1.5 bg-[var(--color-surface-2)]">
              <div
                className="h-full bg-[var(--ucla-gold)] transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
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
    <section className="border-t-2 border-[var(--color-border)] pt-5">
      <p className="label-caps">Schedule</p>
      <h2 className="mt-1 text-xl font-extrabold text-[var(--color-text)]">Tournament Day Timeline</h2>
      <div className="mt-5 overflow-x-auto">
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
        <div className="h-[420px] min-h-[20rem] border border-[var(--color-border)]">
          <iframe
            title="UCLA Mathematical Sciences and Court of Sciences map"
            className="map-iframe"
            src={MAP_EMBED_SRC}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="grid md:grid-cols-3">
          {VENUES.map((venue) => (
            <a
              key={venue.label}
              className="group block border-t-2 border-[var(--color-divider)] py-5 pr-6 transition-colors hover:border-[var(--ucla-gold)] md:border-l-2 md:border-t-0 md:px-6 md:first:border-l-0 md:first:pl-0"
              href={venue.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="font-extrabold text-[var(--color-text)]">{venue.label}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{venue.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-[var(--color-border-strong)] transition-colors group-hover:text-[var(--ucla-gold-dark)]">
                Open map
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <section className="border-t-2 border-[var(--color-border)] pt-5">
      {updates.length === 0 ? (
        <p className="py-10 text-[var(--color-text-muted)]">Updates will appear here throughout the day.</p>
      ) : (
        <div>
          {updates.map((update, index) => (
            <article key={update.id} className="border-b-2 border-[var(--color-divider)] py-5 last:border-b-0">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {index === 0 && (
                  <span className="text-xs font-extrabold uppercase text-[var(--ucla-gold-dark)]">Latest</span>
                )}
                <span className="text-sm font-bold text-[var(--color-text-muted)]">{update.timestamp}</span>
              </div>
              {update.title && <h3 className="mb-3 text-xl font-extrabold text-[var(--color-text)]">{update.title}</h3>}
              <p className="whitespace-pre-line text-[var(--color-text-secondary)]">{update.body}</p>
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
      <div className="grid md:grid-cols-2 xl:grid-cols-3">
        {HELP_ITEMS.map((item) => {
          const content = (
            <>
              <h3 className="font-extrabold text-[var(--color-text)]">{item.label}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.detail}</p>
            </>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              className="block border-t-2 border-[var(--color-divider)] py-5 pr-6 transition-colors hover:border-[var(--ucla-gold)]"
            >
              {content}
            </a>
          ) : (
            <article key={item.label} className="block border-t-2 border-[var(--color-divider)] py-5 pr-6">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

const CHAT_ID_KEY = "lamt_live_chat_id";

function LiveChat() {
  const [chatId, setChatId] = useState<number | null>(null);
  const [chat, setChat] = useState<LiveChatType | null>(null);
  const [position, setPosition] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Restore chat from localStorage
  useEffect(() => {
    const saved = Number(window.localStorage.getItem(CHAT_ID_KEY) || 0);
    if (saved > 0) setChatId(saved);
  }, []);

  // Poll the chat
  useEffect(() => {
    if (!chatId) return;
    const cid = chatId;
    let alive = true;

    async function poll() {
      try {
        const { chat: next, position: pos } = await api.getChat(cid);
        if (!alive) return;
        setChat(next);
        setPosition(pos);
        setNotFound(false);
        if (next.status === "closed") {
          window.localStorage.removeItem(CHAT_ID_KEY);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          window.localStorage.removeItem(CHAT_ID_KEY);
          setNotFound(true);
          setChatId(null);
          setChat(null);
        }
      }
    }

    poll();
    // Poll fast when active/waiting, slow otherwise. Cleaned up on close.
    const id = window.setInterval(poll, chat?.status === "active" ? 2500 : 4000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [chatId, chat?.status]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat?.messages.length]);

  async function startChat(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setStarting(true);
    setError(null);
    try {
      const { chat: next, position: pos } = await api.startChat(name.trim(), email.trim() || undefined);
      setChat(next);
      setPosition(pos);
      setChatId(next.id);
      window.localStorage.setItem(CHAT_ID_KEY, String(next.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setStarting(false);
    }
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!chatId || !input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      await api.sendChatMessage(chatId, text);
      const { chat: next, position: pos } = await api.getChat(chatId);
      setChat(next);
      setPosition(pos);
    } catch (err) {
      setInput(text);
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setSending(false);
    }
  }

  function resetChat() {
    window.localStorage.removeItem(CHAT_ID_KEY);
    setChatId(null);
    setChat(null);
    setPosition(0);
    setInput("");
    setError(null);
  }

  const status = chat?.status;

  return (
    <section id="chat" className="section-row">
      <h2 className="section-title">Live Help Desk</h2>
      {notFound && (
        <p className="text-sm font-bold text-[#B33A2B]">Your previous chat could not be found. You can start a new one below.</p>
      )}
      {!chat && (
        <form onSubmit={startChat} className="grid max-w-2xl gap-4">
          <p className="text-[var(--color-text-secondary)]">
            Talk to a real LAMT staff member in real time. Join the queue and an admin will pick you up shortly.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="label-caps">Name</span>
              <input className="lamt-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </label>
            <label className="grid gap-2">
              <span className="label-caps">Email (optional)</span>
              <input className="lamt-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
          </div>
          {error && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
          <button type="submit" disabled={!name.trim() || starting} className="btn-outline justify-self-start disabled:opacity-40">
            {starting ? "Joining..." : "Join Live Queue"}
          </button>
        </form>
      )}
      {chat && (
        <div className="grid max-w-2xl gap-4">
          {status === "waiting" && (
            <div className="border-t-2 border-[var(--ucla-gold)] pt-4">
              <p className="font-extrabold text-[var(--color-text)]">
                You are #{position} in line.
              </p>
              <p className="mt-1 text-[var(--color-text-secondary)]">
                An admin will be with you shortly. You can type your question now — it will go through the moment someone picks you up.
              </p>
            </div>
          )}
          {status === "active" && (
            <div className="border-t-2 border-[var(--ucla-gold)] pt-4">
              <p className="font-extrabold text-[var(--color-text)]">An admin is here. Ask away!</p>
            </div>
          )}
          {status === "closed" && (
            <div className="border-t-2 border-[var(--color-border)] pt-4">
              <p className="font-extrabold text-[var(--color-text)]">This chat has ended.</p>
              <p className="mt-1 text-[var(--color-text-secondary)]">Thanks for reaching out. Need more help? Start a new chat.</p>
              <button type="button" onClick={resetChat} className="btn-outline mt-4">Start a New Chat</button>
            </div>
          )}
          {chat.messages.length > 0 && (
            <div className="max-h-[24rem] overflow-y-auto border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              {chat.messages.map((m) => (
                <div key={m.id} className={`mb-3 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 text-sm ${m.sender === "user" ? "bg-[#2774AE] text-white" : "bg-[var(--color-divider)] text-[var(--color-text)]"}`}>
                    <p className="whitespace-pre-line">{m.body}</p>
                    <p className={`mt-1 text-[10px] ${m.sender === "user" ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                      {new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
          {error && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
          {status !== "closed" && (
            <form onSubmit={send} className="flex gap-3">
              <input
                className="lamt-input flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={status === "waiting" ? "Type your question..." : "Reply..."}
              />
              <button type="submit" disabled={!input.trim() || sending} className="btn-filled disabled:opacity-40">
                {sending ? "..." : "Send"}
              </button>
            </form>
          )}
          <p className="text-xs text-[var(--color-text-muted)]">
            Need to leave? <button type="button" onClick={resetChat} className="underline">Exit chat</button>
          </p>
        </div>
      )}
    </section>
  );
}

export default function LivePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [updates, setUpdates] = useState<Update[]>(DEFAULT_UPDATES);

  useEffect(() => {
    let alive = true;

    async function sync() {
      try {
        const [nextSchedule, nextUpdates] = await Promise.all([api.getSchedule(), api.getAnnouncements()]);
        if (!alive) return;
        setSchedule(nextSchedule);
        setUpdates(nextUpdates);
      } catch {}
    }

    sync();
    const id = window.setInterval(sync, 30_000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
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
              <a href="#chat" className="btn-outline">
                Live Chat
              </a>
            </div>
          </div>
          <Link href="/" aria-label="Back to LAMT home" className="hidden opacity-90 transition-opacity hover:opacity-100 lg:block">
            <Image src="/LAMTBear.png" alt="LAMT" width={150} height={150} priority className="h-36 w-36 object-contain" />
          </Link>
        </div>
      </header>

      <section id="announcements" className="section-row">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="section-title">Announcements</h2>
          <span className="font-bold text-[var(--color-text-muted)]">
            {updates.length} {updates.length === 1 ? "update" : "updates"}
          </span>
        </div>
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

      <LiveChat />
    </div>
  );
}