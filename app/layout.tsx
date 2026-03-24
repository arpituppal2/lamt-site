'use client';

import './globals.css';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', handleMove);

    let raf: number;
    const animate = () => {
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
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FFD100] pointer-events-none z-[9999] mix-blend-normal"
        style={{ transform: 'translate(-50%,-50%) translate(-9999px,-9999px)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[rgba(39,116,174,0.5)] bg-[rgba(39,116,174,0.05)] pointer-events-none z-[9998]"
        style={{ transform: 'translate(-9999px,-9999px) translate(-50%,-50%)' }}
      />
    </>
  );
}

function NavBar() {
  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#rounds',   label: 'Rounds' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#contact',  label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]"
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#2774AE]">
          <span className="text-[11px] font-black text-[#FFD100] tracking-[0.18em]">
            LA
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#003B5C]">
            Los Angeles Math Tournament
          </span>
          <span className="text-[10px] text-[#6B7280]">
            UCLA · 2026
          </span>
        </div>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-[11px] font-semibold tracking-[0.18em] uppercase">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="relative text-[#4B5563] hover:text-[#003B5C] transition-colors"
          >
            {label}
          </Link>
        ))}
        <Link
          href="#register"
          className="ml-4 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#2774AE] text-white text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-[#1E5E8B] transition-colors"
        >
          Register
        </Link>
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
        {/* KaTeX for MathDeco */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        />
      </head>
      <body className="bg-[#F5F5F7] text-[#003B5C] antialiased selection:bg-[#FFD100] selection:text-[#003B5C]">
        <CustomCursor />
        <NavBar />

        <main className="min-h-screen pt-16">{children}</main>

        <footer className="border-t border-[#E5E7EB] bg-white text-[#6B7280]">
          <div className="max-w-6xl mx-auto h-[70px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 gap-2">
            <span className="text-[11px] tracking-[0.18em] uppercase">
              © 2026 Los Angeles Math Tournament · UCLA
            </span>
            <div className="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase">
              <Link href="/#about" className="hover:text-[#003B5C] transition-colors">
                About
              </Link>
              <Link href="/#schedule" className="hover:text-[#003B5C] transition-colors">
                Schedule
              </Link>
              <Link href="/#register" className="hover:text-[#003B5C] transition-colors">
                Register
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
