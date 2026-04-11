'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import KaTeXLoader from './components/KaTeXLoader';

// --- ICONS ---
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- THEME TOGGLE ---
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-[#FFD100] hover:scale-110 transition-all duration-200"
      aria-label="Toggle dark mode"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// --- NAVBAR ---
function NavBar() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#location', label: 'Location' },
  ];

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-10 py-4 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm'
            : 'bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white overflow-hidden shadow-sm">
            <Image src="/LAMTBear.png" alt="LAMT Bear" width={40} height={40} className="object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-slate-900 dark:text-slate-100">
              LAMT 2026
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Los Angeles Math Tournament
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-300 md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition-colors duration-200 hover:text-[#003B5C] dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {mounted && <ThemeToggle isDark={isDark} onToggle={toggleTheme} />}
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-full bg-[#FFD100] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#003B5C] transition-all duration-200 hover:scale-105 shadow-md dark:shadow-none"
          >
            Register
          </Link>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {mounted && <ThemeToggle isDark={isDark} onToggle={toggleTheme} />}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[65px] left-4 right-4 z-50 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold tracking-[0.18em] uppercase text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-1 px-2 pb-2">
                <Link
                  href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full rounded-full bg-[#FFD100] py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#003B5C]"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- FOOTER ---
function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="mx-auto flex flex-col md:flex-row h-auto md:h-24 gap-4 md:gap-0 max-w-6xl items-center justify-between px-6 md:px-10 py-6 md:py-0 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white overflow-hidden shadow-sm">
            <Image src="/LAMTBear.png" alt="LAMT Bear" width={32} height={32} className="object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-slate-700 dark:text-slate-200">
              LAMT 2026
            </span>
            <span className="text-[10px]">© 2026 Los Angeles Math Tournament</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em]">
          <Link href="/#about" className="hover:text-slate-800 dark:hover:text-slate-200">About</Link>
          <Link href="/#schedule" className="hover:text-slate-800 dark:hover:text-slate-200">Schedule</Link>
          <Link href="/#faq" className="hover:text-slate-800 dark:hover:text-slate-200">FAQ</Link>
          <Link href="/#location" className="hover:text-slate-800 dark:hover:text-slate-200">Location</Link>
          <a href="mailto:team@lamt.net" className="hover:text-slate-800 dark:hover:text-slate-200">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <title>Los Angeles Math Tournament 2026</title>
        <meta name="description" content="LAMT 2026 — A student-run math competition at UCLA on May 17, 2026. Open to middle and high school students. Algebra, geometry, combinatorics, and number theory." />
        <meta name="keywords" content="math tournament, LA math tournament, LAMT, UCLA, math competition, high school math, middle school math, 2026" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.lamt.net" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.lamt.net" />
        <meta property="og:title" content="Los Angeles Math Tournament 2026" />
        <meta property="og:description" content="A student-run math competition at UCLA on May 17, 2026. Open to middle and high school students in grades 6–12." />
        <meta property="og:image" content="https://www.lamt.net/LAMTBear.png" />
        <meta property="og:site_name" content="LAMT" />

        {/* Twitter / X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Angeles Math Tournament 2026" />
        <meta name="twitter:description" content="Student-run math competition at UCLA · May 17, 2026 · Grades 6–12" />
        <meta name="twitter:image" content="https://www.lamt.net/LAMTBear.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#003B5C" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className="min-h-screen bg-[#FAFAFA] dark:bg-black text-slate-900 dark:text-[#F5F5F7] antialiased selection:bg-[#FFD100] selection:text-[#003B5C]"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        <KaTeXLoader />
        <NavBar />
        <main className="relative min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
