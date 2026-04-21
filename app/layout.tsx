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
          LAMT
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
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
    />
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="bg-[#2774AE] dark:bg-black mt-0">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-10 grid grid-cols-2 gap-10">

        {/* Column 1: Pages */}
        <div className="flex flex-col gap-2">
          <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide">
            Pages
          </span>

          {navLinks
            .filter(({ external }) => !external)
            .map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#DAEBFE] hover:text-white text-sm font-semibold uppercase"
              >
                {label}
              </Link>
            ))}
        </div>

        {/* Column 2: Contact */}
        <div className="flex flex-col gap-2">
          <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide">
            Contact
          </span>

          <a className="text-[#DAEBFE] text-sm">team@lamt.net</a>
          <a className="text-[#DAEBFE] text-sm">@lamathtournament</a>

          <a
            href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u"
            target="_blank"
            rel="noreferrer"
            className="text-[#DAEBFE] text-sm font-semibold uppercase mt-2"
          >
            Register
          </a>
        </div>
        
      </div>
    </footer>
  );
}
        {/* Center */}
        <nav className="flex flex-col gap-2">
          <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide">
            Pages
          </span>
          {navLinks.map(({ href, label, external }) =>
            external ? null : (
              <Link
                key={href}
                href={href}
                className="text-[#DAEBFE] hover:text-white text-sm font-semibold uppercase"
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Right */}
        <div className="flex flex-col gap-2">
          <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide">
            Contact
          </span>
          <a className="text-[#DAEBFE] text-sm">team@lamt.net</a>
          <a className="text-[#DAEBFE] text-sm">@lamathtournament</a>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-[1600px] mx-auto px-4 md:px-6 py-3">
        <span className="text-[#8BB8E8] text-xs">
          © 2026 LAMT · UCLA · May 17, 2026
        </span>
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
