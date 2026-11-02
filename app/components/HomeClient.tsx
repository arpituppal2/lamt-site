'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '../lib/api';

interface EventCountdown {
  name: string;
  date: string;
}

function parseCountdown(targetDate: string, now: number): { days: number; hours: number; minutes: number; seconds: number } | null {
  const target = new Date(targetDate).getTime();
  const diff = target - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function HomeClient() {
  const [events, setEvents] = useState<EventCountdown[]>([]);
  const [siteMode, setSiteMode] = useState<'offseason' | 'tournament'>('offseason');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let mounted = true;
    api.getSettings().then(({ settings }) => {
      if (!mounted) return;
      const evts: EventCountdown[] = [];
      if (settings.event1_name && settings.event1_date) evts.push({ name: settings.event1_name, date: settings.event1_date });
      if (settings.event2_name && settings.event2_date) evts.push({ name: settings.event2_name, date: settings.event2_date });
      // Fallback to legacy single tournament fields
      if (evts.length === 0 && settings.tournament_name && settings.tournament_date) {
        evts.push({ name: settings.tournament_name, date: settings.tournament_date });
      }
      // Auto-remove expired events
      setEvents(evts.filter(e => new Date(e.date).getTime() > Date.now()));
      if (settings.site_mode === 'tournament' || settings.site_mode === 'offseason') {
        setSiteMode(settings.site_mode);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Tick the clock every second so countdowns count down live.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Drop events once their date passes.
  useEffect(() => {
    setEvents(prev => prev.filter(e => new Date(e.date).getTime() > now));
  }, [now]);

  const isTournament = siteMode === 'tournament';

  return (
    <section className="relative flex min-h-[60vh] md:min-h-screen flex-col items-start justify-center overflow-hidden bg-[var(--ucla-blue)] dark:bg-[#000000] px-6 text-left transition-colors duration-300 md:px-16">
      <div
        aria-hidden
        className="hero-grid-lines pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ucla-gold) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="parallax-slow pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-[2%]">
        <Image
          src="/LAMTBear.png"
          alt=""
          width={700}
          height={700}
          className="hero-bear-img h-auto w-[clamp(400px,55vw,900px)] object-contain opacity-40"
          priority
          style={{ transform: 'translateY(4vh)' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--ucla-blue)] to-transparent" />

      <div className="relative z-10 w-full max-w-5xl py-8">
        {events.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            {events.map((ev, i) => {
              const cd = parseCountdown(ev.date, now);
              if (!cd) return null;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="font-extrabold text-[var(--ucla-gold)]">{ev.name}</span>
                  <span className="font-mono text-sm text-white">{cd.days}d {cd.hours}h {cd.minutes}m {cd.seconds}s</span>
                </div>
              );
            })}
          </div>
        )}
        <h1
          className="hero-animate-words hero-run mb-6 text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="word">Los Angeles</span>
          <br />
          <span className="word">Math Tournament</span>
        </h1>
        <div className="program-rule rule-run mb-10 h-[4px] w-12 bg-[var(--ucla-gold)]" />

        {/* LAMT 2027 tournaments — text only, one beat at a time */}
        <p className="hero-tournaments hero-run mb-3 text-xl font-extrabold leading-normal text-white" style={{ animationDelay: '945ms' }}>
          <span className="text-[var(--ucla-gold)]">LAMT Blue</span> — Middle school and below · Coming near the end of May.
        </p>
        <p className="hero-tournaments hero-run mb-8 text-[clamp(0.95rem,2.4vw,1.25rem)] leading-normal text-white/90" style={{ animationDelay: '1260ms' }}>
          <span className="text-[var(--ucla-gold)]">LAMT Gold</span> — High school and below · Coming near the end of February.
        </p>

        <div className="hero-enter enter-run flex flex-wrap gap-3 border-t border-white/20 pt-8" data-delay="2">
          {isTournament ? (
            <a href="/live" className="btn-gold">
              Go to Tournament Day
            </a>
          ) : (
            <a href="#email-signup" className="btn-gold">
              Sign up for emails
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
