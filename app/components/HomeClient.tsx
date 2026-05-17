'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [diff, setDiff] = useState(target - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return diff;
}

/** Tournament countdown — days / hrs / min / sec, white tiles */
function TournamentCountdown({ diff }: { diff: number }) {
  if (diff <= 0) return null;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-end justify-center gap-5 md:gap-7 tabular-nums select-none">
      {[
        { val: String(d), label: 'days' },
        { val: pad(h),    label: 'hrs'  },
        { val: pad(m),    label: 'min'  },
        { val: pad(s),    label: 'sec'  },
      ].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-light text-white leading-none tracking-tight">{val}</span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Registration deadline countdown — days / hrs / min only, gold tiles. Returns null once expired. */
function RegistrationCountdown({ diff }: { diff: number }) {
  if (diff <= 0) return null;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-end justify-center gap-5 md:gap-7 tabular-nums select-none">
      {[
        { val: String(d), label: 'days' },
        { val: pad(h),    label: 'hrs'  },
        { val: pad(m),    label: 'min'  },
      ].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-light text-[#FFD100] leading-none tracking-tight">{val}</span>
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{label}</span>
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
  const regDiff        = useCountdown('2026-05-10T23:59:59-07:00');
  const regClosed      = regDiff <= 0;
  const tournamentLive = tournamentDiff <= 0;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-16 bg-[#2774AE] dark:bg-black transition-colors duration-300 overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 flex items-center justify-end pr-[5%] pointer-events-none select-none overflow-hidden">
          <Image src="/LAMTBear.png" alt="" width={700} height={700} className="h-[85vh] w-auto object-contain opacity-20 dark:opacity-40" priority />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2774AE] dark:from-black to-transparent pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-5xl w-full py-8">
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Los Angeles<br />
            <span style={{ color: '#FFD100' }}>Math Tournament</span>
          </motion.h1>
          <motion.div variants={fadeUp} className="w-12 h-[3px] rounded-full bg-[#FFD100] mx-auto mb-10" />

          {tournamentLive ? (
            /* ── TOURNAMENT DAY STATE ─────────────────────────── */
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
              <p className="text-[#8BB8E8] text-sm md:text-base font-medium tracking-wide max-w-md leading-relaxed">
                Tournament Day is here! Follow live updates, the schedule, and campus info on the Tournament Day site.
              </p>
              <Link
                href="/live"
                className="btn-outline inline-flex items-center gap-3 group"
              >
                <span>Go to Tournament Day Site</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>
          ) : (
            /* ── COUNTDOWN STATE ──────────────────────────────── */
            <motion.div
              variants={fadeUp}
              className={`flex flex-col md:flex-row items-center justify-center ${
                regClosed ? '' : 'md:divide-x md:divide-white/20'
              } gap-10 md:gap-0`}
            >
              {/* Tournament */}
              <div className={`flex flex-col items-center ${regClosed ? '' : 'md:pr-14'}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8] mb-4">Tournament &mdash; May 17</p>
                <TournamentCountdown diff={tournamentDiff} />
              </div>

              {/* Registration Deadline — only shown while open */}
              {!regClosed && (
                <div className="flex flex-col items-center md:pl-14">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD100] mb-4">Registration Deadline</p>
                  <RegistrationCountdown diff={regDiff} />
                  <p className="mt-3 text-[11px] text-[#8BB8E8] tracking-wide">May 10 &mdash; 11:59 PM PST</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* REGISTER SECTION */}
      <section id="register" className="py-28 px-6 md:px-16 bg-[#2774AE] dark:bg-black transition-colors">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {regClosed ? 'Registration is closed.' : 'Registration is open.'}
              </h2>
              {!regClosed && (
                <p className="mt-3 text-sm font-semibold text-[#FFD100] tracking-wide">
                  Deadline: May 10 at 11:59 PM PST
                </p>
              )}
            </motion.div>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-[#DAEBFE] max-w-lg mx-auto mb-10 leading-relaxed text-center">
              LAMT 2026 takes place May 17 at UCLA. Registration is through ContestDojo and is{' '}
              <strong className="text-white font-bold">completely free</strong>.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6">
              {!regClosed && (
                <Link href={registerUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  REGISTER ON CONTESTDOJO
                </Link>
              )}
              <Link href={discordUrl} target="_blank" rel="noreferrer" className="btn-outline">
                JOIN DISCORD
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
