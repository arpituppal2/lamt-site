'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// --- ICONS ---
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// --- CUSTOM CURSOR ---
function EliteCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Hide default cursor across the app
    document.body.classList.add('cursor-hidden');

    const handleMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      // Subtracting 12px centers the 24px (h-6 w-6) cursor perfectly on the mouse
      const x = e.clientX - 12;
      const y = e.clientY - 12;
      
      // Apply translation directly without relying on Tailwind transform classes
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.body.classList.remove('cursor-hidden');
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      // Removed -translate-x-1/2 and -translate-y-1/2 since JS handles it now
      className="fixed top-0 left-0 z-[99999] h-6 w-6 rounded-full bg-slate-800 dark:bg-white mix-blend-difference pointer-events-none transition-transform duration-75 ease-out"
      style={{ transform: 'translate3d(-999px, -999px, 0)' }}
    />
  );
}

// --- THEME TOGGLE ---
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  if (!mounted) return null;

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
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full bg-white dark:bg-[#111] text-slate-800 dark:text-[#FFD100] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_20px_rgba(255,209,0,0.15)] hover:scale-110 transition-all duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// --- NAVBAR ---
function NavBar() {
  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#register', label: 'Register' },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-4 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors duration-500"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2774AE]">
          <span className="text-[10px] font-black tracking-[0.24em] text-[#FFD100]">LA</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-slate-900 dark:text-slate-100">
            LAMT 2026
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            UCLA · Los Angeles Math Tournament
          </span>
        </div>
      </Link>

      <div className="hidden items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300 md:flex">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="relative transition-colors duration-300 hover:text-[#2774AE] dark:hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/#register"
          className="ml-4 rounded-full bg-[#FFD100] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#003B5C] dark:text-black transition-transform duration-200 hover:scale-105 shadow-md dark:shadow-none"
        >
          Waitlist
        </Link>
      </div>
    </motion.nav>
  );
}

// --- FOOTER ---
function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-6 md:px-10 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2774AE]">
            <span className="text-[9px] font-black tracking-[0.26em] text-[#FFD100]">LA</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-slate-700 dark:text-slate-200">
              LAMT 2026
            </span>
            <span className="text-[10px]">© 2026 UCLA Los Angeles Math Tournament</span>
          </div>
        </div>

        <div className="hidden items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] md:flex">
          <Link href="/#about" className="hover:text-slate-800 dark:hover:text-slate-200">About</Link>
          <Link href="/#schedule" className="hover:text-slate-800 dark:hover:text-slate-200">Schedule</Link>
          <Link href="/#faq" className="hover:text-slate-800 dark:hover:text-slate-200">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
      </head>
      <body className="min-h-screen bg-[#FAFAFA] dark:bg-black text-slate-900 dark:text-[#F5F5F7] antialiased selection:bg-[#FFD100] selection:text-[#003B5C]" suppressHydrationWarning>
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
        <EliteCursor />
        <NavBar />
        <ThemeToggle />
        <main className="relative min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
