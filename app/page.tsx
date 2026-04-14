'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// --- COUNTDOWN -------------------------------------------------------------
function Countdown() {
  const target = new Date('2026-05-17T08:00:00-07:00').getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0) return <span className="text-white/60 text-sm">Today</span>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-baseline gap-3 tabular-nums">
      {[
        { val: d, label: 'days' },
        { val: h, label: 'hrs' },
        { val: m, label: 'min' },
        { val: s, label: 'sec' },
      ].map(({ val, label }, i) => (
        <span key={label}>
          {i > 0 && <span className="mr-3 text-white/20 font-light">:</span>}
          <span className="text-2xl md:text-3xl font-bold text-white">{i === 0 ? val : pad(val)}</span>
          <span className="ml-1 text-[11px] font-medium text-white/40 uppercase tracking-widest">{label}</span>
        </span>
      ))}
    </div>
  );
}

// --- DATA ------------------------------------------------------------------
const daySchedule = [
  { time: '8:00 AM',  title: 'Check-in',               subtitle: 'Arrive on campus and register your team.' },
  { time: '8:45 AM',  title: 'Opening Ceremony',        subtitle: 'Welcome from the LAMT team and UCLA faculty.' },
  { time: '9:15 AM',  title: 'Special Team Round',      subtitle: '75 min · collaborative format, details revealed day-of.' },
  { time: '10:45 AM', title: 'Algebra & Number Theory', subtitle: '50 min · 10 problems · individual.' },
  { time: '12:00 PM', title: 'Geometry',                subtitle: '50 min · 10 problems · individual.' },
  { time: '1:00 PM',  title: 'Lunch & Disputes',        subtitle: 'Break and dispute submission window.' },
  { time: '2:00 PM',  title: 'Combinatorics',           subtitle: '50 min · 10 problems · individual.' },
  { time: '3:15 PM',  title: 'Guts Round',              subtitle: '75 min · live-scored relay with running leaderboard.' },
  { time: '4:30 PM',  title: 'Integration Bee & Talk',  subtitle: 'Integration Bee followed by a guest mathematics talk.' },
  { time: '6:00 PM',  title: 'Awards Ceremony',         subtitle: 'Team and individual awards.' },
];

const rounds = [
  {
    label: 'Special Team Round',
    duration: '75 min',
    detail: 'Format revealed on contest day. Teams of up to 6.',
  },
  {
    label: 'Individual Rounds',
    duration: '3 × 50 min',
    detail: 'Algebra & Number Theory, Geometry, Combinatorics. 10 numerical-answer problems each.',
  },
  {
    label: 'Guts Round',
    duration: '75 min',
    detail: 'Live-scored relay. Problem sets released continuously with a running leaderboard.',
  },
];

const faqs = [
  {
    q: 'Who can participate?',
    a: 'Any student in grades 6–12 during the 2025–2026 academic year. No prior competition experience needed.',
  },
  {
    q: 'When and where is the tournament?',
    a: 'Sunday, May 17, 2026 at the UCLA Court of Sciences. Rounds are held in the Mathematical Sciences Building, 520 Portola Plaza, Los Angeles, CA 90095. Room assignments are emailed to registered teams the week before.',
  },
  {
    q: 'How much does it cost?',
    a: 'LAMT 2026 is completely free to attend. There is no registration fee.',
  },
  {
    q: 'How many students can be on a team?',
    a: 'Up to 6 students per team. Schools may register multiple teams. Grade levels can be mixed freely within a team.',
  },
  {
    q: 'Can I sign up as an individual?',
    a: 'Yes. Individual registration is available; we will place you on a composite team. Details shared upon sign-up.',
  },
  {
    q: 'How should I prepare? Are sample problems available?',
    a: 'We are not releasing sample problems from LAMT, but past papers from similar competitions are excellent preparation. We recommend: Berkeley Math Tournament (BMT), Stanford Math Tournament (SMT), SoCal Math Circle Competition (SCMC), and Johns Hopkins Math Tournament (JHMT). Links: BMT → bmt.berkeley.edu, SMT → sumo.stanford.edu, SCMC → socalmathcircle.org, JHMT → hmmt.org (HMMT is also a great resource).',
  },
  {
    q: 'Do middle and high schoolers take the same exam?',
    a: 'Yes. All contestants receive the same problems. Difficulty is calibrated for the high school level, but middle schoolers are very welcome.',
  },
  {
    q: 'Is LAMT only for advanced students?',
    a: 'No. Problems are written to have an accessible entry point while still challenging experienced competitors.',
  },
  {
    q: 'Are calculators allowed?',
    a: 'No. Calculators, phones, and all computational aids are strictly prohibited during testing rounds.',
  },
  {
    q: 'Does each team need a chaperone?',
    a: 'Yes. An adult chaperone (parent, teacher, or coach) must accompany students and remain on the UCLA campus throughout the event.',
  },
  {
    q: 'Will lunch be provided?',
    a: 'We are finalizing catering logistics and will update all registered teams once confirmed. There are dining options on campus during the lunch break.',
  },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

// --- PAGE ------------------------------------------------------------------
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden">

      {/* HERO --------------------------------------------------------------- */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-6 bg-gradient-to-br from-[#003B5C] to-[#006994] dark:from-[#05080f] dark:to-[#0a1628] transition-colors duration-500">
        {/* ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-[-8%] w-[400px] h-[400px] bg-[#006994] opacity-25 dark:opacity-30 blur-[100px] rounded-full" />
          <div className="absolute -bottom-32 right-[-8%] w-[480px] h-[480px] bg-[#FFD100] opacity-10 dark:opacity-15 blur-[130px] rounded-full" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-5xl mx-auto w-full"
        >
          {/* Dateline — plain text, no pill */}
          <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/50 mb-5">
            UCLA · Court of Sciences · May 17, 2026
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-[0.9] tracking-tight mb-6"
          >
            <span className="text-[#FFD100]" style={{ display: 'block' }}>LOS ANGELES</span>
            <span className="text-white" style={{ display: 'block' }}>MATH TOURNAMENT</span>
          </motion.h1>

          {/* Subhead — factual only */}
          <motion.p variants={fadeUp} className="text-base md:text-lg text-white/70 mb-10 max-w-xl">
            A student-run competition at UCLA for grades 6–12.
            Algebra, geometry, combinatorics, and number theory.
            <span className="ml-2 text-[#FFD100]/80">Free to attend.</span>
          </motion.p>

          {/* Countdown */}
          <motion.div variants={fadeUp} className="mb-10">
            <Countdown />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <Link
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center bg-[#FFD100] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#003B5C] hover:bg-[#f5c800] transition-colors duration-200"
            >
              Register on ContestDojo
            </Link>
            <a
              href="#about"
              className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              Learn more ↓
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT -------------------------------------------------------------- */}
      <section id="about" className="py-24 px-6 bg-white dark:bg-[#05080f] border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">
              About
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-[#003B5C] dark:text-white mb-5">
              What is LAMT?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-10">
              The Los Angeles Math Tournament is a student-run competition held at UCLA,
              open to students in grades 6–12. Problems span algebra, geometry, combinatorics,
              and number theory, written to reward deep thinking over rote technique.
              LAMT is organized entirely by UCLA students and is free to attend.
            </motion.p>

            <motion.h3 variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-5">
              Rounds &amp; Format
            </motion.h3>
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rounds.map((r) => (
                <motion.div
                  key={r.label}
                  variants={fadeUp}
                  className="p-5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-[#006994]/40 dark:hover:border-[#FFD100]/25 transition-colors duration-200"
                >
                  <div className="text-[10px] font-mono font-bold text-[#006994] dark:text-[#FFD100] mb-2 tracking-wider">
                    {r.duration}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{r.label}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{r.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SCHEDULE ----------------------------------------------------------- */}
      <section id="schedule" className="py-24 px-6 bg-slate-50 dark:bg-[#030712] border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">Schedule</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-[#003B5C] dark:text-white">Sunday, May 17, 2026</motion.h2>
            <motion.p variants={fadeUp} className="mt-1 text-sm text-slate-500 dark:text-slate-400">All times approximate.</motion.p>
          </motion.div>
          <div>
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 py-4 border-b border-slate-200 dark:border-white/8 last:border-0"
              >
                <span className="w-24 flex-shrink-0 text-[11px] font-bold font-mono tracking-[0.15em] uppercase text-[#006994] dark:text-[#FFD100]">
                  {row.time}
                </span>
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{row.title}</span>
                  <span className="ml-3 text-xs text-slate-400 dark:text-slate-500">{row.subtitle}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section id="faq" className="py-24 px-6 bg-white dark:bg-[#05080f] border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">Questions</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-[#003B5C] dark:text-white">Frequently Asked</motion.h2>
          </motion.div>
          <div>
            {faqs.map((item, idx) => {
              const open = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="border-b border-slate-200 dark:border-white/10 last:border-0"
                >
                  <button
                    className="w-full py-4 flex items-center justify-between text-left gap-4"
                    onClick={() => setOpenFaq(open ? null : item.q)}
                  >
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{item.q}</span>
                    <span
                      className="text-slate-400 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</p>
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
      <section id="location" className="py-24 px-6 bg-slate-50 dark:bg-[#030712] border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-8">
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">Location</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-[#003B5C] dark:text-white mb-2">UCLA Court of Sciences</motion.h2>
            <motion.p variants={fadeUp} className="text-sm text-slate-600 dark:text-slate-300">
              Mathematical Sciences Building · 520 Portola Plaza · Los Angeles, CA 90095
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden border border-slate-200 dark:border-white/10"
            style={{ aspectRatio: '16/6' }}
          >
            <iframe
              title="UCLA Mathematical Sciences Building"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.738!2d-118.4427!3d34.0689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85cbbb5827%3A0x76b2f6b7e4b2ef8a!2sMathematical%20Sciences%20Building%2C%20Los%20Angeles%2C%20CA%2090095!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* REGISTER ----------------------------------------------------------- */}
      <section id="register" className="py-24 px-6 bg-white dark:bg-[#05080f] transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-3">Register</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight text-[#003B5C] dark:text-white mb-4">
              Registration is open.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mb-8">
              LAMT 2026 takes place on May 17 at UCLA. Registration is through ContestDojo and is free.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href={REGISTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center bg-[#FFD100] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#003B5C] hover:bg-[#f5c800] transition-colors duration-200"
              >
                Register on ContestDojo →
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mt-16 pt-10 border-t border-slate-200 dark:border-white/10"
          >
            <motion.p variants={fadeUp} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#006994] dark:text-[#FFD100] mb-6">Contact</motion.p>
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10">
              {[
                { title: 'Email',     val: 'team@lamt.net',              link: 'mailto:team@lamt.net' },
                { title: 'Instagram', val: '@lamathtournament',           link: 'https://www.instagram.com/lamathtournament/' },
                { title: 'Facebook',  val: 'LAMT Community Group',        link: 'https://www.facebook.com/groups/1429462591976204/' },
                { title: 'LinkedIn',  val: 'Los Angeles Math Tournament', link: 'https://www.linkedin.com/company/la-math-tournament/' },
              ].map((c) => (
                <motion.a
                  key={c.title}
                  variants={fadeUp}
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-2 bg-white dark:bg-[#05080f] p-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors duration-200"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{c.title}</span>
                  <span className="text-sm text-slate-800 dark:text-slate-100 break-words">{c.val}</span>
                  <span className="text-[11px] text-[#006994] dark:text-[#FFD100] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
