'use client';

import Image from 'next/image';

export default function HomeClient() {
  return (
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

        <div className="hero-enter enter-run flex flex-wrap gap-3 border-t border-white/20 pt-8" data-delay="2">
          <a href="/live" className="btn-gold">
            Go to Tournament Day
          </a>
        </div>
      </div>
    </section>
  );
}
