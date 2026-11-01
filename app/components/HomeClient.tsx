'use client';

import Image from 'next/image';
import Link from 'next/link';
import SubscribeForm from './SubscribeForm';

const homeButtonClass =
  'btn-ripple inline-flex min-h-11 items-center justify-center border-2 border-white px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white hover:text-[#2774AE]';

export default function HomeClient({
  discordUrl,
}: {
  discordUrl: string;
}) {
  return (
    <>
      <section className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden bg-[#2774AE] px-6 text-left transition-colors duration-300 dark:bg-black md:px-16">
        <div
          aria-hidden
          className="hero-grid-lines pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="parallax-slow pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-[2%]">
          <Image src="/LAMTBear.png" alt="" width={700} height={700} className="hero-bear-img w-[clamp(400px,55vw,900px)] h-auto object-contain opacity-20 dark:opacity-40" priority />
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
          <div className="pulse-ring mb-10 h-[3px] w-12 rounded-full bg-[#FFD100]" />

          {/* Two tournaments */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start mb-10">
            <div className="reveal">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD100]">LAMT Blue</p>
              <h3 className="mb-3 text-xl font-extrabold text-white">Middle school and below</h3>
              <p className="text-[#DAEBFE] leading-relaxed">Coming near the end of February.</p>
            </div>
            <div className="reveal">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD100]">LAMT Gold</p>
              <h3 className="mb-3 text-xl font-extrabold text-white">High school and below</h3>
              <p className="text-[#DAEBFE] leading-relaxed">Coming near the end of May.</p>
            </div>
          </div>

          {/* Email signup CTA */}
          <div className="mt-auto pt-8 border-t border-white/20">
            <p className="mb-4 text-lg font-extrabold text-white">Be first to know.</p>
            <p className="mb-6 text-[#DAEBFE] leading-relaxed max-w-lg">
              Sign up for emails and we&#39;ll let you know when registration opens for each tournament.
            </p>
            <div className="grid gap-3 md:gap-4 lg:max-w-xl">
              <SubscribeForm autoFocus buttonLabel="Sign up for emails" buttonClassName="btn-gold" />
              <a href={discordUrl} target="_blank" rel="noreferrer" className={homeButtonClass}>
                Join Discord — for students
              </a>
            </div>
            <p className="mt-4 text-xs text-[#8BB8E8] leading-relaxed max-w-lg">
              Email is for parents, teachers, and organizers. Discord is the student community.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
