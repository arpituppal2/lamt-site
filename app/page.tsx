'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DiscordLogoIcon } from '@radix-ui/react-icons';

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';
const DISCORD_URL  = 'https://discord.gg/cV6EHtfcD';

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
function Countdown() {
  const target = new Date('2026-05-17T08:00:00-07:00').getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0)
    return <span className="text-[#FFD100] text-base tracking-widest">Today</span>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-end justify-center gap-8 tabular-nums select-none">
      {[
        { val: String(d), label: 'days' },
        { val: pad(h),    label: 'hrs'  },
        { val: pad(m),    label: 'min'  },
        { val: pad(s),    label: 'sec'  },
      ].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-4xl md:text-6xl font-light text-white leading-none tracking-tight">
            {val}
          </span>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export default function HomePage() {
  return (
    <div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-16 bg-[#2774AE] dark:bg-black transition-colors duration-300 overflow-hidden -mt-20">

        {/* dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* LAMT Bear — raw, no filter */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden">
          <Image
            src="/LAMTBear.png"
            alt=""
            width={700}
            height={700}
            className="h-[85vh] w-auto object-contain opacity-20 dark:opacity-40"
            priority
          />
        </div>

        {/* bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2774AE] dark:from-black to-transparent pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-4xl w-full"
        >

          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Los Angeles<br />
            <span style={{ color: '#FFD100' }}>Math Tournament</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="w-12 h-[3px] rounded-full bg-[#FFD100] mx-auto mb-8" />

          <motion.div variants={fadeUp} className="mb-12">
            <Countdown />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-[#FFD100] rounded-lg px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#003B5C] hover:bg-[#FFC72C] transition-colors duration-200 shadow-sm"
            >
              Register
            </Link>
            <Link
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white hover:border-white/50 hover:bg-white/10 transition-colors duration-200"
            >
              <DiscordLogoIcon className="h-4 w-4" />
              Join Discord
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── REGISTER + CONTACT ── */}
      <section id="register" className="py-28 px-6 md:px-16 bg-[#2774AE] dark:bg-black transition-colors">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>

            <motion.div variants={fadeUp} className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Registration is open.
              </h2>
            </motion.div>

            <motion.p variants={fadeUp} className="text-base md:text-lg text-[#DAEBFE] max-w-lg mx-auto mb-10 leading-relaxed text-center">
              LAMT 2026 takes place May 17 at UCLA. Registration is through ContestDojo and is{' '}
              <strong className="text-white font-bold">completely free</strong>.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={REGISTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#FFD100] rounded-lg px-10 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#003B5C] hover:bg-[#FFC72C] transition-colors duration-200"
              >
                Register on ContestDojo →
              </Link>
              <Link
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-10 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:border-white/50 hover:bg-white/10 transition-colors duration-200"
              >
                <DiscordLogoIcon className="h-4 w-4" />
                Join Discord
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-20 pt-12 border-t border-white/20"
          >
            <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#8BB8E8] mb-6 text-center">
              Contact
            </motion.p>
            <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
              {[
                { title: 'Email',     val: 'team@lamt.net',       href: 'mailto:team@lamt.net' },
                { title: 'Instagram', val: '@lamathtournament',    href: 'https://www.instagram.com/lamathtournament/' },
                { title: 'Facebook',  val: 'LAMT Community',       href: 'https://www.facebook.com/groups/1429462591976204/' },
                { title: 'LinkedIn',  val: 'LA Math Tournament',   href: 'https://www.linkedin.com/company/la-math-tournament/' },
                { title: 'Discord',   val: 'Join server',          href: DISCORD_URL },
              ].map((c) => (
                <motion.a
                  key={c.title}
                  variants={fadeUp}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-1.5 bg-[#2774AE] dark:bg-[#0d0d0d] px-6 py-5 hover:bg-[#005587] dark:hover:bg-[#1a1a1a] transition-colors duration-200"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8BB8E8]">{c.title}</span>
                  <span className="text-sm text-[#DAEBFE] group-hover:text-white transition-colors">{c.val}</span>
                </motion.a>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
