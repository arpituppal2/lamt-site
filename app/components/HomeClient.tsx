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

export default function HomeClient() {
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

  return siteMode === 'tournament' ? (
      <>
        <section className="relative flex min-h-[60vh] md:min-h-screen flex-col items-start justify-center overflow-hidden bg-[var(--ucla-blue)] px-6 text-left transition-colors duration-300 md:px-16">
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
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--ucla-blue)] to-transparent" />

          <div className="relative z-10 w-full max-w-5xl py-8">
            <h1
              className="hero-animate-words hero-run mb-6 text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="word">Los Angeles</span>
              <br />
              <span className="word">Math Tournament</span>
            </h1>
            <div className="program-rule rule-run mb-10 h-[4px] w-12 bg-[var(--ucla-gold)]" />

            <p className="hero-enter enter-run mb-8 whitespace-nowrap text-[clamp(0.95rem,2.4vw,1.25rem)] font-medium leading-normal text-white/95" data-delay="1">
              A free UCLA-hosted math tournament for students in grade 12 or below.
            </p>

            {countdown && tournamentDate && (
              <div className="mb-8">
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
                        <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--ucla-gold)]">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="hero-enter enter-run flex flex-wrap gap-3 border-t border-white/20 pt-8" data-delay="2">
              <a href="/live" className="btn-gold">
                Go to Tournament Day
              </a>
            </div>
          </div>
        </section>
      </>
    ) : (
      <section className="flex min-h-[60vh] md:min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--ucla-blue)] px-6 text-center transition-colors duration-300 md:px-16">
        <div className="relative z-10 w-full max-w-2xl py-8">
          <h1 className="mb-6 text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.05] tracking-tight text-white">
            LAMT is currently offseason
          </h1>
          <p className="text-[clamp(0.95rem,2.4vw,1.25rem)] font-medium leading-normal text-white/95">
            Check back for tournament dates and registration.
          </p>
        </div>
      </section>
    );
}
