'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import KaTeXLoader from './components/KaTeXLoader';

// ── THEME TOGGLE (fixed bottom-right) ──────────────────────────────────────
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
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        color: 'var(--text-muted)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'color 0.15s, background-color 0.15s',
      }}
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
        height: '58px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 3rem)',
        backgroundColor: scrolled ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '6px',
            backgroundColor: 'var(--blue)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Image src="/LAMTBear.png" alt="LAMT" width={26} height={26} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15 }}>LAMT 2026</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.15 }}>May 17 · UCLA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center" style={{ gap: 'var(--s8)' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="hover:!text-[var(--text)]"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}
            >{l.label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank" rel="noreferrer"
            className="hidden md:inline-flex items-center justify-center hover:opacity-85"
            style={{
              fontSize: 'var(--text-sm)', fontWeight: 600,
              padding: '0.4375rem 1rem',
              backgroundColor: 'var(--blue)', color: '#fff',
              borderRadius: '6px', textDecoration: 'none', transition: 'opacity 0.15s',
            }}
          >Register</Link>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex items-center justify-center"
            style={{
              width: '36px', height: '36px',
              border: '1px solid var(--border)', borderRadius: '6px',
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
          position: 'fixed', top: '58px', left: 0, right: 0, zIndex: 30,
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
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 'var(--s3)', fontSize: 'var(--text-base)', fontWeight: 600,
              padding: 'var(--s3) var(--s6)',
              backgroundColor: 'var(--blue)', color: '#fff', borderRadius: '6px', textDecoration: 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '5px',
            backgroundColor: 'var(--blue)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Image src="/LAMTBear.png" alt="LAMT" width={22} height={22} style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            © 2026 Los Angeles Math Tournament
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
        <ThemeToggle />
        <main style={{ paddingTop: '58px' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
