'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const homeButtonClass =
  'btn-ripple inline-flex min-h-11 items-center justify-center border-2 border-white px-5 py-3 text-sm font-extrabold uppercase text-white transition-colors hover:bg-white hover:text-[#2774AE]';

function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setDiff(target - Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return diff;
}

function TournamentCountdown({ diff }: { diff: number }) {
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="flex select-none items-end justify-center gap-5 tabular-nums md:gap-7">
      {[
        { value: String(days), label: 'days' },
        { value: pad(hours), label: 'hrs' },
        { value: pad(minutes), label: 'min' },
        { value: pad(seconds), label: 'sec' },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-3xl font-light leading-none tracking-tight text-white md:text-5xl">{item.value}</span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function RegistrationCountdown({ diff }: { diff: number }) {
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="flex select-none items-end justify-center gap-5 tabular-nums md:gap-7">
      {[
        { value: String(days), label: 'days' },
        { value: pad(hours), label: 'hrs' },
        { value: pad(minutes), label: 'min' },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-3xl font-light leading-none tracking-tight text-[#FFD100] md:text-5xl">{item.value}</span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomeClient({
  registerUrl,
  discordUrl,
}: {
  registerUrl: string;
  discordUrl: string;
}) {
  const tournamentDiff = useCountdown('2026-05-17T08:00:00-07:00');
  const regDiff = useCountdown('2026-05-10T23:59:59-07:00');
  const regClosed = regDiff <= 0;
  const tournamentLive = tournamentDiff <= 0;

  return (
    <>
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#2774AE] px-6 text-center transition-colors duration-300 dark:bg-black md:px-16">
        <div
          aria-hidden
          className="hero-grid-lines pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="parallax-slow pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-[5%]">
          <Image src="/LAMTBear.png" alt="" width={700} height={700} className="hero-bear-img h-[85vh] w-auto object-contain opacity-20 dark:opacity-40" priority />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#2774AE] to-transparent dark:from-black" />

        <div className="relative z-10 w-full max-w-5xl py-8">
          <h1
            className="hero-animate-words mb-6 text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="word">Los Angeles</span>
            <br />
            <span className="word gold-shimmer-text">Math Tournament</span>
          </h1>
          <div className="pulse-ring mx-auto mb-10 h-[3px] w-12 rounded-full bg-[#FFD100]" />

          {tournamentLive ? (
            <div className="reveal flex flex-col items-center gap-6">
              <p className="reveal mx-auto mb-10 max-w-lg text-center text-base leading-relaxed text-[#DAEBFE] md:text-lg">
                Thank you for participating in LAMT 2026!
              </p>
              {/* <Link href="/live" className={`${homeButtonClass} group gap-3`}>
                <span>Go to Tournament Day Site</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link> */}
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center gap-10 md:flex-row md:gap-0 ${
                regClosed ? '' : 'md:divide-x md:divide-white/20'
              }`}
            >
              <div className={`flex flex-col items-center ${regClosed ? '' : 'md:pr-14'}`}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">Tournament - May 17</p>
                <TournamentCountdown diff={tournamentDiff} />
              </div>

              {!regClosed && (
                <div className="flex flex-col items-center md:pl-14">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD100]">Registration Deadline</p>
                  <RegistrationCountdown diff={regDiff} />
                  <p className="mt-3 text-[11px] tracking-wide text-[#8BB8E8]">May 10 - 11:59 PM PST</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="register" className="bg-[#2774AE] px-6 py-28 transition-colors dark:bg-black md:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2
              className="reveal text-4xl font-bold leading-tight text-white md:text-5xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {regClosed ? 'Registration is closed.' : 'Registration is open.'}
            </h2>
            {!regClosed && (
              <p className="mt-3 text-sm font-semibold tracking-wide text-[#FFD100]">
                Deadline: May 10 at 11:59 PM PST
              </p>
            )}
          </div>
          <p className="reveal mx-auto mb-10 max-w-lg text-center text-base leading-relaxed text-[#DAEBFE] md:text-lg">
            LAMT 2026 took place on May 17 at UCLA.
            </p>
          <div className="stagger-parent flex flex-wrap items-center justify-center gap-6">
            {!regClosed && (
              <Link href={registerUrl} target="_blank" rel="noreferrer" className={homeButtonClass}>
                Register on ContestDojo
              </Link>
            )}
            <Link href={discordUrl} target="_blank" rel="noreferrer" className={homeButtonClass}>
              Join Discord
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
