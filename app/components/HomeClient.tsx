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

function useIsExpired(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [expired, setExpired] = useState(Date.now() >= target);
  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => {
      if (Date.now() >= target) { setExpired(true); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
  }, [target, expired]);
  return expired;
}

function RegistrationDeadline() {
  const expired = useIsExpired('2026-05-10T23:59:59-07:00');

  return (
    <div className={`rounded-2xl border px-6 py-5 text-center ${
      expired ? 'border-gray-500/40 bg-white/5' : 'border-[#FFD100]/40 bg-[#FFD100]/5'
    }`}>
      <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-2 ${
        expired ? 'text-gray-400' : 'text-[#FFD100]'
      }`}>
        Registration Deadline
      </p>
      <p className={`text-sm font-semibold ${
        expired ? 'text-gray-400' : 'text-white'
      }`}>
        {expired ? 'Registration is now closed.' : 'May 10 at 11:59 PM PST'}
      </p>
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
  const regClosed = useIsExpired('2026-05-10T23:59:59-07:00');

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

          {/* Tournament date */}
          <motion.div variants={fadeUp} className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8] mb-2">Tournament</p>
            <p className="text-2xl md:text-4xl font-light text-white tracking-tight">May 17, 2026</p>
          </motion.div>

          {/* Registration Deadline */}
          <motion.div variants={fadeUp} className="mt-10 max-w-sm mx-auto w-full">
            <RegistrationDeadline />
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
