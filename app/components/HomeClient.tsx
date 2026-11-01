'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '../lib/api';

function useCountdown(iso: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  if (!iso) return null;
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return null;
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

export default function HomeClient({
  discordUrl,
}: {
  discordUrl: string;
}) {
  const [tournamentDate, setTournamentDate] = useState<string | null>(null);
  const [tournamentName, setTournamentName] = useState('');
  const [siteMode, setSiteMode] = useState<'offseason' | 'tournament'>('offseason');
  const countdown = useCountdown(siteMode === 'tournament' ? tournamentDate : null);

  useEffect(() => {
    api
      .getSettings()
      .then(({ settings }) => {
        if (settings.tournament_date) setTournamentDate(settings.tournament_date);
        if (settings.tournament_name) setTournamentName(settings.tournament_name);
        if (settings.site_mode === 'tournament' || settings.site_mode === 'offseason') {
          setSiteMode(settings.site_mode);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative flex min-h-[85vh] flex-col items-start justify-center overflow-hidden bg-[var(--ucla-blue)] px-6 text-left transition-colors duration-300 md:min-h-screen md:px-16">
      <Image
        src="/photos/hero-hall.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-[center_35%] opacity-30"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[var(--ucla-blue)]/90" />
      <div
        aria-hidden
        className="hero-grid-lines pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ucla-gold) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="parallax-slow pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-[2%]">
        <Image src="/LAMTBear.png" alt="" width={700} height={700} className="hero-bear-img h-auto w-[clamp(280px,45vw,720px)] object-contain opacity-15" priority />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--ucla-blue)] to-transparent" />

      <div className="home-hero-seq relative z-10 w-full max-w-5xl py-8">
        <h1
          className="mb-6 text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="home-hero-line block" style={{ ['--d' as string]: '0ms' }}>
            Los Angeles
          </span>
          <span className="home-hero-line block" style={{ ['--d' as string]: '140ms' }}>
            Math Tournament
          </span>
        </h1>
        <div className="home-hero-line mb-6 h-[3px] w-12 bg-[var(--ucla-gold)]" style={{ ['--d' as string]: '280ms' }} />
        <p
          className="home-hero-line mb-8 max-w-2xl text-lg font-medium leading-relaxed text-white/95 md:text-xl"
          style={{ ['--d' as string]: '420ms' }}
        >
          A free UCLA-hosted math tournament for students in grade 12 or below.
        </p>

        {countdown && tournamentDate && (
          <div className="home-hero-line mb-8" style={{ ['--d' as string]: '560ms' }}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ucla-gold)]">
              {tournamentName || 'Next tournament'}
            </p>
            {countdown.done ? (
              <p className="text-2xl font-extrabold text-white">Tournament day is here.</p>
            ) : (
              <div className="flex flex-wrap gap-6 tabular-nums text-white">
                {[
                  ['Days', countdown.days],
                  ['Hours', countdown.hours],
                  ['Min', countdown.minutes],
                  ['Sec', countdown.seconds],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <p className="text-3xl font-extrabold md:text-4xl">{value}</p>
                    <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--ucla-gold)]">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className="home-hero-line flex flex-col gap-3 border-t border-white/20 pt-8 sm:flex-row sm:items-center sm:gap-5"
          style={{ ['--d' as string]: countdown && tournamentDate ? '700ms' : '560ms' }}
        >
          <a href="#email-signup" className="btn-gold">
            Sign up for emails
          </a>
          <a
            href={discordUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-white/90 underline decoration-white/35 underline-offset-4 transition-colors hover:text-white hover:decoration-[var(--ucla-gold)]"
          >
            Student Discord
          </a>
        </div>
        <p
          className="home-hero-line mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/90 md:text-base"
          style={{ ['--d' as string]: countdown && tournamentDate ? '840ms' : '700ms' }}
        >
          Email is for parents, teachers, and organizers. Discord is the student community.
        </p>
      </div>
    </section>
  );
}
