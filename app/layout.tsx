'use client';

import './globals.css';
import Link from 'next/link';
import type React from 'react';

// We’ll inline the nav + cursor for now to keep it in one file
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.classList.add('js-enabled');

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', handleMove);

    let raf: number;
    const animate = () => {
      // smooth follow for ring
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const interactive = 'a,button,input,textarea,[role="button"]';
    const enter = () => document.body.classList.add('cursor-hover');
    const leave = () => document.body.classList.remove('cursor-hover');
    const els = Array.from(document.querySelectorAll(interactive));
    els.forEach(el => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
      els.forEach(el => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      {/* small dot exactly on cursor */}
<div
  ref={dotRef}
  className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--accent)] pointer-events-none z-[9999]"
style={{ transform: 'translate(-50%,-50%) translate(-9999px,-9999px)' }}
  />
      {/* thin ring around cursor */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[rgba(255,179,0,0.5)] bg-[rgba(255,179,0,0.05)] pointer-events-none z-[9998]"
        style={{ transform: 'translate(-9999px,-9999px) translate(-50%,-50%)' }}
      />
      <div id="scroll-progress" />
    </>
  );
}

function NavBar() {
  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#contact',  label: 'Contact' },
    { href: '/#register', label: 'Register' },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-xl border-b border-white/10"
      style={{ background: 'rgba(10,25,47,0.85)' }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2774AE]">
          <span className="text-[10px] font-black text-[#FFD100]">LA</span>
        </div>
        <span className="text-sm font-semibold tracking-[0.28em] uppercase text-white/80">
          LAMT 2026
        </span>
      </Link>
      <div className="flex items-center gap-6 text-xs font-semibold tracking-[0.18em] uppercase">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="relative text-white/70 hover:text-[#FFB300] transition-colors"
          >
            <span className="hidden md:inline">{label}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
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
      <body className="bg-gradient-to-br from-[#006994] to-[#0A192F] text-slate-100 antialiased font-sans selection:bg-[#FFD100] selection:text-[#003B5C] overflow-x-hidden">
        <CustomCursor />
        <NavBar />

        <main className="min-h-screen pt-16">{children}</main>

        {/* ultra-compact footer */}
        <footer className="border-t border-white/10 bg-[#020816]/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto h-[60px] flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#2774AE] rounded-lg flex items-center justify-center">
                <span className="text-[9px] font-black text-[#FFD100]">LA</span>
              </div>
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-300">
                LAMT 2026
              </span>
            </div>
<div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
  {[
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#contact',  label: 'Contact' },
    { href: '/#register', label: 'Register' },
  ].map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      className="hover:text-[#FFD100] transition-colors"
    >
      {label}
    </Link>
  ))}
</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
