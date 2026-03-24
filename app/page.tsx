'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import MathDeco from './components/MathDeco';

// --- DATA ------------------------------------------------------------------

const daySchedule = [
  { time: '08:00 AM', title: 'Check-in', subtitle: 'Arrive on campus, register your team, settle into Westwood.' },
  { time: '08:45 AM', title: 'Opening Ceremony', subtitle: 'Welcome remarks from UCLA students and faculty.' },
  { time: '09:15 AM', title: 'Special Team Round', subtitle: '75 minutes. A mystery collaboration round, revealed day-of.' },
  { time: '10:45 AM', title: 'Algebra Round', subtitle: '50 minutes · 10 problems · individual focus.' },
  { time: '12:00 PM', title: 'Geometry Round', subtitle: '50 minutes · 10 problems · precision and diagrams.' },
  { time: '01:00 PM', title: 'Lunch & Disputes', subtitle: 'Recharge, explore campus, and submit solution disputes.' },
  { time: '02:00 PM', title: 'Combinatorics Round', subtitle: '50 minutes · 10 problems · clever counting under time.' },
  { time: '03:15 PM', title: 'Guts Round', subtitle: '60–75 minutes · live-scored, high-energy team chaos.' },
  { time: '04:30 PM', title: 'Integration Bee & Talk', subtitle: 'Integration Bee, guest lecture, tiebreaks, final disputes.' },
  { time: '06:00 PM', title: 'Awards Ceremony', subtitle: 'Team & individual awards, photos, and celebration.' },
];

const faqs = [
  {
    q: 'Who can participate?',
    a: 'LAMT is open to students in grades 6–12 during the 2025–2026 academic year. We welcome both newcomers and seasoned contestants.',
  },
  {
    q: 'Is LAMT only for advanced students?',
    a: 'Rounds are written at a high level, inspired by contests like HMMT and BMT, but we design the experience to be welcoming and aspirational for anyone who loves math.',
  },
  {
    q: 'How many students per team?',
    a: 'Teams may have up to 6 students. Schools and programs are welcome to register multiple teams.',
  },
  {
    q: 'Can individuals sign up without a team?',
    a: 'Yes. We plan to offer individual registration and will help form composite teams when appropriate. Details will be shared with waitlisted participants.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Yes. Final pricing will be announced soon and will cover contest materials, scoring, and on-campus logistics. Need-based accommodations may be available.',
  },
  {
    q: 'Where is the tournament held?',
    a: 'On the UCLA campus in Westwood, Los Angeles. Exact building and room assignments will be emailed to registered teams closer to the date.',
  },
  {
    q: 'What topics are covered?',
    a: 'Algebra, geometry, number theory, and combinatorics, with problem styles inspired by AMC, AIME, and university-run tournaments.',
  },
  {
    q: 'How do we get updates?',
    a: 'Once you join the waitlist, we will send key updates by email. Coaches and team leads will also receive information about logistics and deadlines.',
  },
];

// --- ANIMATION VARIANTS ----------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// --- THEME TOGGLE ----------------------------------------------------------
// Make sure globals.css has something like:
// :root { --bg: #020617; --bg-elevated:#030712; --text:#F5F5F7; --text-muted:#9CA3AF; --card-bg:rgba(15,23,42,0.9); --card-border:rgba(148,163,184,0.35); --ucla-blue:#2774AE; --ucla-gold:#FFD100; }
// html[data-theme='light'] { --bg:#F9FAFB; --bg-elevated:#FFFFFF; --text:#020617; --text-muted:#4B5563; --card-bg:rgba(255,255,255,0.96); --card-border:rgba(15,23,42,0.08); }

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('lamt-theme') as 'dark' | 'light' | null;
    const initial =
      stored ??
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
        window.localStorage.setItem('lamt-theme', next);
      }
      return next;
    });
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="fixed top-4 right-4 z-[60]"
    >
      <motion.div
        className="w-12 h-7 rounded-full flex items-center px-1 backdrop-blur-md"
        animate={{
          backgroundColor: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.12)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ borderWidth: 1 }}
      >
        <motion.div
          layout
          className="w-5 h-5 rounded-full shadow-md flex items-center justify-center"
          animate={{
            x: isDark ? 0 : 18,
            backgroundColor: isDark ? 'var(--ucla-gold)' : 'var(--ucla-blue)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <motion.span
            key={theme}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            className="text-[10px] font-bold text-black"
          >
            {isDark ? '☾' : '☼'}
          </motion.span>
        </motion.div>
      </motion.div>
    </button>
  );
}

// --- PAGE ------------------------------------------------------------------

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <ThemeToggle />

      {/* HERO -------------------------------------------------------------- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 bg-[var(--bg)]">
        {/* UCLA glows: look good in both themes */}
        <div className="absolute inset-0 -z-20">
          <div className="absolute -top-40 left-[-10%] w-[460px] h-[460px] bg-[var(--ucla-blue)] opacity-[0.35] blur-[140px]" />
          <div className="absolute bottom-[-35%] right-[-15%] w-[520px] h-[520px] bg-[var(--ucla-gold)] opacity-[0.27] blur-[170px]" />
        </div>

        {/* Math halo with high legibility */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)"
              className="hidden md:block absolute top-[18%] left-[8%] text-[1.8rem] text-[var(--text)] drop-shadow-[0_0_18px_rgba(0,0,0,0.9)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle \sum_{n\geq0} p(n)x^n = \prod_{k\geq1}\frac{1}{1-x^k}"
              className="hidden lg:block absolute top-[10%] right-[10%] text-[2.3rem] text-[var(--ucla-gold)] drop-shadow-[0_0_24px_rgba(0,0,0,1)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle f\left( \frac{\sum x_i}{n} \right) \leq \frac{\sum f(x_i)}{n}"
              className="hidden lg:block absolute bottom-[14%] left-[14%] text-[2rem] text-slate-200 drop-shadow-[0_0_20px_rgba(0,0,0,1)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle d^2 = -a^2\Delta y \Delta z - b^2\Delta x \Delta z - c^2\Delta x \Delta y"
              className="hidden md:block absolute top-[34%] left-[3%] text-[1.7rem] text-slate-300 drop-shadow-[0_0_18px_rgba(0,0,0,0.9)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle \phi(n) = \sum_{d \mid n} \mu(d) \frac{n}{d}"
              className="hidden md:block absolute top-[32%] right-[12%] text-[1.9rem] text-[var(--ucla-gold)] drop-shadow-[0_0_22px_rgba(0,0,0,1)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle x^n - 1 = \prod_{d|n} \Phi_d(x)"
              className="absolute top-[12%] left-[18%] text-[2rem] text-[var(--text)] drop-shadow-[0_0_24px_rgba(0,0,0,1)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -22, 0] }}
            transition={{ duration: 12.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle E\left[\sum X_i\right] = \sum E[X_i]"
              className="hidden md:block absolute bottom-[22%] left-[6%] text-[2rem] text-slate-100 drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 11.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\displaystyle |X/G| = \frac{1}{|G|} \sum_{g \in G} |X^g|"
              className="absolute bottom-[16%] right-[10%] text-[1.9rem] text-slate-200 drop-shadow-[0_0_20px_rgba(0,0,0,0.95)]"
            />
          </motion.div>
        </div>

        {/* Hero content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-block py-1 px-4 rounded-full border border-white/15 bg-black/40 text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--text)]">
              UCLA · Los Angeles Math Tournament · May 17, 2026
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-[7rem] font-black leading-[0.9] tracking-tight mb-8"
          >
            Where math
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--text)] via-[var(--text)] to-[var(--text-muted)]">
              meets Westwood.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-muted)] font-light mb-10 leading-relaxed"
          >
            A one-day, student-run tournament at the{' '}
            <span className="font-semibold text-[var(--ucla-gold)]">#1 public university</span>. 
            Elite problems, electric campus energy, and the full work-hard, play-hard UCLA experience.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="px-10 py-4 rounded-full bg-[var(--ucla-gold)] text-black font-semibold tracking-wide hover:scale-105 hover:shadow-[0_0_40px_rgba(255,209,0,0.4)] transition-all duration-300"
            >
              Join the waitlist
            </Link>
            <a
              href="#about"
              className="px-10 py-4 rounded-full border border-white/20 text-[var(--text)] font-medium hover:bg-white/5 transition-colors duration-300"
            >
              Explore the rounds
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT / ROUNDS ---------------------------------------------------- */}
      <section id="about" className="py-28 px-6 border-t border-white/10 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-120px' }}
            variants={fadeUp}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Built by UCLA students.
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-sm md:text-base">
              LAMT is written, organized, and staffed by UCLA undergraduates who grew up on math contests. 
              It is our version of a perfect Saturday: proofs, problems, and a campus that never sleeps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Academic',
                body: 'Problems inspired by AMC, AIME, and top collegiate tournaments, with original twists and rigorous solutions.',
              },
              {
                title: 'Competitive',
                body: 'Individual and team rounds, live-scored guts, and an Integration Bee that keeps everyone in the room.',
              },
              {
                title: 'Westwood',
                body: "A full day on UCLA's campus—towering lecture halls, views over Los Angeles, and a community that takes ideas seriously.",
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                className="p-7 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <h3 className="text-sm font-semibold text-[var(--ucla-gold)] tracking-[0.22em] uppercase mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-[var(--text)]">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE ---------------------------------------------------------- */}
      <section id="schedule" className="py-28 px-6 border-t border-white/10 bg-[var(--bg-elevated)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-10 text-center"
          >
            One day in Westwood.
          </motion.h2>

          <div className="space-y-2">
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-white/[0.04] hover:border-[var(--ucla-gold)]/40 transition-colors"
              >
                <span className="w-28 text-xs font-mono tracking-[0.25em] uppercase text-[var(--ucla-gold)]">
                  {row.time}
                </span>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-[var(--text)]">
                    {row.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
                    {row.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-center text-[var(--text-muted)]">
            Schedule is tentative and subject to minor adjustment. Final timings will be shared with registered teams.
          </p>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section id="faq" className="py-28 px-6 border-t border-white/10 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-12 text-center"
          >
            Questions, answered.
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const open = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="border-b border-white/10 last:border-0"
                >
                  <button
                    className="w-full py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenFaq(open ? null : item.q)}
                  >
                    <span className="text-sm md:text-base font-medium text-[var(--text)]">
                      {item.q}
                    </span>
                    <span className="text-[var(--text-muted)] text-xl font-light ml-4">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
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

      {/* REGISTER / CONTACT ------------------------------------------------ */}
      <section
        id="register"
        className="py-32 px-6 border-t border-white/10 relative overflow-hidden bg-[var(--bg)]"
      >
        <div className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 w-[780px] h-[380px] bg-[var(--ucla-gold)] opacity-[0.08] blur-[140px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Ready for UCLA?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-sm md:text-base text-[var(--text-muted)] max-w-xl mx-auto mb-10"
          >
            LAMT 2026 takes place on May 17, 2026. Registration is not yet open, but the waitlist
            gives your team priority access when it is.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-12 py-4 rounded-full bg-[var(--ucla-gold)] text-black font-semibold tracking-wide hover:scale-105 hover:shadow-[0_0_50px_rgba(255,209,0,0.45)] transition-all duration-300 text-sm md:text-base"
            >
              Open waitlist / interest form →
            </Link>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-7 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <h3 className="text-[11px] font-semibold text-[var(--ucla-gold)] tracking-[0.25em] uppercase mb-2">
                Email
              </h3>
              <a
                href="mailto:uclamathtournament@gmail.com"
                className="text-sm text-[var(--text)] hover:text-[var(--ucla-gold)] transition-colors break-words"
              >
                uclamathtournament<br />@gmail.com
              </a>
            </div>
            <div className="p-7 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <h3 className="text-[11px] font-semibold text-[var(--ucla-gold)] tracking-[0.25em] uppercase mb-2">
                Instagram
              </h3>
              <a
                href="https://www.instagram.com/lamathtournament/"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--text)] hover:text-[var(--ucla-gold)] transition-colors"
              >
                @lamathtournament
              </a>
            </div>
            <div className="p-7 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
              <h3 className="text-[11px] font-semibold text-[var(--ucla-gold)] tracking-[0.25em] uppercase mb-2">
                Facebook
              </h3>
              <a
                href="https://www.facebook.com/groups/1429462591976204/"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--text)] hover:text-[var(--ucla-gold)] transition-colors"
              >
                LAMT Community Group
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
