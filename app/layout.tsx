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
];

const DISCORD_URL  = 'https://discord.gg/cV6EHtfcD';
const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

/* ---------------- NAVBAR ---------------- */

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
      <div className="hidden md:flex items-center justify-between px-4 md:px-6 h-[72px] max-w-[1680px] mx-auto">

        {/* LEFT: LAMT */}
        <Link
          href="/"
          className="text-white font-extrabold text-lg tracking-wide uppercase hover:opacity-70 transition-opacity"
        >
          LAMT
        </Link>

        {/* CENTER: NAV */}
        <nav className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="text-white font-extrabold text-lg tracking-wide uppercase hover:opacity-70 transition-opacity"
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

        {/* RIGHT: REGISTER */}
        <div className="flex items-center gap-4">
          <Link
            href={REGISTER_URL}
            target="_blank"
            className="bg-[#FFD100] text-[#003B5C] font-extrabold text-sm tracking-widest uppercase px-4 py-2 rounded-md hover:bg-[#FFC72C] transition-colors"
          >
            REGISTER
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 h-14">
        <Link href="/" className="text-white font-extrabold text-lg tracking-wide uppercase">
          LAMT
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#2774AE] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-white font-extrabold text-lg tracking-wide uppercase"
                style={{
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: '6px',
                }}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href={REGISTER_URL}
            target="_blank"
            className="bg-[#FFD100] text-[#003B5C] font-extrabold text-sm tracking-widest uppercase px-4 py-2 rounded-md text-center"
          >
            REGISTER
          </Link>
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
      className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center
      bg-[#003B5C] dark:bg-[#DAEBFE] text-white dark:text-[#003B5C] shadow-lg"
    />
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="bg-[#2774AE] dark:bg-black mt-0">
      <div className="max-w-[1680px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between gap-6">

        {/* LEFT */}
        <div className="flex flex-col gap-2 max-w-sm">
          <span className="text-white font-extrabold text-lg tracking-wide uppercase">
            LAMT 2026
          </span>
          <span className="text-[#DAEBFE] text-xs leading-snug">
            We are a student group acting independently of the University of California.
            We take full responsibility for our organization and this website.
          </span>

          <a
            href={DISCORD_URL}
            target="_blank"
            className="text-[#DAEBFE] hover:text-white text-sm flex items-center gap-2"
          >
            <DiscordLogoIcon className="h-4 w-4" />
            Join Discord
          </a>
        </div>

        {/* CENTER */}
        <nav className="flex flex-col gap-2">
          <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide">
            Pages
          </span>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#DAEBFE] hover:text-white text-sm font-semibold uppercase"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex flex-col gap-2">
          <span className="text-[#8BB8E8] text-[10px] font-bold uppercase tracking-wide">
            Contact
          </span>

          <a className="text-[#DAEBFE] text-sm">team@lamt.net</a>
          <a className="text-[#DAEBFE] text-sm">@lamathtournament</a>

          <Link
            href={REGISTER_URL}
            target="_blank"
            className="mt-2 bg-[#FFD100] text-[#003B5C] font-extrabold text-sm px-4 py-2 rounded-md w-fit"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-[1680px] mx-auto px-4 md:px-6 py-3">
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
      <body className="bg-[#DAEBFE] dark:bg-black min-h-screen transition-colors">
        <Navbar />
        <DarkModeToggle />
        <main className="pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
