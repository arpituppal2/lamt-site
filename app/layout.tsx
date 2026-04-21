'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import './globals.css';

const navLinks = [
  { href: '/',           label: 'HOME' },
  { href: '/tournament', label: 'LAMT 2026' },
  { href: '/rules',      label: 'RULES' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/about',      label: 'ABOUT' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'REGISTER', external: true },
];

const DISCORD_URL  = 'https://discord.gg/cV6EHtfcD';
const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY]   = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 80);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[#2774AE] dark:bg-black transition-transform duration-300"
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-4 md:px-6 h-20 max-w-[1600px] mx-auto">

        {/* LAMT */}
        <Link
          href="/"
          className="text-white font-extrabold text-lg tracking-wide uppercase hover:opacity-70 transition-opacity duration-200"
        >
          Los Angeles Math Tournament
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-10">
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;

            const className =
              "text-white font-extrabold text-lg tracking-wide uppercase hover:opacity-70 transition-opacity duration-200";

            if (external) {
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {label}
                </a>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={className}
                style={{
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: '6px',
                  textDecorationThickness: '2px',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-white font-extrabold text-lg tracking-wide uppercase">
          LAMT
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 p-1"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#2774AE] border-t border-white/10 px-4 py-5 flex flex-col gap-5">
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;

            const className =
              "text-white font-extrabold text-lg tracking-wide uppercase";

            if (external) {
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={className}
                >
                  {label}
                </a>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={className}
                style={{
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: '6px',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

/* ---------------- DARK MODE ---------------- */

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    setDark(false);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center
        bg-[#003B5C] dark:bg-[#DAEBFE] text-white dark:text-[#003B5C]
        shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
    >
      {dark ? (
        /* Sun icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
        </svg>
      )}
    </button>
  );
}
/* ---------------- FOOTER ---------------- */

/* ---------------- FOOTER ---------------- */

import Image from 'next/image';
import {
  EnvelopeClosedIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';

// Simple inline SVGs for platforms Radix doesn't cover
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.05a19.91 19.91 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

function Footer() {
  const socialLinks = [
    {
      icon: <EnvelopeClosedIcon width={14} height={14} />,
      label: 'Email',
      display: 'team@lamt.net',
      href: 'mailto:team@lamt.net',
    },
    {
      icon: <InstagramIcon />,
      label: 'Instagram',
      display: '@lamathtournament',
      href: 'https://www.instagram.com/lamathtournament/',
    },
    {
      icon: <FacebookIcon />,
      label: 'Facebook',
      display: 'LAMT Community',
      href: 'https://www.facebook.com/groups/1429462591976204/',
    },
    {
      icon: <LinkedInLogoIcon width={14} height={14} />,
      label: 'LinkedIn',
      display: 'LA Math Tournament',
      href: 'https://www.linkedin.com/company/la-math-tournament/',
    },
    {
      icon: <DiscordIcon />,
      label: 'Discord',
      display: 'Join server',
      href: 'https://discord.gg/cV6EHtfcD',
    },
  ];

  return (
    <footer className="bg-[#2774AE] dark:bg-black mt-0">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">

        {/* Top row: logo + two columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/LAMTBear.png"
              alt="LAMT Bear Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          {/* Column 1: Social */}
          <div className="flex flex-col gap-2">
            <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide mb-1">
              Social
            </span>
            {socialLinks.map(({ icon, label, display, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noreferrer'}
                className="flex items-center gap-2 text-[#DAEBFE] hover:text-white text-sm transition-opacity duration-200"
              >
                <span className="opacity-70 flex-shrink-0">{icon}</span>
                <span className="font-medium">{label}</span>
                <span className="text-[#8BB8E8] text-xs">·</span>
                <span className="opacity-80">{display}</span>
              </a>
            ))}
          </div>

          {/* Column 2: Contact */}
          <div className="flex flex-col gap-2">
            <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide mb-1">
              Contact
            </span>
            <a
              href="mailto:team@lamt.net"
              className="text-[#DAEBFE] hover:text-white text-sm transition-opacity duration-200"
            >
              team@lamt.net
            </a>
            <a
              href="https://www.instagram.com/lamathtournament/"
              target="_blank"
              rel="noreferrer"
              className="text-[#DAEBFE] hover:text-white text-sm transition-opacity duration-200"
            >
              @lamathtournament
            </a>
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[#DAEBFE] hover:text-white text-sm font-semibold uppercase mt-2 transition-opacity duration-200"
            >
              Register
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="text-[#8BB8E8] text-xs leading-relaxed max-w-2xl">
            We are a student group acting independently of the University of California. We take full responsibility for our organization and this web site.
          </p>
        </div>

      </div>
    </footer>
  );
}
/* ---------------- ROOT ---------------- */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#DAEBFE] dark:bg-black min-h-screen transition-colors duration-300">
        <Navbar />
        <DarkModeToggle />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
