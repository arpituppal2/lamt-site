'use client';

import './globals.css';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (_) {}
    setIsDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
      style={{ border: '1px solid var(--border)' }}
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
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#location', label: 'Location' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 clamp(1rem, 4vw, 3rem)',
    height: '60px',
    backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg) 94%, transparent)' : 'var(--bg)',
    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    transition: 'background-color 0.25s, border-color 0.25s, backdrop-filter 0.25s',
  };

  return (
    <>
      <nav style={navStyle}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden"
               style={{ backgroundColor: 'var(--blue)' }}>
            <Image src="/LAMTBear.png" alt="LAMT" width={28} height={28} className="object-contain" />
          </div>
          <div className="flex flex-col" style={{ gap: '1px' }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text)',
              lineHeight: 1.2,
            }}>LAMT 2026</span>
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              lineHeight: 1.2,
            }}>May 17 · UCLA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center" style={{ gap: 'var(--s8)' }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                transition: 'color 0.15s',
                textDecoration: 'none',
              }}
              className="hover:!text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center" style={{ gap: 'var(--s3)' }}>
          <ThemeToggle />
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center justify-center"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              padding: '0.4375rem 1rem',
              backgroundColor: 'var(--blue)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'background-color 0.15s',
            }}
          >
            Register
          </Link>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text)',
              backgroundColor: 'transparent',
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="md:hidden fixed left-0 right-0 z-30 flex flex-col"
          style={{
            top: '60px',
            backgroundColor: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
            padding: 'var(--s4) clamp(1rem, 4vw, 3rem) var(--s6)',
            gap: 'var(--s1)',
          }}
        >
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                color: 'var(--text)',
                padding: 'var(--s3) 0',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center justify-center"
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              padding: 'var(--s3) var(--s6)',
              backgroundColor: 'var(--blue)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
            }}
          >
            Register on ContestDojo
          </Link>
        </div>
      )}
    </>
  );
}

function Footer() {
  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#location', label: 'Location' },
    { href: 'mailto:team@lamt.net', label: 'Contact' },
  ];

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      backgroundColor: 'var(--bg)',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--s4)',
        paddingTop: 'var(--s8)',
        paddingBottom: 'var(--s8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <div style={{
            width: '28px', height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--blue)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image src="/LAMTBear.png" alt="LAMT" width={24} height={24} className="object-contain" />
          </div>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}>
            © 2026 Los Angeles Math Tournament
          </span>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s6)' }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              className="hover:!text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <title>Los Angeles Math Tournament 2026</title>
        <meta name="description" content="LAMT 2026 — A student-run math competition at UCLA on May 17, 2026. Open to middle and high school students in grades 6–12." />
        <meta name="keywords" content="math tournament, LA math tournament, LAMT, UCLA, math competition, high school math, middle school math, 2026" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.lamt.net" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.lamt.net" />
        <meta property="og:title" content="Los Angeles Math Tournament 2026" />
        <meta property="og:description" content="A student-run math competition at UCLA on May 17, 2026. Open to middle and high school students in grades 6–12." />
        <meta property="og:image" content="https://www.lamt.net/LAMTBear.png" />
        <meta property="og:site_name" content="LAMT" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Angeles Math Tournament 2026" />
        <meta name="twitter:description" content="Student-run math competition at UCLA · May 17, 2026 · Grades 6–12" />
        <meta name="twitter:image" content="https://www.lamt.net/LAMTBear.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#003B5C" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
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
        <main style={{ paddingTop: '60px' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
