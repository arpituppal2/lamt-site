'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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

// --- PAGE ------------------------------------------------------------------
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden">
      
      {/* HERO SECTION ------------------------------------------------------- */}
      {/* 
        Background Logic: 
        Light mode uses a strict rich gradient from #003B5C to #006994. 
        Dark mode forces solid black via from-black to-black.
      */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 bg-gradient-to-br from-[#003B5C] to-[#006994] dark:from-black dark:to-black transition-colors duration-500">
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          {/* Light Mode: subtle top glow. Dark Mode: intense teal/blue top glow */}
          <div className="absolute -top-40 left-[-10%] w-[460px] h-[460px] bg-[#006994] opacity-[0.2] dark:opacity-[0.45] blur-[120px] rounded-full mix-blend-screen transition-opacity duration-500" />
          {/* Gold Bottom Glow */}
          <div className="absolute bottom-[-35%] right-[-15%] w-[520px] h-[520px] bg-[#FFD100] opacity-[0.15] dark:opacity-[0.25] blur-[140px] dark:blur-[170px] rounded-full mix-blend-screen transition-opacity duration-500" />
        </div>

        {/* Dynamic Math Halo */}
        <div className="absolute inset-0 -z-10 pointer-events-auto">
          <motion.div 
            className="hidden md:block absolute top-[18%] left-[8%] cursor-pointer"
            animate={{ y: [0, -20, 0] }} 
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
          >
            <MathDeco
              latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)"
              className="text-[1.8rem] text-white/60 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] dark:hover:drop-shadow-[0_0_35px_rgba(0,105,148,0.9)]"
            />
          </motion.div>

          <motion.div 
            className="hidden lg:block absolute top-[10%] right-[10%] cursor-pointer"
            animate={{ y: [0, 24, 0] }} 
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
          >
            <MathDeco
              latex="\\displaystyle \\sum_{n\\geq0} p(n)x^n = \\prod_{k\\geq1}\\frac{1}{1-x^k}"
              className="text-[2.3rem] text-[#FFD100]/80 dark:text-[#FFD100] drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,209,0,0.4)] transition-all duration-300 hover:text-[#FFD100] hover:drop-shadow-[0_0_25px_rgba(255,209,0,0.8)] dark:hover:drop-shadow-[0_0_40px_rgba(255,209,0,1)]"
            />
          </motion.div>

          <motion.div 
            className="hidden lg:block absolute bottom-[14%] left-[14%] cursor-pointer"
            animate={{ y: [0, -16, 0] }} 
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
          >
            <MathDeco
              latex="\\displaystyle f\\left( \\frac{\\sum x_i}{n} \\right) \\leq \\frac{\\sum f(x_i)}{n}"
              className="text-[2rem] text-white/50 dark:text-slate-300 drop-shadow-none dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:text-white dark:hover:text-white hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] dark:hover:drop-shadow-[0_0_30px_rgba(0,105,148,0.8)]"
            />
          </motion.div>

          <motion.div 
            className="hidden md:block absolute top-[34%] left-[3%] cursor-pointer"
            animate={{ y: [0, 18, 0] }} 
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
          >
            <MathDeco
              latex="\\displaystyle d^2 = -a^2\\Delta y \\Delta z - b^2\\Delta x \\Delta z - c^2\\Delta x \\Delta y"
              className="text-[1.7rem] text-white/40 dark:text-slate-400 drop-shadow-none dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:text-white dark:hover:text-white hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] dark:hover:drop-shadow-[0_0_30px_rgba(0,105,148,0.8)]"
            />
          </motion.div>

          <motion.div 
            className="hidden md:block absolute top-[32%] right-[12%] cursor-pointer"
            animate={{ y: [0, -14, 0] }} 
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
          >
            <MathDeco
              latex="\\displaystyle \\phi(n) = \\sum_{d \\mid n} \\mu(d) \\frac{n}{d}"
              className="text-[1.9rem] text-[#FFD100]/70 dark:text-[#FFD100]/90 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,209,0,0.3)] transition-all duration-300 hover:text-[#FFD100] hover:drop-shadow-[0_0_25px_rgba(255,209,0,0.8)] dark:hover:drop-shadow-[0_0_35px_rgba(255,209,0,0.9)]"
            />
          </motion.div>

          <motion.div 
            className="absolute top-[12%] left-[18%] cursor-pointer"
            animate={{ y: [0, 18, 0] }} 
            transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
          >
            <MathDeco
              latex="\\displaystyle x^n - 1 = \\prod_{d|n} \\Phi_d(x)"
              className="text-[2rem] text-white/60 dark:text-white/80 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] dark:hover:drop-shadow-[0_0_35px_rgba(0,105,148,0.9)]"
            />
          </motion.div>
        </div>
        
        {/* Hero content */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-block py-1 px-4 rounded-full border border-white/20 dark:border-white/15 bg-white/10 dark:bg-black/40 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#FFD100] dark:text-slate-100 backdrop-blur-md shadow-sm dark:shadow-none">
              UCLA · Los Angeles Math Tournament · May 17, 2026
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
            "Have you ever done math with your life on the line?"<br/>
            Experience rigorous, high-stakes mathematics at UCLA.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="px-10 py-4 rounded-full bg-[#FFD100] text-[#003B5C] dark:text-black font-bold tracking-wide hover:scale-105 shadow-[0_0_30px_rgba(255,209,0,0.4)] dark:shadow-[0_0_40px_rgba(255,209,0,0.4)] transition-all duration-300"
            >
              Join the waitlist
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

      {/* ABOUT / ROUNDS ---------------------------------------------------- */}
      <section id="about" className="py-28 px-6 bg-[#FAFAFA] dark:bg-black transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-[#003B5C] dark:text-white">Built by UCLA students.</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              LAMT is written, organized, and staffed by UCLA undergraduates who grew up on math contests. 
              It is our version of a perfect Saturday: proofs, problems, and a campus that never sleeps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Academic', desc: 'Problems inspired by AMC, AIME, and top collegiate tournaments, with original twists and rigorous solutions.' },
              { title: 'Competitive', desc: 'Individual and team rounds, live-scored guts, and an Integration Bee that keeps everyone in the room.' },
              { title: 'Westwood', desc: 'A full day on UCLA’s campus—towering lecture halls, views over Los Angeles, and a community that takes ideas seriously.' }
            ].map((box, i) => (
              <motion.div
                key={box.title}
                className="p-7 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#006994]/40 dark:hover:border-[#FFD100]/30 transition-colors shadow-sm dark:shadow-none"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <h3 className="text-sm font-bold text-[#006994] dark:text-[#FFD100] tracking-[0.22em] uppercase mb-3">{box.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{box.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE ---------------------------------------------------------- */}
      <section id="schedule" className="py-28 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-10 text-center text-[#003B5C] dark:text-white">
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
            Questions, answered.
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

      {/* REGISTER / CONTACT ------------------------------------------------ */}
      <section id="register" className="py-32 px-6 border-t border-slate-200 dark:border-white/10 relative overflow-hidden bg-[#FAFAFA] dark:bg-[#020617] transition-colors duration-500">
        <div className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 w-[780px] h-[380px] bg-[#006994] dark:bg-[#FFD100] opacity-[0.1] dark:opacity-[0.08] blur-[140px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-[#003B5C] dark:text-white">
            Ready for UCLA?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-sm md:text-base text-slate-600 dark:text-[#D1D5DB] max-w-xl mx-auto mb-10">
            LAMT 2026 takes place on May 17, 2026. Registration is not yet open, but the waitlist gives your team priority access when it is.
          </motion.p>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-12 py-4 rounded-full bg-[#FFD100] text-[#003B5C] dark:text-black font-bold tracking-wide hover:scale-105 shadow-[0_8px_30px_rgba(255,209,0,0.3)] dark:shadow-[0_0_50px_rgba(255,209,0,0.45)] transition-all duration-300 text-sm md:text-base"
            >
              Open waitlist / interest form →
            </Link>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Email', val: 'uclamathtournament\n@gmail.com', link: 'mailto:uclamathtournament@gmail.com' },
              { title: 'Instagram', val: '@lamathtournament', link: 'https://www.instagram.com/lamathtournament/' },
              { title: 'Facebook', val: 'LAMT Community Group', link: 'https://www.facebook.com/groups/1429462591976204/' }
            ].map(contact => (
              <div key={contact.title} className="p-7 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <h3 className="text-[11px] font-bold text-[#006994] dark:text-[#FFD100] tracking-[0.25em] uppercase mb-2">{contact.title}</h3>
                <a href={contact.link} target="_blank" rel="noreferrer" className="text-sm text-slate-800 dark:text-white hover:text-[#006994] dark:hover:text-[#FFD100] transition-colors break-words whitespace-pre-line">
                  {contact.val}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
