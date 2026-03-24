'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import MathDeco from './components/MathDeco';

// --- DATA ---
const daySchedule = [
  { time: '08:00 AM', title: 'Check-in', subtitle: 'Arrive and register your team.' },
  { time: '08:45 AM', title: 'Opening Ceremony', subtitle: 'Welcome address & briefing.' },
  { time: '09:15 AM', title: 'Special Team Round', subtitle: '75 minutes. A mystery challenge.' },
  { time: '10:45 AM', title: 'Algebra', subtitle: '50 minutes · 10 questions.' },
  { time: '12:00 PM', title: 'Geometry', subtitle: '50 minutes · 10 questions.' },
  { time: '01:00 PM', title: 'Intermission', subtitle: 'Lunch break and dispute window.' },
  { time: '02:00 PM', title: 'Combinatorics', subtitle: '50 minutes · 10 questions.' },
  { time: '03:15 PM', title: 'Guts Round', subtitle: '60–75 minutes · Live-scored chaos.' },
  { time: '04:30 PM', title: 'Integration Bee', subtitle: 'Guest lecture & tiebreakers.' },
  { time: '06:00 PM', title: 'Awards Ceremony', subtitle: 'Recognition & prize distribution.' },
];

const rounds = [
  { title: 'Special Round', detail: 'A mystery round — details coming soon. 75 minutes total.' },
  { title: 'Algebra', detail: '50 min, 10 questions — individual round.' },
  { title: 'Geometry', detail: '50 min, 10 questions — individual round.' },
  { title: 'Combinatorics', detail: '50 min, 10 questions — individual round.' },
  { title: 'Guts Round', detail: '60–75 min live-scored team round, number of sets TBD.' },
  { title: 'Integration Bee', detail: 'Speed-based integration competition.' },
];

const faqs = [
  { q: 'Who can participate?', a: 'Students in grades 6–12 during the 2025–2026 academic school year.' },
  { q: 'Can 6th graders participate?', a: 'Yes! While LAMT is geared toward high schoolers, younger students who are up for the challenge are absolutely welcome.' },
  { q: 'How many students per team?', a: 'Up to 6 students per team. A school may register multiple teams.' },
  { q: 'Is there a registration fee?', a: 'Registration fee information will be announced soon.' },
  { q: 'What topics are covered?', a: 'Algebra, Geometry, Number Theory, Combinatorics, following AMC/AIME rigor.' },
  { q: 'Where is the tournament held?', a: 'UCLA Campus, Los Angeles, CA. Exact venue TBA.' },
];

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="relative bg-black text-[#F5F5F7] overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
        {/* Deep background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.07] blur-[150px] rounded-full pointer-events-none" />

        {/* Floating Ethereal Math Equations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 md:opacity-30 mix-blend-screen">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <MathDeco latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)" className="absolute bottom-[20%] right-[10%] text-2xl text-[#86868B]" />
          </motion.div>
          <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <MathDeco latex="\displaystyle \sum_{n\geq0} p(n)x^n = \prod_{k\geq1}\frac{1}{1-x^k}" className="absolute top-[15%] right-[15%] text-3xl text-white/40" />
          </motion.div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <MathDeco latex="\displaystyle \phi(n) = \sum_{d \mid n} \mu(d) \frac{n}{d}" className="absolute top-[30%] left-[10%] text-2xl text-[#D4AF37]/50" />
          </motion.div>
        </div>

        <motion.div 
          className="relative z-10 max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-block py-1 px-3 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase backdrop-blur-md">
              UCLA Student-Run Tournament · May 17, 2026
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-[7.5rem] font-black leading-[0.9] tracking-tighter mb-8"
          >
            LOS ANGELES
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#86868B]">
              MATH TOURNAMENT
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="max-w-2xl mx-auto text-lg md:text-xl text-[#86868B] font-light mb-12 leading-relaxed"
          >
            &quot;Have you ever done math with your life on the line?&quot; <br />
            Experience rigorous, high-stakes mathematics at UCLA.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="px-10 py-4 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              Join the Waitlist
            </Link>
            <a
              href="#about"
              className="px-10 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors duration-300"
            >
              Discover LAMT
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* --- ABOUT & ROUNDS (Bento Box Layout) --- */}
      <section id="about" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The Arena</h2>
            <p className="text-[#86868B] max-w-2xl mx-auto">A proving ground for the finest mathematical minds in grades 6–12, featuring individual mastery and chaotic team challenges.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rounds.map((round, idx) => (
              <motion.div
                key={round.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-colors duration-500 group"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#D4AF37] transition-colors">{round.title}</h3>
                <p className="text-sm text-[#86868B] leading-relaxed">{round.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SCHEDULE --- */}
      <section id="schedule" className="py-32 px-6 border-t border-white/[0.05] relative bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center"
          >
            Itinerary
          </motion.h2>

          <div className="space-y-2">
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 p-6 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/[0.05]"
              >
                <span className="w-32 text-sm font-mono tracking-widest text-[#D4AF37]">
                  {row.time}
                </span>
                <div>
                  <h4 className="text-lg font-medium text-white">{row.title}</h4>
                  <p className="text-sm text-[#86868B] mt-1">{row.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-32 px-6 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center"
          >
            Intelligence
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === item.q;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-white/[0.08] last:border-0"
                >
                  <button
                    className="w-full py-6 flex items-center justify-between text-left group"
                    onClick={() => setOpenFaq(isOpen ? null : item.q)}
                  >
                    <span className="text-lg font-medium group-hover:text-[#D4AF37] transition-colors">
                      {item.q}
                    </span>
                    <span className="text-[#86868B] text-2xl font-light">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[#86868B] leading-relaxed">
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

      {/* --- CONTACT & CTA --- */}
      <section id="contact" className="py-32 px-6 border-t border-white/[0.05] relative overflow-hidden">
        {/* Subtle bottom glow */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-8"
          >
            Are You Ready?
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[#86868B] mb-12 text-lg"
          >
            Registration opens soon. Secure your team&apos;s place on the waitlist today.
          </motion.p>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Link
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="inline-block px-12 py-5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold tracking-wide hover:scale-105 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              Open Waitlist Form
            </Link>
          </motion.div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <h3 className="text-sm font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">Direct</h3>
              <a href="mailto:uclamathtournament@gmail.com" className="text-white hover:text-[#D4AF37] transition-colors">uclamathtournament<br/>@gmail.com</a>
            </div>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <h3 className="text-sm font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">Instagram</h3>
              <a href="https://www.instagram.com/lamathtournament/" target="_blank" rel="noreferrer" className="text-white hover:text-[#D4AF37] transition-colors">@lamathtournament</a>
            </div>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <h3 className="text-sm font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">Community</h3>
              <a href="https://www.facebook.com/groups/1429462591976204/" target="_blank" rel="noreferrer" className="text-white hover:text-[#D4AF37] transition-colors">Facebook Group</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
