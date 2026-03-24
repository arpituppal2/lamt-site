'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import MathDeco from './components/MathDeco';

const daySchedule = [
  { time: '8:00 AM',  title: 'Check-in',  subtitle: 'Arrive on campus and check in your team.' },
  { time: '8:45 AM',  title: 'Opening Ceremony', subtitle: 'Welcome, overview of the day, and rules briefing.' },
  { time: '9:15 AM',  title: 'Special Team Round', subtitle: '75 minutes · A surprise team challenge revealed day-of.' },
  { time: '10:45 AM', title: 'Algebra Round',   subtitle: '50 minutes · 10 questions · Individual.' },
  { time: '12:00 PM', title: 'Geometry Round',  subtitle: '50 minutes · 10 questions · Individual.' },
  { time: '1:00 PM',  title: 'Lunch & Disputes', subtitle: 'Lunch break on campus and official dispute window.' },
  { time: '2:00 PM',  title: 'Combinatorics Round', subtitle: '50 minutes · 10 questions · Individual.' },
  { time: '3:15 PM',  title: 'Guts Round', subtitle: '60–75 minutes · Live-scored team round.' },
  { time: '4:30 PM',  title: 'Integration Bee & Programming', subtitle: 'Integration Bee, guest talk, tiebreakers, final disputes.' },
  { time: '6:00 PM',  title: 'Awards Ceremony', subtitle: 'Team and individual awards, closing remarks.' },
];

const rounds = [
  {
    title: 'Special Team Round',
    detail: 'A 75-minute mystery round revealed the morning of LAMT. Collaborative, creative, and very UCLA.',
  },
  {
    title: 'Algebra',
    detail: '50 minutes, 10 questions. AMC/AIME-style algebra problems with an emphasis on clever ideas over routine computation.',
  },
  {
    title: 'Geometry',
    detail: '50 minutes, 10 questions. Euclidean geometry, configurations, and angle-chasing with clean, contest-style solutions.',
  },
  {
    title: 'Combinatorics',
    detail: '50 minutes, 10 questions. Counting, invariants, and combinatorial arguments that reward structured thinking.',
  },
  {
    title: 'Guts Round',
    detail: 'Fast-paced, live-scored team round. Problems released in sets, scored in real time — energy in the room is loud.',
  },
  {
    title: 'Integration Bee',
    detail: 'Post-round event. A live, bracket-style integration contest and time to hear from UCLA math students and faculty.',
  },
];

const faqs = [
  {
    q: 'Who can participate?',
    a: 'LAMT 2026 is open to students in grades 6–12 during the 2025–2026 academic year. Teams typically consist of high school students, but advanced younger students are welcome.',
  },
  {
    q: 'How many students per team?',
    a: 'Teams may have up to 6 students. Schools may register multiple teams. If you do not have a full team, we may help connect individuals where possible.',
  },
  {
    q: 'What level is the contest?',
    a: 'LAMT draws inspiration from contests like AMC, AIME, and HMMT. Some rounds are more accessible, while others push into proof-style or multi-step problem solving.',
  },
  {
    q: 'Where is the tournament held?',
    a: 'LAMT 2026 will be held on the UCLA campus in Los Angeles, California. Exact building and room assignments will be emailed to registered coaches and posted closer to the date.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Final registration fees are still being confirmed and will be announced to interested teams. We aim to keep LAMT accessible while covering materials, space, and prizes.',
  },
  {
    q: 'Can individuals participate without a team?',
    a: 'Yes. We expect to offer an option for individuals registering without a full team. Individuals may be grouped with other students or compete in an individual-only track.',
  },
  {
    q: 'How do I get updates?',
    a: 'Join the interest/waitlist form so we can email your coach or contact when registration opens, and follow our social media for additional announcements.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main className="relative bg-[#F5F5F7] text-[#003B5C]">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-16 bg-gradient-to-b from-[#F5F5F7] to-[#E5EFFA]">
        {/* Soft blue glow */}
        <div className="pointer-events-none absolute -z-10 w-[520px] h-[520px] bg-[#2774AE] opacity-[0.16] blur-[130px] rounded-full top-[-10%] right-[-10%]" />

        {/* Math background, very restrained */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\\displaystyle E\\left[\\sum X_i\\right] = \\sum E[X_i]"
              className="absolute bottom-[14%] left-[8%] text-[1.6rem] text-[#9CA3AF]"
            />
          </motion.div>
          <motion.div
            animate={{ y: [0, 22, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MathDeco
              latex="\\displaystyle \\sum_{n\\geq0} p(n)x^n = \\prod_{k\\geq1}\\frac{1}{1-x^k}"
              className="absolute top-[10%] right-[10%] text-[2.1rem] text-[#CBD5F5]"
            />
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block uppercase tracking-[0.3em] text-[#2774AE] text-[10px] font-semibold mb-5"
          >
            UCLA · STUDENT-RUN · MAY 17, 2026
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-[4.75rem] font-black leading-[1.02] tracking-tight mb-6 text-[#003B5C]"
          >
            Los Angeles
            <br />
            Math Tournament
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto text-base md:text-lg text-[#4B5563] mb-8"
          >
            Run by UCLA students for the next generation of problem solvers.
            <span className="block mt-2 text-[#111827] font-medium">
              “Have you ever done math with your life on the line?”
            </span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto text-xs md:text-sm text-[#6B7280] mb-10"
          >
            One day on the UCLA campus. Individual and team rounds, a live Guts round, an Integration Bee, and space to see what it feels like to do serious math where Bruins study every day.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <Link
                href="https://forms.gle/8JUBJaQQv4fmL8th6"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#2774AE] text-white font-semibold text-sm shadow-sm hover:bg-[#1E5E8B] transition-colors"
              >
                Join Waitlist
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <a
                href="#about"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#CBD5E1] text-sm font-semibold text-[#003B5C] hover:bg-white hover:border-white transition-colors"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-t border-[#E5E7EB] px-6 py-20 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#003B5C]">
              What is LAMT?
            </h2>
            <p className="text-sm md:text-base text-[#4B5563] max-w-2xl mx-auto">
              The Los Angeles Math Tournament (LAMT) is a one-day, student-run math competition hosted at UCLA. We bring together middle and high school students from across the region for serious problem solving and a day on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base text-[#374151]">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#003B5C]">
                Academic, but loud.
              </h3>
              <p>
                LAMT is written and organized by UCLA students who grew up doing contests like AMC, AIME, HMMT, and BMT. We care about clean problems, clear solutions, and creating rounds that feel challenging but fair.
              </p>
              <p>
                Some rounds are designed to be accessible and friendly to first-time competitors. Others are intentionally hard, for students who want to see what happens when you push your brain a little further.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#003B5C]">
                A day on campus.
              </h3>
              <p>
                Between rounds you will have time to eat, explore parts of campus, and talk with UCLA students about math, classes, and life as a Bruin.
              </p>
              <p>
                We want LAMT to feel like a snapshot of UCLA: work hard, have fun, and share the experience with the people around you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROUNDS */}
      <section
        id="rounds"
        className="border-t border-[#E5E7EB] px-6 py-20 bg-[#F9FAFB]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B5C]">
              Rounds & Format
            </h2>
            <p className="text-sm text-[#6B7280] max-w-md">
              A mix of individual and team rounds. Some are methodical, others are chaotic. All are designed by people who genuinely like writing contest problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rounds.map((round, idx) => (
              <motion.div
                key={round.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-shadow transition-colors"
              >
                <h3 className="text-lg font-semibold text-[#003B5C] mb-2">
                  {round.title}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  {round.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section
        id="schedule"
        className="border-t border-[#E5E7EB] px-6 py-20 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B5C] mb-2">
              Day-of Schedule
            </h2>
            <p className="text-sm text-[#6B7280]">
              May 17, 2026 · Subject to minor adjustments. Final schedule will be distributed to coaches closer to the event.
            </p>
          </div>

          <div className="space-y-2">
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: idx * 0.03, duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4 rounded-xl bg-[#F9FAFB] hover:bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors"
              >
                <span className="w-28 text-xs font-mono text-[#2774AE]">
                  {row.time}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#111827]">
                    {row.title}
                  </div>
                  <div className="text-[11px] text-[#4B5563] mt-0.5">
                    {row.subtitle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-center text-[#6B7280]">
            *Schedule and programming may adjust slightly based on registration numbers and room availability.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-[#E5E7EB] px-6 py-20 bg-[#F9FAFB]"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#003B5C] text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const open = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: idx * 0.04 }}
                  className="px-5 py-4 rounded-2xl bg-white border border-[#E5E7EB]"
                >
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() =>
                      setOpenFaq((prev) => (prev === item.q ? null : item.q))
                    }
                  >
                    <span className="font-semibold text-[#111827] text-sm md:text-base">
                      {item.q}
                    </span>
                    <span className="text-[#6B7280] text-xl ml-4">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#4B5563] text-xs md:text-sm mt-3 leading-relaxed">
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

      {/* REGISTER / WAITLIST */}
      <section
        id="register"
        className="border-t border-[#E5E7EB] px-6 py-20 bg-white"
      >
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-[#F9FAFB] border border-[#E5E7EB] px-8 py-10 text-center shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003B5C] mb-3">
              Interest & Waitlist Form
            </h2>
            <p className="text-sm text-[#4B5563] mb-2">
              LAMT 2026 · May 17, 2026 · UCLA Campus.
            </p>
            <p className="text-xs text-[#6B7280] mb-6">
              Registration is not yet open. Join the interest/waitlist form to receive details about fees, deadlines, and logistics as soon as they are finalized.
            </p>
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2774AE] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#1E5E8B] transition-colors text-sm"
            >
              Open Waitlist / Interest Form →
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="border-t border-[#E5E7EB] px-6 py-20 bg-[#F5F5F7]"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#003B5C] text-center">
            Contact & Updates
          </h2>

          <p className="text-sm text-[#4B5563] text-center max-w-2xl mx-auto mb-10">
            Questions about registration, logistics, or the contest itself? Reach out to the organizing team and follow our channels for updates and highlights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-xs font-semibold text-[#2774AE] tracking-[0.18em] uppercase mb-2">
                Email
              </h3>
              <p className="text-[#374151]">
                General questions:{' '}
                <a
                  href="mailto:uclamathtournament@gmail.com"
                  className="text-[#005587] underline"
                >
                  uclamathtournament@gmail.com
                </a>
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-xs font-semibold text-[#2774AE] tracking-[0.18em] uppercase mb-2">
                Instagram
              </h3>
              <p className="text-[#374151]">
                Follow{' '}
                <a
                  href="https://www.instagram.com/lamathtournament/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#005587] underline"
                >
                  @lamathtournament
                </a>{' '}
                for announcements and photos.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6">
              <h3 className="text-xs font-semibold text-[#2774AE] tracking-[0.18em] uppercase mb-2">
                Community
              </h3>
              <p className="text-[#374151]">
                Join our{' '}
                <a
                  href="https://www.facebook.com/groups/1429462591976204/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#005587] underline"
                >
                  Facebook group
                </a>{' '}
                for broader community updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
