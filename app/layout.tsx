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
      className="fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 shadow-md text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
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
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/8 transition-colors duration-300"
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-[68px]">

          {/* Logo lockup — bear large enough to read, with name beside it */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#003B5C] overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src="/LAMTBear.png"
                alt="LAMT Bear"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-bold tracking-[0.08em] text-slate-900 dark:text-white">
                Los Angeles Math Tournament
              </span>
              <span className="text-[11px] font-medium tracking-[0.06em] text-slate-400 dark:text-slate-500">
                UCLA · May 17, 2026
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#FFD100] text-[#003B5C] rounded-lg px-5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-[#f5c800] transition-colors duration-150 shadow-sm"
            >
              Register
            </Link>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden text-slate-700 dark:text-slate-200 p-1"
              aria-label="Toggle menu"
            >
              {menuOpen
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[68px] left-0 right-0 z-30 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/8 shadow-lg">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5"
            >{l.label}</Link>
          ))}
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-sm font-bold text-[#003B5C] dark:text-[#FFD100]"
          >Register →</Link>
        </div>
      )}
    </>
  );
}

function Footer() {
  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#location', label: 'Location' },
    { href: '/#register', label: 'Register' },
    { href: 'mailto:team@lamt.net', label: 'Contact' },
  ];

  return (
    <footer className="bg-[#003B5C] dark:bg-[#040c14] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* Top: logo block + nav links */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">

          {/* Logo + tagline */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 overflow-hidden">
              <Image src="/LAMTBear.png" alt="LAMT Bear" width={52} height={52} className="object-contain" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white tracking-wide">Los Angeles Math Tournament</p>
              <p className="text-[12px] text-white/50 mt-0.5">Student-run · UCLA · Est. 2026</p>
              <p className="text-[12px] font-semibold text-[#FFD100] mt-0.5">Free to attend</p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Nav links */}
          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-2.5">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50 hover:text-white transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">© 2026 Los Angeles Math Tournament · UCLA</p>
          <div className="flex gap-5">
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/lamathtournament/' },
              { label: 'Facebook',  href: 'https://www.facebook.com/groups/1429462591976204/' },
              { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/la-math-tournament/' },
              { label: 'Email',     href: 'mailto:team@lamt.net' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 hover:text-white/70 transition-colors duration-150"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Los Angeles Math Tournament 2026</title>
        <meta name="description" content="LAMT 2026 — A free, student-run math competition at UCLA on May 17, 2026." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#003B5C" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark'||(!('theme' in localStorage)&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(_){}`,
          }}
        />
        <KaTeXLoader />
        <NavBar />
        <ThemeToggle />
        <main className="min-h-screen pt-[68px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
