'use client';

import './globals.css';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function EliteCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 150, fill: 'forwards' }
      );
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999]"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
}

function PremiumNavBar() {
  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#register', label: 'Register' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-[rgba(0,0,0,0.75)] backdrop-blur-xl border-b border-white/10"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[var(--ucla-blue)] flex items-center justify-center">
          <span className="text-[9px] font-black text-[var(--ucla-gold)] tracking-[0.3em]">
            LA
          </span>
        </div>
        <span className="text-xs md:text-sm font-semibold tracking-[0.32em] uppercase text-[var(--text)]">
          LAMT 2026
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--text-muted)]">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-[var(--text)] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased selection:bg-[var(--ucla-gold)] selection:text-[var(--ucla-darkest)]">
        <EliteCursor />
        <PremiumNavBar />

        <main className="min-h-screen pt-20">
          {children}
        </main>

        <footer className="border-t border-white/10 bg-[var(--bg-elevated)] text-[var(--text-muted)]">
          <div className="max-w-6xl mx-auto py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.24em] uppercase">
            <span>© 2026 Los Angeles Math Tournament</span>
            <div className="flex gap-6">
              <Link href="/#about" className="hover:text-[var(--ucla-gold)]">
                About
              </Link>
              <Link href="/#contact" className="hover:text-[var(--ucla-gold)]">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
