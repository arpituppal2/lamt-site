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

function CountdownDisplay({ diff, expiredLabel }: { diff: number; expiredLabel: string }) {
  if (diff <= 0)
    return <span className="text-[#FFD100] text-base tracking-widest">{expiredLabel}</span>;

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
          <span className="text-4xl md:text-6xl font-light text-white leading-none tracking-tight">{val}</span>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{label}</span>
        </div>
      ))}
    </div>
  );
}

function RegistrationDeadlineCountdown() {
  const diff = useCountdown('2026-05-10T23:59:59-07:00');
  const expired = diff <= 0;

  return (
    <div className={`rounded-2xl border px-6 py-5 text-center ${expired ? 'border-gray-500/40 bg-white/5' : 'border-[#FFD100]/40 bg-[#FFD100]/5'}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${expired ? 'text-gray-400' : 'text-[#FFD100]'}`}>
        {expired ? 'Registration Closed' : '⏳ Registration Deadline'}
      </p>
      {expired ? (
        <span className="text-gray-400 text-sm">Registration is now closed.</span>
      ) : (
        <>
          <CountdownDisplay diff={diff} expiredLabel="Closed" />
          <p className="mt-3 text-[11px] text-[#DAEBFE]/60 tracking-wide">
            Closes May 10 at 11:59 PM PST
          </p>
        </>
      )}
    </div>
  );
}

function TournamentCountdown() {
  const diff = useCountdown('2026-05-17T08:00:00-07:00');
  return <CountdownDisplay diff={diff} expiredLabel="Today" />;
}

export default function HomeClient({
  registerUrl,
  discordUrl,
}: {
  registerUrl: string;
  discordUrl: string;
}) {
  const regDeadlineDiff = useCountdown('2026-05-10T23:59:59-07:00');
  const regClosed = regDeadlineDiff <= 0;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-16 bg-[#2774AE] dark:bg-black transition-colors duration-300 overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 flex items-center justify-end pr-[5%] pointer-events-none select-none overflow-hidden">
          <Image src="/LAMTBear.png" alt="" width={700} height={700} className="h-[85vh] w-auto object-contain opacity-20 dark:opacity-40" priority />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2774AE] dark:from-black to-transparent pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl w-full py-8">
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Los Angeles<br />
            <span style={{ color: '#FFD100' }}>Math Tournament</span>
          </motion.h1>
          <motion.div variants={fadeUp} className="w-12 h-[3px] rounded-full bg-[#FFD100] mx-auto mb-10" />

          {/* Tournament Countdown */}
          <motion.div variants={fadeUp} className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8] mb-4">Tournament — May 17</p>
            <TournamentCountdown />
          </motion.div>

          {/* Registration Deadline Countdown */}
          <motion.div variants={fadeUp} className="mt-10 max-w-sm mx-auto w-full">
            <RegistrationDeadlineCountdown />
          </motion.div>
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
