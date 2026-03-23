'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import MathDeco from './components/MathDeco';

const daySchedule = [
  {
    time: '8:00 AM',
    title: 'Check-in',
    subtitle: 'Arrive and check in your team.',
  },
  {
    time: '8:45 AM',
    title: 'Registration & Opening Ceremony',
    subtitle: 'Finish check-in; opening remarks.',
  },
  {
    time: '9:15 AM',
    title: 'Special Team Round',
    subtitle: '75 minutes total. Details TBA.',
  },
  {
    time: '10:45 AM',
    title: 'Algebra',
    subtitle: '50 minutes · 10 questions.',
  },
  {
    time: '12:00 PM',
    title: 'Geometry',
    subtitle: '50 minutes · 10 questions.',
  },
  {
    time: '1:00 PM',
    title: 'Lunch & Disputes',
    subtitle: 'Lunch break and dispute window.',
  },
  {
    time: '2:00 PM',
    title: 'Combinatorics',
    subtitle: '50 minutes · 10 questions.',
  },
  {
    time: '3:15 PM',
    title: 'Guts Round',
    subtitle: '60–75 minutes · number of rounds TBD.',
  },
  {
    time: '4:30 PM',
    title: 'Integration Bee / Prof. Talk / Tiebreaks',
    subtitle: 'Integration Bee, guest lecture, tiebreakers, and final disputes.',
  },
  {
    time: '6:00 PM',
    title: 'Awards Ceremony',
    subtitle: 'Recognition and prize distribution.',
  },
];

const rounds = [
  {
    title: 'Special Round!!!',
    detail: 'A mystery round — details coming soon! 75 minutes total.',
  },
  {
    title: 'Algebra',
    detail: '50 min, 10 questions — individual round.',
  },
  {
    title: 'Geometry',
    detail: '50 min, 10 questions — individual round.',
  },
  {
    title: 'Combinatorics',
    detail: '50 min, 10 questions — individual round.',
  },
  {
    title: 'Guts Round',
    detail: '60–75 min live-scored team round, number of sets TBD.',
  },
  {
    title: 'Integration Bee',
    detail: 'Speed-based integration competition (post-rounds event).',
  },
];

const faqs = [
  {
    q: 'Who can participate?',
    a: 'Only students in grades 6–12 during the 2025–2026 academic school year are eligible to participate in LAMT.',
  },
  {
    q: 'Can 6th graders participate?',
    a: 'Yes! 6th grade is totally fine. LAMT is geared toward high schoolers, but younger students who are up for the challenge are absolutely welcome. No special registration process — just sign up like everyone else. However, note that poor behavior, which is more common amongst the youngest, will result in immediate disqualification.',
  },
  {
    q: 'How many students per team?',
    a: 'Up to 6 students per team. A school may register multiple teams.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Registration fee information will be announced soon. Check back for updates.',
  },
  {
    q: 'What topics are covered?',
    a: 'Algebra, Geometry, Number Theory, Combinatorics, and more — following AMC/AIME style.',
  },
  {
    q: 'Where is the tournament held?',
    a: 'Los Angeles, CA. Exact venue TBA. Will be announced via email to registered teams.',
  },
  {
    q: 'Can individuals participate without a team?',
    a: 'Yes, individual registration may be available. But you should probably stop being lonely for this one. Details coming soon.',
  },
  {
    q: 'How do I get updates?',
    a: 'Join our Discord server (link shared after registration) and watch for emails to your coach.',
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
<main className="relative bg-gradient-to-br from-[#E6F3FF] via-[#CDE5FF] to-[#006994] text-slate-900">
  {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-14 text-white"
      >
        {/* Equation backdrop via MathDeco */}
        <MathDeco
          latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)"
          className="hidden md:block absolute bottom-1/3 right-[5%] text-[1.8rem]"
        />
        <MathDeco
          latex="\\displaystyle \\sum_{n\\geq0} p(n)x^n = \\prod_{k\\geq1}\\frac{1}{1-x^k}"
          className="hidden md:block absolute top-8 right-[8%] text-[2.4rem]"
        />
        <MathDeco
          latex="\\displaystyle f\\left( \\frac{\\sum x_i}{n} \\right) \\leq \\frac{\\sum f(x_i)}{n}"
          className="hidden md:block absolute bottom-1/3 left-[6%] text-[2.5rem]"
        />
        <MathDeco
          latex="\\displaystyle d^2 = -a^2\\Delta y \\Delta z - b^2\\Delta x \\Delta z - c^2\\Delta x \\Delta y"
          className="hidden md:block absolute top-1/3 left-[2%] text-[1.8rem]"
        />
        <MathDeco
          latex="\\displaystyle \\phi(n) = \\sum_{d \\mid n} \\mu(d) \\frac{n}{d}"
          className="hidden md:block absolute top-1/3 right-[10%] text-[2.0rem]"
        />
        <MathDeco
          latex="\\displaystyle x^n - 1 = \\prod_{d|n} \\Phi_d(x)"
          className="absolute top-10 left-[15%] text-[2.0em]"
        />
        <MathDeco
          latex="\\displaystyle E\\left[\\sum X_i\\right] = \\sum E[X_i]"
          className="hidden md:block absolute bottom-1/3 left-[4%] text-[2.0em]"
        />
        <MathDeco
          latex="\\displaystyle |X/G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^g|"
          className="hidden md:block absolute bottom-1/3 right-[8%] text-[1.8rem]"
        />

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 max-w-5xl mx-auto text-center mt-10 md:mt-0"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block uppercase tracking-[0.4em] text-[#FFB300] text-[10px] font-bold mb-6"
          >
            UCLA STUDENT-RUN TOURNAMENT · MAY 17, 2026
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-7 gold-text"
            style={{ textShadow: '0 0 50px rgba(255,179,0,0.45)' }}
          >
            LOS ANGELES
            <br />
            MATH TOURNAMENT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="max-w-xl mx-auto text-lg text-slate-200/85 mb-10 font-medium"
          >
            &quot;Have you ever done math with your life on the line?&quot; <br />
            Experience rigorous, high-stakes mathematics at UCLA on{' '}
            <span className="text-[#FFB300] font-semibold">May 17, 2026</span>.
            Individual, team, relay, and guts rounds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, mass: 0.4 }}
            >
              <Link
                href="https://forms.gle/8JUBJaQQv4fmL8th6"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFB300] text-[#003B5C] font-semibold text-sm shadow-[0_0_25px_rgba(255,179,0,0.6)]"
              >
                Join Waitlist
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            >
              <a
                href="#about"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/20 text-sm font-semibold text-slate-100 hover:bg-white/5"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* DAY-OF SCHEDULE */}
      <section
        id="schedule"
        className="relative border-t border-white/10 bg-[#020816]/50 backdrop-blur-xl px-6 pb-20 pt-12"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-2 text-center gold-text"
          >
            Day-of Schedule
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.02, duration: 0.4 }}
            className="text-center text-slate-300 text-sm mb-10"
          >
            May 17, 2026 — subject to minor adjustments. Final schedule distributed day-of.
          </motion.p>

          <div className="glass-card overflow-hidden">
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.04,
                  type: 'spring',
                  stiffness: 300,
                  damping: 24,
                }}
                whileHover={{
                  backgroundColor: 'rgba(255,179,0,0.06)',
                  x: 4,
                  boxShadow: '0 0 24px rgba(255,179,0,0.25)',
                }}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 border-b border-white/7 last:border-0"
              >
                <span className="w-32 text-xs font-mono text-slate-300">
                  {row.time}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-50">
                    {row.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {row.subtitle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-center text-slate-400">
            *Schedule is tentative and subject to change.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-t border-white/10 px-6 py-16 bg-[#020816]/60"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gold-text text-center">
            About LAMT
          </h2>
          <p className="text-center text-slate-200 mb-10">
            Los Angeles Math Tournament (LAMT) 2026 is a student-led math
            competition organized by UCLA math students, held on May 17, 2026 at UCLA.
          </p>

          <div className="space-y-6 text-slate-200 text-sm leading-relaxed">
            <p>
              LAMT is open to students in grades 6–12 during the 2025–2026
              academic school year. We deliver creative problem-solving across
              algebra, geometry, number theory, combinatorics, and team challenges.
            </p>
            <p>
              <span className="font-semibold">Our Mission:</span> Challenge
              students beyond textbooks with engaging rounds that build math
              passion and community in Los Angeles. LAMT is fully student-run,
              inspired by peer tournaments like HMMT and BMT.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Competition Rounds
            </h3>
            <div className="space-y-4">
              {rounds.map((round) => (
                <div
                  key={round.title}
                  className="border-l-4 border-[#2774AE] pl-4 py-1"
                >
                  <p className="font-semibold text-slate-100">{round.title}</p>
                  <p className="text-slate-300 text-sm mt-0.5">
                    {round.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-300 mb-4">Ready to compete?</p>
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="inline-block bg-[#FFB300] text-[#003B5C] font-bold px-8 py-3 rounded-full hover:bg-[#FFD54F] transition shadow-[0_0_24px_rgba(255,179,0,0.6)] text-sm"
            >
              Join the Waitlist →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-white/10 px-6 py-16 bg-[#020816]/70"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gold-text text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => {
              const open = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card px-5 py-4"
                >
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() =>
                      setOpenFaq((prev) => (prev === item.q ? null : item.q))
                    }
                  >
                    <span className="font-semibold text-slate-50 text-sm">
                      {item.q}
                    </span>
                    <span className="text-slate-400 text-xs ml-4">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-300 text-xs mt-3 leading-relaxed">
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

      {/* CONTACT */}
      <section
        id="contact"
        className="border-t border-white/10 px-6 py-16 bg-[#020816]/80"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gold-text text-center">
            Contact Us
          </h2>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[#FFB300] mb-2">
                General Inquiries
              </h3>
              <p className="text-slate-200 text-sm">
                Email us at{' '}
                <a
                  href="mailto:uclamathtournament@gmail.com"
                  className="text-[#FFB300] underline"
                >
                  uclamathtournament@gmail.com
                </a>
                .
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[#FFB300] mb-2">
                Registration Support
              </h3>
              <p className="text-slate-200 text-sm">
                For registration issues, email us with subject line
                &nbsp;&quot;LAMT Registration Help&quot; so we can respond faster.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[#FFB300] mb-4">
                Stay Connected
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <a
                    href="https://www.facebook.com/groups/1429462591976204/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB300] underline font-medium"
                  >
                    Facebook Group
                  </a>
                  <span className="text-slate-300">
                    {' '}
                    — Join our community group for updates.
                  </span>
                </div>
                <div>
                  <a
                    href="https://www.instagram.com/lamathtournament/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFB300] underline font-medium"
                  >
                    Instagram @lamathtournament
                  </a>
                  <span className="text-slate-300">
                    {' '}
                    — Follow us for announcements and highlights.
                  </span>
                </div>
                <div>
                  <a
                    href="mailto:uclamathtournament@gmail.com"
                    className="text-[#FFB300] underline font-medium"
                  >
                    uclamathtournament@gmail.com
                  </a>
                  <span className="text-slate-300">
                    {' '}
                    — Please reach us directly by email.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER / WAITLIST */}
      <section
        id="register"
        className="border-t border-white/10 px-6 py-16 bg-[#020816]/90"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gold-text">
            Interest / Waitlist Form
          </h2>
          <p className="text-slate-200 mb-2 text-sm">
            LAMT 2026 — May 17th, 2026. Registration is not yet open.
          </p>
          <p className="text-slate-200 mb-2 text-sm">
            Fill out the form below to join the waitlist and be notified when
            registration opens.
          </p>
          <p className="text-slate-400 mb-8 text-xs">
            Cost: TBD · Up to 6 members per team · High school level (all
            students welcome)
          </p>
          <a
            href="https://forms.gle/8JUBJaQQv4fmL8th6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#FFB300] text-[#003B5C] font-bold px-10 py-4 rounded-full hover:bg-[#FFD54F] transition-all shadow-[0_0_24px_rgba(255,179,0,0.7)] text-sm"
          >
            Open Waitlist / Interest Form →
          </a>
        </div>
      </section>
    </main>
  );
}
