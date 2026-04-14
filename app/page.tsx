'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- DATA ------------------------------------------------------------------
const daySchedule = [
  { time: '8:00 AM',  title: 'Check-in',                  subtitle: 'Arrive on campus, register your team, and get settled in Westwood.' },
  { time: '8:45 AM',  title: 'Opening Ceremony',           subtitle: 'Welcome remarks from the LAMT team and UCLA faculty.' },
  { time: '9:15 AM',  title: 'Special Team Round',         subtitle: '75 minutes. Collaborative format — details revealed day-of.' },
  { time: '10:45 AM', title: 'Algebra & Number Theory',    subtitle: '50 minutes · 10 problems · individual.' },
  { time: '12:00 PM', title: 'Geometry',                   subtitle: '50 minutes · 10 problems · individual.' },
  { time: '1:00 PM',  title: 'Lunch & Disputes',           subtitle: 'Break, explore campus, and submit solution disputes.' },
  { time: '2:00 PM',  title: 'Combinatorics',              subtitle: '50 minutes · 10 problems · individual.' },
  { time: '3:15 PM',  title: 'Guts Round',                 subtitle: '75 minutes · live-scored relay. Running leaderboard throughout.' },
  { time: '4:30 PM',  title: 'Integration Bee & Talk',     subtitle: 'Integration Bee followed by a guest mathematics talk.' },
  { time: '6:00 PM',  title: 'Awards Ceremony',            subtitle: 'Team and individual awards, photos, and celebration.' },
];

const rounds = [
  {
    label: 'Special Team Round',
    duration: '75 min',
    detail: 'Format revealed on contest day. Collaborative — teams of up to 6. No spoilers.',
  },
  {
    label: 'Individual Rounds',
    duration: '3 × 50 min',
    detail: 'Algebra & Number Theory, Geometry, and Combinatorics. 10 numerical-answer problems each.',
  },
  {
    label: 'Guts Round',
    duration: '75 min',
    detail: 'Live-scored relay. Sets of 3 problems released continuously with a running leaderboard.',
  },
];

const faqs = [
  {
    q: 'Who can participate?',
    a: 'LAMT is open to any student in grades 6–12 during the 2025–2026 academic year. No prior competition experience required — we welcome first-timers and seasoned contestants alike.',
  },
  {
    q: 'When and where is the tournament?',
    a: 'LAMT 2026 takes place on Sunday, May 17 at the UCLA Court of Sciences. Rounds are held in the Mathematical Sciences Building (520 Portola Plaza, LA 90095). Room assignments are emailed to registered teams the week before.',
  },
  {
    q: 'Do middle and high schoolers take the same exam?',
    a: 'Yes. All contestants receive the same problems. The difficulty is calibrated for the high school level, but middle school students are very welcome and have done well in past competitions.',
  },
  {
    q: 'Is LAMT only for advanced students?',
    a: 'Not at all. Problems are written to provide an accessible entry point while still challenging the most advanced competitors. If you enjoy math — regardless of your contest background — LAMT is for you.',
  },
  {
    q: 'How many students can be on a team?',
    a: 'Up to 6 students per team. Schools and programs may register multiple teams. Grade levels can be mixed freely — a team with 6th, 8th, and 11th graders is perfectly fine.',
  },
  {
    q: 'Can I sign up as an individual?',
    a: 'Yes. Individual registration is available. We will help place individuals onto composite teams. Details are shared upon registration.',
  },
  {
    q: 'What is the registration fee?',
    a: 'Pricing will be announced soon and will cover contest materials, scoring, and on-campus logistics. Need-based accommodations may be available — reach out to team@lamt.net.',
  },
  {
    q: 'Will lunch be provided?',
    a: 'We are finalizing catering logistics and will update all registered teams once confirmed. There are also dining options on campus during the lunch break.',
  },
  {
    q: 'Are calculators allowed?',
    a: 'No. Calculators, phones, and all computational aids are strictly prohibited during testing rounds.',
  },
  {
    q: 'Does each team need a chaperone?',
    a: 'Yes. All students must be accompanied by an adult chaperone (parent, teacher, or coach) who must remain on the UCLA campus for the duration of the event.',
  },
];

// --- ANIMATION VARIANTS ----------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden:  { opacity: 0 },
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
        {/* ambient glows */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-[-10%] w-[460px] h-[460px] bg-[#006994] opacity-20 dark:opacity-40 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-35%] right-[-15%] w-[520px] h-[520px] bg-[#FFD100] opacity-15 dark:opacity-25 blur-[140px] rounded-full mix-blend-screen" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Dateline pill */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-block py-1 px-4 rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#FFD100] backdrop-blur-md">
              UCLA Court of Sciences · Sunday, May 17, 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-[7rem] font-black leading-[0.92] tracking-tight mb-8"
          >
            <span className="text-[#FFD100]">LOS ANGELES</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              MATH TOURNAMENT
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/85 font-light mb-10 leading-relaxed"
          >
            A student-run competition at UCLA for middle and high school students.
            A full day of algebra, geometry, combinatorics, and number theory.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 rounded-full bg-[#FFD100] text-[#003B5C] font-bold tracking-wide hover:scale-105 shadow-[0_0_30px_rgba(255,209,0,0.4)] transition-all duration-300"
            >
              Register on ContestDojo
            </Link>
            <a
              href="#about"
              className="px-10 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors duration-300"
            >
              Explore the rounds
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT -------------------------------------------------------------- */}
      <section id="about" className="py-24 px-6 bg-[#F5F7FB] dark:bg-black transition-colors duration-500">
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
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#003B5C] dark:text-white mb-4">
              What is LAMT?
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              The Los Angeles Math Tournament is a student-run competition held at UCLA,
              open to students in grades 6–12. Problems span algebra, geometry, combinatorics,
              and number theory — written to reward deep thinking, not just technique recall.
              LAMT was founded in 2026 and is run entirely by UCLA students.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-4">
              Rounds &amp; Format
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-5">
              LAMT is a full-day contest for teams of up to six students. The format:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rounds.map((r) => (
                <div
                  key={r.label}
                  className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-[#006994]/40 dark:hover:border-[#FFD100]/25 transition-colors duration-200 shadow-sm"
                >
                  <span className="inline-block text-[10px] font-mono text-[#006994] dark:text-[#FFD100] bg-[#006994]/8 dark:bg-[#FFD100]/10 px-2 py-0.5 rounded-full mb-3">
                    {r.duration}
                  </span>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{r.label}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{r.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCHEDULE ----------------------------------------------------------- */}
      <section id="schedule" className="py-28 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">
              Day-of schedule
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#003B5C] dark:text-white">
              Sunday, May 17, 2026
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">All times approximate.</p>
          </motion.div>
          <div className="space-y-2">
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10 p-5 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 hover:border-[#006994]/40 dark:hover:border-[#FFD100]/30 transition-colors shadow-sm"
              >
                <span className="w-28 text-xs font-bold font-mono tracking-[0.2em] uppercase text-[#006994] dark:text-[#FFD100]">
                  {row.time}
                </span>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">{row.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">{row.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section id="faq" className="py-28 px-6 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">
              Questions
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#003B5C] dark:text-white">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-0">
            {faqs.map((item, idx) => {
              const open = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="border-b border-slate-200 dark:border-white/10 last:border-0"
                >
                  <button
                    className="w-full py-4 flex items-center justify-between text-left gap-4"
                    onClick={() => setOpenFaq(open ? null : item.q)}
                  >
                    <span className="text-sm md:text-base font-semibold text-slate-800 dark:text-white">
                      {item.q}
                    </span>
                    <span
                      className="text-slate-400 dark:text-slate-500 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOCATION ----------------------------------------------------------- */}
      <section id="location" className="py-28 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10"
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">
              Getting there
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#003B5C] dark:text-white mb-3">
              UCLA Court of Sciences
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Mathematical Sciences Building · 520 Portola Plaza · Los Angeles, CA 90095
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Room assignments emailed to registered teams the week before the event.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm"
            style={{ aspectRatio: '16/7' }}
          >
            <iframe
              title="UCLA Mathematical Sciences Building"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.738!2d-118.4427!3d34.0689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85cbbb5827%3A0x76b2f6b7e4b2ef8a!2sMathematical%20Sciences%20Building%2C%20Los%20Angeles%2C%20CA%2090095!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* REGISTER ----------------------------------------------------------- */}
      <section
        id="register"
        className="relative overflow-hidden border-t border-slate-200 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#020617] py-24 sm:py-32 px-6"
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-[-25%] mx-auto h-[380px] w-[780px] rounded-full bg-[#006994] dark:bg-[#FFD100] opacity-[0.09] blur-[140px]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight text-[#003B5C] dark:text-white"
          >
            Registration is open.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto"
          >
            LAMT 2026 takes place on May 17 at UCLA. Register your team on ContestDojo
            and share with any students who love math.
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
              className="inline-flex items-center justify-center rounded-full bg-[#FFD100] px-10 py-4 text-sm md:text-base font-bold text-[#003B5C] tracking-wide shadow-[0_8px_30px_rgba(255,209,0,0.3)] transition-transform duration-200 hover:scale-105"
            >
              Register on ContestDojo →
            </Link>
          </motion.div>

          {/* Contact cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 text-left"
          >
            {[
              { title: 'Email',     val: 'team@lamt.net',              link: 'mailto:team@lamt.net' },
              { title: 'Instagram', val: '@lamathtournament',           link: 'https://www.instagram.com/lamathtournament/' },
              { title: 'Facebook',  val: 'LAMT Community Group',        link: 'https://www.facebook.com/groups/1429462591976204/' },
              { title: 'LinkedIn',  val: 'Los Angeles Math Tournament', link: 'https://www.linkedin.com/company/la-math-tournament/' },
            ].map((contact) => (
              <a
                key={contact.title}
                href={contact.link}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-sm shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-[2px] hover:border-[#006994]/30 hover:ring-[#006994]/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#FFD100]/40"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#006994] dark:text-[#FFD100]">
                  {contact.title}
                </span>
                <span className="mt-3 text-slate-800 dark:text-slate-100 break-words text-xs">
                  {contact.val}
                </span>
                <span className="mt-3 inline-flex items-center text-[11px] font-medium text-[#006994]/70 dark:text-[#FFD100]/70">
                  Open
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">→</span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
