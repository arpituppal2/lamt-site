'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tournament', label: 'Tournament' },
  { href: '/rules', label: 'Rules' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="text-[var(--color-gold)] font-bold tracking-widest uppercase text-sm hover:opacity-80 transition-opacity"
        >
          LAMT
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                pathname === href
                  ? 'text-[var(--color-gold)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSftpbL0NKSC4t4RqQeX4G3rCHpN4MrtKp8UhHpkEQqCvbN_hQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-sm"
          >
            Register
          </a>
        </div>

        <button
          className="md:hidden text-[var(--color-text)] flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[var(--color-bg)] border-t border-[var(--color-border)] px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-wide ${
                pathname === href ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-secondary)]'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSftpbL0NKSC4t4RqQeX4G3rCHpN4MrtKp8UhHpkEQqCvbN_hQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-sm w-fit"
          >
            Register
          </a>
        </div>
      )}
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-[var(--color-border)] mt-24 py-10 px-6 md:px-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[var(--color-gold)] font-bold tracking-widest uppercase text-sm">LAMT 2026</span>
              <span className="text-[var(--color-text-muted)] text-xs max-w-sm leading-relaxed">
                We are a student group acting independently of the University of California.
                We take full responsibility for our organization and this web site.
              </span>
            </div>
            <div className="flex flex-col gap-2 md:text-right">
              <span className="text-[var(--color-text-muted)] text-xs">Los Angeles Math Tournament</span>
              <span className="text-[var(--color-text-muted)] text-xs">UCLA Campus &mdash; May 17, 2026</span>
              <a
                href="mailto:lamt@math.ucla.edu"
                className="text-[var(--color-text-muted)] text-xs hover:text-[var(--color-gold)] transition-colors"
              >
                lamt@math.ucla.edu
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
