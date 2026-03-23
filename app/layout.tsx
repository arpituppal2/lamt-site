'use client';

import './globals.css';
import Link from 'next/link';
import type React from 'react';

// We’ll inline the nav + cursor for now to keep it in one file
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.classList.add('js-enabled');

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove);

    let raf: number;
    const loop = () => {
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.08;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x - 200}px, ${glowPos.current.y - 200}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const interactiveSelector = 'a,button,input,textarea,[role="button"]';
    const enter = () => document.body.classList.add('cursor-hover');
    const leave = () => document.body.classList.remove('cursor-hover');
    const els = Array.from(document.querySelectorAll(interactiveSelector));
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
      {/* small gold dot */}
      <div
        id="cursor"
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--accent)] pointer-events-none z-[9999]"
      />
      {/* thin gold ring + glow blob */}
      <div
        id="cursor-ring"
        ref={glowRef}
        className="hidden md:block fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[9998] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,179,0,0.35) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div id="scroll-progress" />
    </>
  );
}

function NavBar() {
  const links = ['About', 'Schedule', 'FAQ', 'Contact', 'Register'];
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
        {links.map(label => (
          <Link
            key={label}
            href={`/${label.toLowerCase()}`}
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
              {['About', 'Schedule', 'FAQ', 'Contact', 'Register'].map(label => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
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
