'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import MathDeco from './components/MathDeco';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <main className="relative bg-gradient-to-br from-[#006994] to-[#0A192F] text-white">
      {/* HERO */}
<section
  ref={heroRef}
  className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-14"
>
        {/* Equations backdrop */}
  {/*<div className="absolute inset-0 opacity-[1.0] pointer-events-none">
          <div className="math-bg top-[18%] right-[10%] text-4xl">
            v_p(x^n - y^n) = v_p(x-y) + v_p(n)
          </div>
          <div className="math-bg top-[40%] left-[5%] text-5xl">
            ∑ p(n)xⁿ = ∏ (1 - xᵏ)⁻¹
          </div>
          <div className="math-bg bottom-[30%] right-[15%] text-4xl">
            φ(n) = ∑ μ(d) n/d
          </div>
          <div className="math-bg bottom-[15%] left-[12%] text-3xl">
            xⁿ − 1 = ∏ Φ_d(x)
            {</div>
        </div>*/}
  {//<MathDeco latex="\displaystyle \sum |a_i b_i| \leq \left( \sum |a_i|^p \right)^{1/p} \left( \sum |b_i|^q \right)^{1/q}" className="hidden md:block absolute top-8 text-[2.4rem]" />
  }
        <MathDeco latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)" className="hidden md:block absolute bottom-1/3 right-[5%] text-[1.8rem]" />
  <MathDeco latex="\displaystyle \sum_{n\geq0} p(n)x^n = \prod_{k\geq1}\frac{1}{1-x^k}" className="hidden md:block absolute top-8 right-[8%] text-[2.4rem]" />
  
        <MathDeco latex="\displaystyle f\left( \frac{\sum x_i}{n} \right) \leq \frac{\sum f(x_i)}{n}" className="hidden md:block absolute bottom-13 left-[6%] text-[2.5rem]" />
  <MathDeco latex="\displaystyle d^2 = -a^2\Delta y \Delta z - b^2\Delta x \Delta z - c^2\Delta x \Delta y" className="hidden md:block absolute top-1/3 left-[2%] text-[1.8rem]" />
  <MathDeco latex="\displaystyle \phi(n) = \sum_{d \mid n} \mu(d) \frac{n}{d}" className="hidden md:block absolute top-1/3 right-[10%] text-[2.0rem]" />
  
  <MathDeco latex="\displaystyle x^n - 1 = \prod_{d|n} \Phi_d(x)" className="absolute top-10 left-[15%] text-[2.0em]" />

        <MathDeco latex="\displaystyle E\left[\sum X_i\right] = \sum E[X_i]" className="hidden md:block absolute bottom-1/3 left-[4%] text-[2.0em]" />
        <MathDeco latex="\displaystyle |X/G| = \frac{1}{|G|} \sum_{g \in G} |X^g|" className="bottom-13 right-[8%] text-[1.8rem]" />

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
            "Have you ever done math with your life on the line?" <br />
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
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/20 text-sm font-semibold text-slate-100 hover:bg-white/5"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
