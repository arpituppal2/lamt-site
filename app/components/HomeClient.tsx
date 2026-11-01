'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '../lib/api';

const homeButtonClass =
  'btn-ripple inline-flex min-h-11 items-center justify-center border-2 border-white px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white hover:text-[var(--ucla-blue)]';

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
  const countdown = useCountdown(tournamentDate);

  useEffect(() => {
    api
      .getSettings()
      .then(({ settings }) => {
        if (settings.tournament_date) setTournamentDate(settings.tournament_date);
        if (settings.tournament_name) setTournamentName(settings.tournament_name);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative flex min-h-[85vh] flex-col items-start justify-center overflow-hidden bg-[var(--ucla-blue)] px-6 text-left transition-colors duration-300 dark:bg-black md:min-h-screen md:px-16">
      <div
        aria-hidden
        className="hero-grid-lines pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ucla-gold) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="parallax-slow pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-[2%]">
        <Image src="/LAMTBear.png" alt="" width={700} height={700} className="hero-bear-img h-auto w-[clamp(280px,45vw,720px)] object-contain opacity-20 dark:opacity-40" priority />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--ucla-blue)] to-transparent dark:from-black" />

      <div className="relative z-10 w-full max-w-5xl py-8">
        <h1
          className="hero-animate-words mb-6 text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="word">Los Angeles</span>
          <br />
          <span className="word">Math Tournament</span>
        </h1>
        <div className="mb-8 h-[3px] w-12 bg-[var(--ucla-gold)]" />

        {countdown && tournamentDate ? (
          <div className="reveal mb-10">
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
        ) : (
          <div className="mb-10 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="reveal">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ucla-gold)]">LAMT Blue</p>
              <h2 className="mb-3 text-xl font-extrabold text-white">Middle school and below</h2>
              <p className="leading-relaxed text-[var(--ucla-blue-light)]">Coming near the end of February.</p>
            </div>
            <div className="reveal">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ucla-gold)]">LAMT Gold</p>
              <h2 className="mb-3 text-xl font-extrabold text-white">High school and below</h2>
              <p className="leading-relaxed text-[var(--ucla-blue-light)]">Coming near the end of May.</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-white/20 pt-8">
          <a href="#email-signup" className="btn-gold">
            Sign up for emails
          </a>
          <a href={discordUrl} target="_blank" rel="noreferrer" className={homeButtonClass}>
            Join Discord — for students
          </a>
        </div>
        <p className="mt-4 max-w-lg text-xs leading-relaxed text-[var(--color-border)]">
          Email is for parents, teachers, and organizers. Discord is the student community.
        </p>
      </div>
    </section>
  );
}
