'use client';

import './globals.css';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Optional: keep the custom cursor, but don't force cursor: none in CSS
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
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#register', label: 'Register' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-[color-mix(in_srgb,var(--bg) 80%,#000 20%)]/90 backdrop-blur-xl border-b border-white/10"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <span className="text-xl font-semibold tracking-[0.32em] uppercase text-[var(--text)] transition-opacity group-hover:opacity-70">
          LAMT <span className="text-[var(--ucla-gold)]">2026</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--text-muted)]">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-[var(--text)] transition-colors duration-300"
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

        {/* main content sits under a fixed nav; give it consistent top padding */}
        <main className="min-h-screen">
          {children}
        </main>

        <footer className="border-t border-white/10 bg-[var(--bg-elevated)] text-[var(--text-muted)]">
          <div className="max-w-7xl mx-auto py-10 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[10px] tracking-[0.25em] uppercase">
              © 2026 Los Angeles Math Tournament
            </span>
            <div className="flex gap-6 text-[10px] tracking-[0.25em] uppercase">
              <Link href="/#about" className="hover:text-[var(--ucla-gold)] transition-colors">
                About
              </Link>
              <Link href="/#contact" className="hover:text-[var(--ucla-gold)] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
