'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import KaTeXLoader from './components/KaTeXLoader';

// ── THEME TOGGLE (inline in nav) ────────────────────────────────────────────
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
      style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'color 0.15s',
        flexShrink: 0,
      }}
      className="hover:!text-[var(--text)]"
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
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#location', label: 'Location' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        height: '62px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 3rem)',
        backgroundColor: scrolled ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}>
        {/* #1 #2 — enlarged logo lockup, no subtext */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '8px',
            backgroundColor: 'var(--blue)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Image src="/LAMTBear.png" alt="LAMT" width={42} height={42} style={{ objectFit: 'contain' }} />
          </div>
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}>LAMT 2026</span>
        </Link>

        {/* #4 — nav links: 500 weight, 0.875rem, letter-spacing, hover underline */}
        <div className="hidden md:flex items-center" style={{ gap: 'var(--s8)' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s',
                paddingBottom: '2px',
              }}
              className="hover:!text-[var(--text)] hover:underline"
            >{l.label}</Link>
          ))}
        </div>

        {/* #3 — nav CTA: gold, same as hero; #28 — theme toggle in nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <ThemeToggle />
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank" rel="noreferrer"
            className="hidden md:inline-flex items-center justify-center btn-primary"
          >Register</Link>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex items-center justify-center"
            style={{
              width: '36px', height: '36px',
              border: '1px solid var(--border)', borderRadius: '4px',
              color: 'var(--text)', backgroundColor: 'transparent', cursor: 'pointer',
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            }
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden" style={{
          position: 'fixed', top: '62px', left: 0, right: 0, zIndex: 30,
          backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)',
          padding: 'var(--s3) clamp(1rem, 4vw, 3rem) var(--s5)',
        }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text)',
              padding: 'var(--s3) 0', borderBottom: '1px solid var(--border)', textDecoration: 'none',
            }}>{l.label}</Link>
          ))}
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank" rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 'var(--s3)', fontSize: 'var(--text-base)',
            }}
          >Register on ContestDojo</Link>
        </div>
      )}
    </>
  );
}

// ── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
      <div style={{
        maxWidth: '1000px', marginInline: 'auto',
        padding: 'var(--s8) clamp(1rem, 4vw, 3rem)',
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s4)',
      }}>
        {/* #27 — footer logo matches header size; #29 — tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '8px',
              backgroundColor: 'var(--blue)', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Image src="/LAMTBear.png" alt="LAMT" width={42} height={42} style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.01em' }}>
              LAMT 2026
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '60px' }}>
            Student-run · UCLA · Since 2024
          </span>
        </div>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s5)' }}>
          {[
            { href: '/#about',    label: 'About' },
            { href: '/#schedule', label: 'Schedule' },
            { href: '/#faq',      label: 'FAQ' },
            { href: '/#location', label: 'Location' },
            { href: 'mailto:team@lamt.net', label: 'Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="hover:!text-[var(--text)]"
              style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
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
        <meta name="description" content="LAMT 2026 — A student-run math competition at UCLA on May 17, 2026. Open to middle and high school students in grades 6–12." />
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
        {/* #28 — ThemeToggle moved into NavBar, no floating FAB */}
        <main style={{ paddingTop: '62px' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
