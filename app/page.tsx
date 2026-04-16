'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ─── COUNTDOWN ──────────────────────────────────────────────────────────────
function Countdown() {
  const target = new Date('2026-05-17T08:00:00-07:00').getTime();
  const [diff, setDiff] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0) return <span className="text-[#FFD100] text-base tracking-widest">Today</span>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-end justify-center gap-8 tabular-nums select-none">
      {[
        { val: String(d), label: 'days' },
        { val: pad(h),    label: 'hrs' },
        { val: pad(m),    label: 'min' },
        { val: pad(s),    label: 'sec' },
      ].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-light text-white leading-none tracking-tight">{val}</span>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8BB8E8]">{ label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SECTION HEADER ─────────────────────────────────────────────────────────
function SectionHead({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="mb-12 text-center">
      <p className={`text-[11px] font-bold tracking-[0.24em] uppercase mb-4 ${
        light ? 'text-[#8BB8E8]' : 'text-[#2774AE] dark:text-[#8BB8E8]'
      }`}>
        {eyebrow}
      </p>
      <div className="w-10 h-[3px] rounded-full bg-[#FFD100] mx-auto mb-5" />
      <h2
        className={`text-4xl md:text-5xl font-bold leading-tight ${
          light ? 'text-white' : 'text-[#003B5C] dark:text-[#DAEBFE]'
        }`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const daySchedule = [
  { time: '8:00 AM',  title: 'Check-in',               note: 'Arrive on campus and register your team.' },
  { time: '8:45 AM',  title: 'Opening Ceremony',        note: 'Welcome from the LAMT team.' },
  { time: '9:15 AM',  title: 'Special Team Round',      note: '75 min · collaborative, format revealed day-of.' },
  { time: '10:45 AM', title: 'Algebra & Number Theory', note: '50 min · 10 problems · individual.' },
  { time: '12:00 PM', title: 'Geometry',                note: '50 min · 10 problems · individual.' },
  { time: '1:00 PM',  title: 'Lunch & Disputes',        note: 'Dispute submission window.' },
  { time: '2:00 PM',  title: 'Combinatorics',           note: '50 min · 10 problems · individual.' },
  { time: '3:15 PM',  title: 'Guts Round',              note: '75 min · live-scored relay.' },
  { time: '4:30 PM',  title: 'Integration Bee & Talk',  note: 'Integration Bee + guest math talk.' },
  { time: '6:00 PM',  title: 'Awards Ceremony',         note: 'Team and individual awards.' },
];

const rounds = [
  {
    label:    'Special Team Round',
    duration: '75 min',
    detail:   'Collaborative format. Teams of up to 6. Format revealed on contest day.',
  },
  {
    label:    'Individual Rounds',
    duration: '3 × 50 min',
    detail:   'Algebra & Number Theory, Geometry, Combinatorics. Ten numerical-answer problems each.',
  },
  {
    label:    'Guts Round',
    duration: '75 min',
    detail:   'Live-scored relay with a running leaderboard.',
  },
];

const faqs: { q: string; a: React.ReactNode }[] = [
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
    a: 'Up to 6 students per team. Schools may register multiple teams. Grade levels can be mixed freely.',
  },
  {
    q: 'Can I sign up as an individual?',
    a: 'Yes. Individual registration is available; we will place you on a composite team.',
  },
    {
    q: 'Do you have a guide for how to register on ContestDojo?',
    a: 'Yes. You can access it <a href="  https://drive.google.com/file/d/1XvAfkTCIKJ5cmLnLh2kojqGqlcx27NaQ/view?usp=drive_link" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#003B5C] dark:hover:text-[#FFD100] transition-colors">here.</a>,{' '}
',
  },
  {
    q: 'How should I prepare? Are sample problems available?',
    a: (
      <span>
        We are not releasing sample problems from LAMT, but past papers from similar competitions are excellent preparation. We recommend:{' '}
        <a href="https://bmt.berkeley.edu" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#003B5C] dark:hover:text-[#FFD100] transition-colors">BMT (Berkeley)</a>,{' '}
        <a href="https://www.stanfordmathtournament.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#003B5C] dark:hover:text-[#FFD100] transition-colors">SMT (Stanford)</a>,{' '}
        <a href="https://jhmt.net" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[#003B5C] dark:hover:text-[#FFD100] transition-colors">JHMT (Johns Hopkins)</a>.
        HMMT is also a great resource for harder problems.
      </span>
    ),
  },
  {
    q: 'Do middle and high schoolers take the same exam?',
    a: 'Yes. All contestants receive the same problems. Middle schoolers are very welcome.',
  },
  {
    q: 'Are calculators allowed?',
    a: 'No. Calculators, phones, and all computational aids are strictly prohibited during testing rounds.',
  },
  {
    q: 'Does each team need a chaperone?',
    a: 'Yes. An adult chaperone must accompany students and remain on campus throughout the event.',
  },
  {
    q: 'Will lunch be provided?',
    a: 'We are finalizing catering logistics and will update registered teams once confirmed. Campus dining is available nearby.',
  },
];

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 md:px-16 bg-[#2774AE] dark:bg-[#003B5C] transition-colors duration-300 overflow-hidden">
        {/* Subtle dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2774AE] dark:from-[#003B5C] to-transparent" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-4xl w-full"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-[0.22em] uppercase text-[#DAEBFE] mb-6"
          >
            UCLA · May 17, 2026 · Los Angeles, California
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-white mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Los Angeles<br />
            <span style={{ color: '#FFD100' }}>Math Tournament</span>
          </motion.h1>

          {/* Gold rule centered */}
          <motion.div variants={fadeUp} className="w-12 h-[3px] rounded-full bg-[#FFD100] mx-auto mb-8" />

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg font-light text-[#DAEBFE] mb-10 max-w-lg mx-auto leading-relaxed"
          >
            A student-run competition for grades 6–12 covering algebra, geometry,
            combinatorics, and number theory.{' '}
            <strong className="font-semibold text-white">Free to attend.</strong>
          </motion.p>

          {/* Countdown */}
          <motion.div variants={fadeUp} className="mb-12">
            <Countdown />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={REGISTER_URL}
              target="_blank" rel="noreferrer"
              className="bg-[#FFD100] rounded-lg px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#003B5C] hover:bg-[#FFC72C] transition-colors duration-200 shadow-sm"
            >
              Register
            </Link>
            <a
              href="#about"
              className="text-sm font-medium text-[#DAEBFE] hover:text-white transition-colors duration-200"
            >
              Learn more ↓
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ ABOUT ════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-28 px-6 md:px-16 bg-white dark:bg-[#003B5C] border-b border-[#DAEBFE] dark:border-[#005587] transition-colors">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHead eyebrow="About" title="What is LAMT?" />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <motion.p variants={fadeUp} className="text-base md:text-lg text-[#005587] dark:text-[#8BB8E8] leading-relaxed">
                The Los Angeles Math Tournament is a student-run competition at UCLA, open to
                students in grades 6–12. Problems reward careful reasoning over rote technique,
                spanning algebra, geometry, combinatorics, and number theory.
              </motion.p>
              <motion.p variants={fadeUp} className="text-base md:text-lg text-[#005587] dark:text-[#8BB8E8] leading-relaxed">
                Organized entirely by UCLA students and free to attend. May 17, 2026 — a full
                day of competition, followed by an integration bee, a guest math talk, and an
                awards ceremony.
              </motion.p>
            </div>

            <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#2774AE] dark:text-[#8BB8E8] mb-8 text-center">
              Rounds &amp; Format
            </motion.p>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DAEBFE] dark:divide-[#005587]">
              {rounds.map((r) => (
                <motion.div key={r.label} variants={fadeUp} className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 text-center">
                  <div className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-[#2774AE] dark:text-[#8BB8E8] mb-3">{r.duration}</div>
                  <div className="text-base font-bold text-[#003B5C] dark:text-[#DAEBFE] mb-2">{r.label}</div>
                  <p className="text-sm text-[#005587] dark:text-[#8BB8E8] leading-relaxed">{r.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ SCHEDULE ═════════════════════════════════════════════════════════ */}
      <section id="schedule" className="py-28 px-6 md:px-16 bg-[#DAEBFE] dark:bg-[#002A45] border-b border-[#8BB8E8] dark:border-[#005587] transition-colors">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHead eyebrow="Schedule" title="Sunday, May 17" />
            </motion.div>
            <motion.p variants={fadeUp} className="text-sm text-[#2774AE] dark:text-[#8BB8E8] -mt-6 mb-10 text-center">All times approximate.</motion.p>
          </motion.div>
          <div>
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: idx * 0.025 }}
                className="grid grid-cols-[6rem_1fr] gap-6 py-5 border-b border-[#8BB8E8]/40 dark:border-[#005587] last:border-0"
              >
                <span className="text-[12px] font-mono font-bold uppercase tracking-[0.08em] text-[#2774AE] dark:text-[#8BB8E8] pt-0.5">
                  {row.time}
                </span>
                <div>
                  <span className="text-base font-bold text-[#003B5C] dark:text-[#DAEBFE]">{row.title}</span>
                  <span className="ml-3 text-sm text-[#005587] dark:text-[#8BB8E8]">{row.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-28 px-6 md:px-16 bg-white dark:bg-[#003B5C] border-b border-[#DAEBFE] dark:border-[#005587] transition-colors">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHead eyebrow="Questions" title="Frequently Asked" />
            </motion.div>
          </motion.div>
          <div>
            {faqs.map((item, idx) => {
              const open = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="border-b border-[#DAEBFE] dark:border-[#005587] last:border-0"
                >
                  <button
                    className="w-full py-5 flex items-start justify-between text-left gap-6"
                    onClick={() => setOpenFaq(open ? null : item.q)}
                  >
                    <span className="text-base font-semibold text-[#003B5C] dark:text-[#DAEBFE] leading-snug">{item.q}</span>
                    <span
                      className="flex-shrink-0 text-[#8BB8E8] mt-1 transition-transform duration-200"
                      style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M7 1v12M1 7h12"/>
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
                        <p className="pb-6 text-base text-[#005587] dark:text-[#8BB8E8] leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ LOCATION ═════════════════════════════════════════════════════════ */}
      <section id="location" className="py-28 px-6 md:px-16 bg-[#DAEBFE] dark:bg-[#002A45] border-b border-[#8BB8E8] dark:border-[#005587] transition-colors">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHead eyebrow="Location" title="UCLA Court of Sciences" />
            </motion.div>
            <motion.p variants={fadeUp} className="text-base text-[#005587] dark:text-[#8BB8E8] -mt-6 mb-10 text-center">
              Mathematical Sciences Building · 520 Portola Plaza · Los Angeles, CA 90095
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-xl border border-[#8BB8E8] dark:border-[#2774AE]"
            style={{ aspectRatio: '16/6' }}
          >
            <iframe
              title="UCLA Mathematical Sciences Building"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d826.0!2d-118.44273!3d34.06893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85cbbb5827%3A0x76b2f6b7e4b2ef8a!2sMathematical%20Sciences%20Building%2C%20Los%20Angeles%2C%20CA%2090095!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* ══ REGISTER ═════════════════════════════════════════════════════════ */}
      <section id="register" className="py-28 px-6 md:px-16 bg-[#2774AE] dark:bg-[#003B5C] transition-colors">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHead eyebrow="Register" title="Registration is open." light />
            </motion.div>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-[#DAEBFE] max-w-lg mx-auto -mt-4 mb-10 leading-relaxed text-center">
              LAMT 2026 takes place May 17 at UCLA. Registration is through ContestDojo
              and is <strong className="text-white font-bold">completely free</strong>.
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center">
              <Link
                href={REGISTER_URL}
                target="_blank" rel="noreferrer"
                className="inline-block bg-[#FFD100] rounded-lg px-10 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#003B5C] hover:bg-[#FFC72C] transition-colors duration-200"
              >
                Register on ContestDojo →
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mt-20 pt-12 border-t border-white/20"
          >
            <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#8BB8E8] mb-6 text-center">Contact</motion.p>
            <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
              {[
                { title: 'Email',     val: 'team@lamt.net',        href: 'mailto:team@lamt.net' },
                { title: 'Instagram', val: '@lamathtournament',     href: 'https://www.instagram.com/lamathtournament/' },
                { title: 'Facebook',  val: 'LAMT Community',       href: 'https://www.facebook.com/groups/1429462591976204/' },
                { title: 'LinkedIn',  val: 'LA Math Tournament',   href: 'https://www.linkedin.com/company/la-math-tournament/' },
              ].map((c) => (
                <motion.a
                  key={c.title}
                  variants={fadeUp}
                  href={c.href}
                  target="_blank" rel="noreferrer"
                  className="group flex flex-col gap-1.5 bg-[#2774AE] dark:bg-[#003B5C] px-6 py-5 hover:bg-[#005587] transition-colors duration-200"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8BB8E8]">{c.title}</span>
                  <span className="text-sm text-[#DAEBFE] group-hover:text-white transition-colors">{c.val}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
