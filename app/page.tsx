'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Countdown() {
  const target = new Date('2026-05-17T08:00:00-07:00').getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0) return <span className="text-[var(--color-gold)] tracking-widest text-sm uppercase">Today</span>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-baseline gap-6 tabular-nums select-none">
      {[{ val: String(d), label: 'days' }, { val: pad(h), label: 'hrs' }, { val: pad(m), label: 'min' }, { val: pad(s), label: 'sec' }].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-bold text-[var(--color-text)] leading-none">{val}</span>
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 px-6 md:px-16 bg-[var(--color-blue-primary)] overflow-hidden">
        {/* subtle polar grid background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0px, transparent 59px, rgba(255,255,255,0.6) 60px, transparent 61px),
                              radial-gradient(circle at 50% 50%, transparent 0px, transparent 119px, rgba(255,255,255,0.4) 120px, transparent 121px),
                              radial-gradient(circle at 50% 50%, transparent 0px, transparent 179px, rgba(255,255,255,0.3) 180px, transparent 181px),
                              radial-gradient(circle at 50% 50%, transparent 0px, transparent 239px, rgba(255,255,255,0.2) 240px, transparent 241px)`,
          }}
        />

        {/* LAMT Bear — top right */}
        <div className="absolute top-0 right-0 h-full w-1/2 flex items-center justify-end pointer-events-none select-none">
          <div className="relative h-[80vh] w-[45vw] opacity-20">
            <Image src="/LAMTBear.png" alt="" fill className="object-contain object-right" />
          </div>
        </div>

        {/* Text block */}
        <div className="relative z-10 max-w-3xl">
          <p className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-6">Los Angeles Math Tournament</p>
          <h1 className="font-bold text-white leading-[0.9] tracking-tight mb-8"
            style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
          >
            LAMT<br />
            <span className="text-[var(--color-gold)]">2026</span>
          </h1>
          <p className="text-[var(--color-lighter-blue)] text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            May 17, 2026 &mdash; UCLA Campus<br />
            250 students. No registration fee.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSftpbL0NKSC4t4RqQeX4G3rCHpN4MrtKp8UhHpkEQqCvbN_hQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              Register Now
            </a>
            <Link href="/tournament" className="btn-ghost text-white border-white/40 hover:border-white">
              Tournament Info
            </Link>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="px-6 md:px-16 py-20 border-b border-[var(--color-border)]">
        <div className="max-w-3xl">
          <p className="text-[var(--color-text-muted)] text-xs tracking-[0.25em] uppercase mb-8">Time remaining</p>
          <Countdown />
        </div>
      </section>

      {/* ABOUT BLURB */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-2xl">
          <div className="gold-rule mb-8" />
          <p className="text-[var(--color-text)] text-lg md:text-xl leading-relaxed">
            The Los Angeles Math Tournament Group hosts and organizes mathematical contests
            for middle and high school students. We strive to encourage mathematical exploration
            and understanding by introducing concepts not covered in the typical pre-college
            curricula to students with high mathematical aptitude and interest.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-6 leading-relaxed">
            Each contest emphasizes collaboration between team members, while still allowing
            individuals to prove their own ability. Any individual currently enrolled in a
            pre-college institute for youth is welcome to compete as long as their primary
            enrollment is in grade 12 or below by the Tournament Date.
          </p>
          <div className="mt-10 flex gap-6">
            <Link href="/tournament" className="text-[var(--color-gold)] text-sm tracking-wide hover:underline underline-offset-4">
              Tournament Info &rarr;
            </Link>
            <Link href="/about" className="text-[var(--color-text-secondary)] text-sm tracking-wide hover:text-[var(--color-text)] transition-colors">
              About Us &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
