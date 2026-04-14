'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import KaTeXLoader from './components/KaTeXLoader';

// ── THEME TOGGLE (fixed bottom-right) ────────────────────────────────────
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (_) {}
    setIsDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 shadow-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
    >
      {isDark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

// ── NAVBAR ──────────────────────────────────────────────────────────────────
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#location', label: 'Location' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors duration-500"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white overflow-hidden shadow-sm">
            <Image src="/LAMTBear.png" alt="LAMT Bear" width={36} height={36} className="object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-900 dark:text-slate-100">
              LAMT 2026
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Los Angeles Math Tournament
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300 md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#003B5C] dark:hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center bg-[#FFD100] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#003B5C] hover:bg-[#f5c800] transition-colors duration-200"
          >
            Register
          </Link>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            }
          </button>
        </div>
      </motion.nav>

      {menuOpen && (
        <div className="md:hidden fixed top-[62px] left-0 right-0 z-30 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10 px-6 pb-5">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-white/5 no-underline"
            >{l.label}</Link>
          ))}
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank" rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center bg-[#FFD100] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#003B5C] no-underline"
          >Register on ContestDojo</Link>
        </div>
      )}
    </>
  );
}

// ── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 md:px-10 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white overflow-hidden shadow-sm">
            <Image src="/LAMTBear.png" alt="LAMT Bear" width={28} height={28} className="object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-slate-700 dark:text-slate-200">
              LAMT 2026
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Student-run · UCLA · Est. 2026
            </span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-5 justify-end">
          {[
            { href: '/#about',    label: 'About' },
            { href: '/#schedule', label: 'Schedule' },
            { href: '/#faq',      label: 'FAQ' },
            { href: '/#location', label: 'Location' },
            { href: 'mailto:team@lamt.net', label: 'Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
            >{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

// ── ROOT LAYOUT ─────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Los Angeles Math Tournament 2026</title>
        <meta name="description" content="LAMT 2026 — A student-run math competition at UCLA on May 17, 2026. Open to middle and high school students in grades 6–12. Free to attend." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#003B5C" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch(_) {}
        `}} />
        <KaTeXLoader />
        <NavBar />
        <ThemeToggle />
        <main className="relative min-h-screen pt-[62px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
