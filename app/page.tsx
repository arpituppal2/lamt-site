'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import MathDeco from './components/MathDeco';

// --- DATA ------------------------------------------------------------

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

// --- ANIMATION VARIANTS ----------------------------------------------

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

// --- THEME TOGGLE ----------------------------------------------------

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
      className="fixed top-4 right-4 z-50"
    >
      <motion.div
        className="w-12 h-7 rounded-full flex items-center px-1 backdrop-blur-md border"
        animate={{
          backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.12)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
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
          <span className="text-[10px] font-bold text-black">
            {isDark ? '☾' : '☼'}
          </span>
        </motion.div>
      </motion.div>
    </button>
  );
}

// --- PAGE ------------------------------------------------------------

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <ThemeToggle />

      {/* Centered column for entire page */}
      <div className="max-w-6xl mx-auto px-6">

        {/* HERO ---------------------------------------------------------- */}
        <section className="relative overflow-hidden pt-28 pb-24">
          {/* Blue gradient background like original mock */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--ucla-blue)_0%,#020617_55%,#020617_100%)]" />

          {/* Equations as subtle background rows */}
          <div className="absolute inset-x-0 top-16 pointer-events-none select-none opacity-35 text-slate-200/80">
            <div className="flex flex-wrap justify-center gap-16">
              <MathDeco
                latex="\\displaystyle d^2 = -a^2\\Delta y \\Delta z - b^2\\Delta x \\Delta z - c^2\\Delta x \\Delta y"
                className="hidden lg:block text-xl"
              />
              <MathDeco
                latex="\\displaystyle \\phi(n) = \\sum_{d \\mid n} \\mu(d) \\frac{n}{d}"
                className="hidden md:block text-xl"
              />
            </div>
            <div className="mt-14 flex flex-wrap justify-center gap-16">
              <MathDeco
                latex="\\displaystyle E\\left[\\sum X_i\\right] = \\sum E[X_i]"
                className="hidden md:block text-2xl"
              />
              <MathDeco
                latex="\\displaystyle |X/G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^g|"
                className="hidden lg:block text-2xl"
              />
            </div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 text-center"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-block py-1 px-4 rounded-full border border-white/25 bg-black/30 text-[10px] font-semibold tracking-[0.35em] uppercase">
                UCLA Student-Run Tournament · May 17, 2026
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight mb-6"
            >
              LOS ANGELES
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--ucla-gold)] via-[#FFEBA0] to-[var(--ucla-gold)]">
                MATH TOURNAMENT
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl mx-auto text-sm md:text-base text-[var(--text-muted)] mb-10"
            >
              &quot;Have you ever done math with your life on the line?&quot; Experience rigorous, 
              high-stakes mathematics at UCLA on{' '}
              <span className="font-semibold text-[var(--ucla-gold)]">May 17, 2026</span>. 
              Individual, team, relay, and guts rounds.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="https://forms.gle/8JUBJaQQv4fmL8th6"
                className="px-9 py-3 rounded-full bg-[var(--ucla-gold)] text-[var(--ucla-darkest)] font-semibold text-sm shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform"
              >
                Join Waitlist
              </Link>
              <a
                href="#about"
                className="px-9 py-3 rounded-full border border-white/30 text-sm font-semibold text-[var(--text)] hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ABOUT --------------------------------------------------------- */}
        <section id="about" className="py-20 border-t border-white/10 bg-[var(--bg)]">
          {/* your existing About content, centered inside this column */}
          {/* ... */}
        </section>

        {/* SCHEDULE ------------------------------------------------------ */}
        <section id="schedule" className="py-20 border-t border-white/10 bg-[var(--bg-elevated)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            One day in Westwood.
          </h2>
          <div className="space-y-3">
            {daySchedule.map((row) => (
              <div
                key={row.time + row.title}
                className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              >
                <span className="w-28 text-xs font-mono tracking-[0.25em] uppercase text-[var(--ucla-gold)]">
                  {row.time}
                </span>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-[var(--text)]">
                    {row.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
                    {row.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-center text-[var(--text-muted)]">
            Schedule is tentative and subject to minor adjustment. Final timings will be shared with registered teams.
          </p>
        </section>

        {/* FAQ ----------------------------------------------------------- */}
        <section id="faq" className="py-20 border-t border-white/10 bg-[var(--bg)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Questions, answered.
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => {
              const open = openFaq === item.q;
              return (
                <div key={item.q} className="border-b border-white/15 last:border-0">
                  <button
                    className="w-full py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenFaq(open ? null : item.q)}
                  >
                    <span className="text-sm md:text-base font-medium">
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
                </div>
              );
            })}
          </div>
        </section>

        {/* REGISTER / CONTACT ------------------------------------------- */}
        <section
          id="register"
          className="py-24 border-t border-white/10 bg-[var(--bg)]"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Ready for UCLA?
          </h2>
          <p className="text-sm md:text-base text-[var(--text-muted)] max-w-xl mx-auto mb-8 text-center">
            LAMT 2026 takes place on May 17, 2026. Registration is not yet open, but the waitlist
            gives your team priority access when it is.
          </p>
          <div className="text-center mb-16">
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-12 py-4 rounded-full bg-[var(--ucla-gold)] text-[var(--ucla-darkest)] font-semibold tracking-wide text-sm md:text-base"
            >
              Open waitlist / interest form →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
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
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
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
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
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
        </section>
      </div>
    </div>
  );
}
