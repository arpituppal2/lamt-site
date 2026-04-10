'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- DATA ------------------------------------------------------------------
const daySchedule = [
  { time: '08:00 AM', title: 'Check-in', subtitle: 'Arrive on campus, register your team, settle into Westwood.' },
  { time: '08:45 AM', title: 'Opening Ceremony', subtitle: 'Welcome remarks from UCLA Students and LAMT Hosts.' },
  { time: '09:15 AM', title: 'Special Team Round', subtitle: '75 minutes. A special team round, details revealed day-of.' },
  { time: '10:45 AM', title: 'Algebra/Number Theory Round', subtitle: '50 minutes · 10 problems · individual round.' },
  { time: '12:00 PM', title: 'Geometry Round', subtitle: '50 minutes · 10 problems · individual round.' },
  { time: '01:00 PM', title: 'Lunch & Disputes', subtitle: 'Recharge, explore campus, and submit solution disputes.' },
  { time: '02:00 PM', title: 'Combinatorics Round', subtitle: '50 minutes · 10 problems · individual round.' },
  { time: '03:15 PM', title: 'Guts Round', subtitle: '75 minutes · live-scored. multiple sets of 3 problems.' },
  { time: '04:30 PM', title: 'Integration Bee & Talk', subtitle: 'Integration Bee, guest lecture, tiebreaks, final disputes.' },
  { time: '06:00 PM', title: 'Awards Ceremony', subtitle: 'Team & individual awards, photos, and celebration.' },
];

const faqs = [
  {
    q: 'Who can participate?',
    a: 'LAMT is open to students in grades 6–12 during the 2025–2026 academic year. We welcome both newcomers and seasoned contestants.',
  },
  {
    q: 'When and where is the tournament held?',
    a: 'LAMT will take place on May 17th. The tournament is held in the Court of Sciences at UCLA, Los Angeles. Rounds will be held in the Mathematical Sciences Building; room assignments will be emailed to registered teams closer to the date.',
  },
    {
    q: 'Will middle school students be given a different exam?',
    a: 'No. All students will be given the same exam. The exam is designed for the high school level, though middle school students may participate.',
  },
  {
    q: 'Is LAMT only for advanced students?',
    a: 'Rounds are written to provide a challenge for competitors at all levels. We design the experience to be welcoming and aspirational for anyone who loves math, while still providing a challenging set of questions for those at an advanced level.',
  },
  {
    q: 'How many students per team?',
    a: 'Teams may have up to 6 students. Schools and programs are welcome to register multiple teams. There is no restriction on age or grade level for teams; for example, a team may consist of 6th, 8th, and 11th grade students without any issues.',
  },
  {
    q: 'Can individuals sign up without a team?',
    a: 'Yes. We plan to offer individual registration and will help form composite teams when appropriate. Details will be shared upon registration.',
  },
  {
    q: 'What is the registration fee?',
    a: 'The final registration fee is currently TBD. Pricing will be announced soon and will cover contest materials, scoring, and on-campus logistics. Need-based accommodations may be available.',
  },
  {
    q: 'Will lunch or tournament shirts be provided?',
    a: 'We are currently finalizing logistics regarding provided lunches and tournament merchandise. We will update all registered teams as soon as these details are confirmed.',
  },
  {
    q: 'Are calculators allowed?',
    a: 'No. Calculators, smart devices, and other computational aids are strictly prohibited during all testing rounds to ensure a fair environment for all participants.',
  },
  {
    q: 'Do teams need a chaperone?',
    a: 'Yes. All students or teams must be accompanied by an adult chaperone (parent, teacher, or coach) who must remain on the UCLA campus for the duration of the event.',
  },
];

// --- ANIMATION VARIANTS ----------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

// --- PAGE ------------------------------------------------------------------
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden">

      {/* HERO --------------------------------------------------------------- */}
<section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-16 pb-8 bg-gradient-to-br from-[#003B5C] to-[#006994] dark:from-black dark:to-black transition-colors duration-500">
        {/* Ambient Glows */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-[-10%] w-[460px] h-[460px] bg-[#006994] opacity-[0.2] dark:opacity-[0.45] blur-[120px] rounded-full mix-blend-screen transition-opacity duration-500" />
          <div className="absolute bottom-[-35%] right-[-15%] w-[520px] h-[520px] bg-[#FFD100] opacity-[0.15] dark:opacity-[0.25] blur-[140px] dark:blur-[170px] rounded-full mix-blend-screen transition-opacity duration-500" />
        </div>

        {/* Hero Content */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-30 max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-block py-1 px-4 rounded-full border border-white/20 dark:border-white/15 bg-white/10 dark:bg-black/40 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#FFD100] dark:text-slate-100 backdrop-blur-md shadow-sm dark:shadow-none">
              UCLA Court of Sciences · Sunday, May 17, 2026
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[7rem] font-black leading-[0.9] tracking-tight mb-8">
            <span className="text-[#FFD100] dark:text-white">LOS ANGELES</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 dark:from-[#006994] dark:to-[#003B5C]">
              MATH TOURNAMENT
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 dark:text-[#D1D5DB] font-light mb-10 leading-relaxed">
            A student-run mathematics competition hosted at UCLA,
            bringing together middle and high school students for a full day of
            rigorous problem solving across algebra, geometry, combinatorics, and number theory.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 rounded-full bg-[#FFD100] text-[#003B5C] dark:text-black font-bold tracking-wide hover:scale-105 shadow-[0_0_30px_rgba(255,209,0,0.4)] dark:shadow-[0_0_40px_rgba(255,209,0,0.4)] transition-all duration-300"
            >
              Register on ContestDojo
            </Link>
            <a
              href="#about"
              className="px-10 py-4 rounded-full border border-white/30 dark:border-white/20 text-white font-medium hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-300"
            >
              Explore the rounds
            </a>
          </motion.div>
        </motion.div>
      </section>

{/* ABOUT -------------------------------------------------------------- */}
<section
  id="about"
  className="py-24 px-6 bg-[#F5F7FB] dark:bg-black transition-colors duration-500"
>
  <div className="max-w-4xl mx-auto">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      variants={fadeUp}
      className="mb-10"
    >
      <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">
        About the tournament
      </p>
      <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#003B5C] dark:text-white mb-4">
        What is LAMT?
      </h2>
      <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
        The Los Angeles Math Tournament (LAMT) is an annual, student-run mathematics competition
        held at UCLA for middle and high school students. Teams tackle carefully crafted problems
        in algebra, geometry, combinatorics, and number theory, with an emphasis on mathematical
        depth and creative problem solving.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100]">
        Rounds and format
      </h3>
      <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
        LAMT is a full-day contest for teams of up to six students. The planned format is:
      </p>
      <ul className="mt-2 space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-300 list-disc list-inside">
        <li>Team Round 1 – 75 minutes, format revealed on contest day.</li>
        <li>Individual rounds – three 50-minute subject tests, each with 10 numerical-answer questions.</li>
        <li>Team Round 2 – 75 minutes, live scored GUTS Round.</li>
        <li>Tiebreakers (individual only) – 15 minutes, 3 short-answer problems per round.</li>
      </ul>
    </motion.div>
  </div>
</section>
      
      {/* SCHEDULE ----------------------------------------------------------- */}
      <section id="schedule" className="py-28 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-10 text-center text-[#003B5C] dark:text-white">
            LAMT 2026 will be held on May 17th.
          </motion.h2>

          <div className="space-y-2">
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10 p-5 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 hover:border-[#006994]/40 dark:hover:border-[#FFD100]/30 transition-colors shadow-sm dark:shadow-none"
              >
                <span className="w-28 text-xs font-bold font-mono tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100]">
                  {row.time}
                </span>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">{row.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">{row.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section id="faq" className="py-28 px-6 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-12 text-center text-[#003B5C] dark:text-white">
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const open = openFaq === item.q;
              return (
                <motion.div key={item.q} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.06 }} className="border-b border-slate-200 dark:border-white/10 last:border-0">
                  <button className="w-full py-4 flex items-center justify-between text-left" onClick={() => setOpenFaq(open ? null : item.q)}>
                    <span className="text-sm md:text-base font-semibold text-slate-800 dark:text-white">{item.q}</span>
                    <span className="text-slate-400 dark:text-[#9CA3AF] text-xl font-light ml-4">{open ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="pb-4 text-xs md:text-sm text-slate-600 dark:text-[#D1D5DB] leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

{/* REGISTER ----------------------------------------------------------- */}
<section
  id="register"
  className="relative overflow-hidden border-t border-slate-200 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#020617] py-24 sm:py-32 px-6"
>
  <div className="pointer-events-none absolute inset-x-0 bottom-[-25%] mx-auto h-[380px] w-[780px] -translate-y-8 rounded-full bg-[#006994] dark:bg-[#FFD100] opacity-[0.09] blur-[140px]" />

  <div className="relative z-10 mx-auto max-w-4xl text-center">
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="text-balance text-3xl md:text-5xl font-semibold tracking-tight text-[#003B5C] dark:text-white"
    >
      Registration is now open.
    </motion.h2>

    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto"
    >
      LAMT 2026 takes place on May 17, 2026 at UCLA. Register your team on ContestDojo
      and share this opportunity with students who may be interested in participating.
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="mt-8"
    >
      <Link
        href={REGISTER_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-[#FFD100] px-8 md:px-12 py-3 md:py-4 text-sm md:text-base font-semibold text-[#003B5C] dark:text-black tracking-wide shadow-[0_8px_30px_rgba(255,209,0,0.30)] dark:shadow-[0_0_45px_rgba(255,209,0,0.45)] transition-transform duration-200 hover:translate-y-[1px] hover:shadow-[0_10px_35px_rgba(255,209,0,0.35)]"
      >
        Register on ContestDojo →
      </Link>
    </motion.div>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3 text-left"
    >
      {[
        {
          title: 'Email',
          val: 'uclamathtournament@gmail.com',
          link: 'mailto:uclamathtournament@gmail.com',
        },
        {
          title: 'Instagram',
          val: '@lamathtournament',
          link: 'https://www.instagram.com/lamathtournament/',
        },
        {
          title: 'Facebook',
          val: 'LAMT Community Group',
          link: 'https://www.facebook.com/groups/1429462591976204/',
        },
      ].map((contact) => (
        <a
          key={contact.title}
          href={contact.link}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 text-sm shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-[2px] hover:border-[#006994]/30 hover:ring-[#006994]/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#FFD100]/40 dark:hover:ring-[#FFD100]/15"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#006994] dark:text-[#FFD100]">
            {contact.title}
          </span>
          <span className="mt-3 text-slate-800 dark:text-slate-50 break-words">
            {contact.val}
          </span>
          <span className="mt-3 inline-flex items-center text-[11px] font-medium text-[#006994]/80 dark:text-[#FFD100]/80">
            Open link
            <span className="ml-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              →
            </span>
          </span>
        </a>
      ))}
    </motion.div>
  </div>
</section>

    </div>
  );
}
