'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import KaTeXLoader from './components/KaTeXLoader';

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
      className="fixed bottom-6 right-6 z-50 flex h-8 w-8 items-center justify-center bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 shadow text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-14 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/8 transition-colors duration-300"
      >
        {/* Logo lockup */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden flex-shrink-0">
            <Image src="/LAMTBear.png" alt="LAMT" width={28} height={28} className="object-contain" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900 dark:text-white">
            LAMT 2026
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank" rel="noreferrer"
            className="hidden md:block text-[11px] font-bold uppercase tracking-[0.18em] text-[#003B5C] dark:text-[#FFD100] hover:opacity-70 transition-opacity"
          >
            Register →
          </Link>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden text-slate-700 dark:text-slate-200"
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            }
          </button>
        </div>
      </motion.nav>

      {menuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-30 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/8">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-3.5 text-sm font-medium text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5"
            >{l.label}</Link>
          ))}
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank" rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-3.5 text-sm font-bold text-[#003B5C] dark:text-[#FFD100]"
          >Register →</Link>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/8 bg-white dark:bg-[#050505] transition-colors">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-900 dark:text-white">LAMT 2026</span>
          <span className="ml-3 text-[10px] text-slate-400 dark:text-slate-500">Student-run · UCLA · Est. 2026 · Free to attend</span>
        </div>
        <nav className="flex gap-6">
          {[
            { href: '/#about', label: 'About' },
            { href: '/#schedule', label: 'Schedule' },
            { href: '/#faq', label: 'FAQ' },
            { href: 'mailto:team@lamt.net', label: 'Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="text-[10px] font-medium tracking-[0.12em] uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Los Angeles Math Tournament 2026</title>
        <meta name="description" content="LAMT 2026 — A free, student-run math competition at UCLA on May 17, 2026 for students in grades 6–12." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#003B5C" />
        {/* Georgia/Garamond-adjacent serif for display via system stack — no extra load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* EB Garamond for display headings; Inter for body/UI */}
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.theme==='dark'||(!('theme' in localStorage)&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(_){}` }} />
        <KaTeXLoader />
        <NavBar />
        <ThemeToggle />
        <main className="min-h-screen pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
