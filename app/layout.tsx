'use client';

import './globals.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// An elegant, mix-blend-mode cursor. 
// It inverses the colors beneath it instead of being a cheap yellow dot.
function EliteCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Using animate for butter-smooth 60fps movement without React state lag
        cursorRef.current.animate(
          {
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
          },
          { duration: 150, fill: 'forwards' } // adds a subtle drag physics
        );
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
}

function PremiumNavBar() {
  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#contact',  label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-esque easing
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 apple-glass"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <span className="text-xl font-semibold tracking-widest text-white transition-opacity group-hover:opacity-70">
          LAMT <span className="text-gradient-gold">2026</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-[#86868B]">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-white transition-colors duration-300"
          >
            {label}
          </Link>
        ))}
        {/* A true call to action button */}
        <Link 
          href="/#register" 
          className="ml-4 px-5 py-2 rounded-full bg-white text-black hover:scale-105 transition-transform duration-300"
        >
          Register
        </Link>
      </div>
    </motion.nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-black">
      {/* Notice we removed the baby blue background and simplified the body */}
      <body className="bg-black text-[#F5F5F7] antialiased selection:bg-[#D4AF37] selection:text-black min-h-screen flex flex-col cursor-none">
        <EliteCursor />
        <PremiumNavBar />

        {/* The main content area with a subtle noise/glow background */}
        <main className="flex-grow relative pt-24">
          {/* Subtle atmospheric glow behind all content */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-[0.03] blur-[150px] pointer-events-none rounded-full" />
          {children}
        </main>

        <footer className="border-t border-white/[0.05] bg-black text-[#86868B]">
          <div className="max-w-7xl mx-auto py-12 px-8 flex flex-col md:flex-row items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase mb-4 md:mb-0">
              © 2026 Los Angeles Math Tournament
            </span>
            <div className="flex gap-6 text-[10px] tracking-widest uppercase">
              <Link href="/#about" className="hover:text-white transition-colors">About</Link>
              <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
