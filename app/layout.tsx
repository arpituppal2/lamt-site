'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import './globals.css';

const navLinks = [
  { href: '/',           label: 'HOME' },
  { href: '/tournament', label: 'TOURNAMENT' },
  { href: '/rules',      label: 'RULES' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/about',      label: 'ABOUT' },
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
<div className="hidden md:flex items-center justify-between px-10 h-20 max-w-[1400px] mx-auto">
  {/* LAMT — far left */}
  <Link
    href="/"
    className="text-white font-extrabold text-base tracking-widest uppercase hover:opacity-70 transition-opacity duration-200"
  >
    LAMT
  </Link>

  {/* Nav links — right */}
  <nav className="flex items-center gap-10">
    {navLinks.map(({ href, label }) => {
      const active = pathname === href;
      return (
        <Link
          key={href}
          href={href}
          className="text-white font-extrabold text-base tracking-widest uppercase transition-opacity duration-200 hover:opacity-70"
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
      <div className="md:hidden flex items-center justify-between px-6 h-16">
        <Link href="/" className="text-white font-extrabold text-base tracking-widest uppercase">
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
        <div className="md:hidden bg-[#2774AE] border-t border-white/10 px-6 py-5 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-white font-extrabold text-base tracking-widest uppercase"
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function Footer() {
  return (
    <footer className="bg-[#2774AE] dark:bg-black mt-0">
      <div className="max-w-[1400px] mx-auto px-10 py-12 flex flex-col md:flex-row justify-between gap-8">
        {/* Left: brand + disclaimer */}
        <div className="flex flex-col gap-3 max-w-sm">
          <span className="text-white font-extrabold text-base tracking-widest uppercase">LAMT 2026</span>
          <span className="text-[#DAEBFE] text-xs leading-relaxed">
            We are a student group acting independently of the University of California.
            We take full responsibility for our organization and this web site.
          </span>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#DAEBFE] hover:text-white text-sm font-medium transition-colors duration-200 mt-1"
          >
            <DiscordLogoIcon className="h-4 w-4" />
            Join our Discord
          </a>
        </div>

        {/* Center: nav */}
        <nav className="flex flex-col gap-3">
          <span className="text-[#8BB8E8] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Pages</span>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#DAEBFE] hover:text-white text-sm font-semibold tracking-wide uppercase transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: contact + register */}
        <div className="flex flex-col gap-3">
          <span className="text-[#8BB8E8] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Contact</span>
          {[
            { label: 'Email',     val: 'team@lamt.net',         href: 'mailto:team@lamt.net' },
            { label: 'Instagram', val: '@lamathtournament',      href: 'https://www.instagram.com/lamathtournament/' },
            { label: 'Discord',   val: 'Join server',            href: DISCORD_URL },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="text-[#DAEBFE] hover:text-white text-sm transition-colors duration-200"
            >
              <span className="font-bold">{c.label}</span>{' '}
              <span className="opacity-70">{c.val}</span>
            </a>
          ))}
          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block bg-[#FFD100] text-[#003B5C] font-extrabold text-sm tracking-widest uppercase px-6 py-3 rounded-md hover:bg-[#FFC72C] transition-colors duration-200"
          >
            Register →
          </a>
        </div>
      </div>

      <div className="border-t border-white/15 px-10 py-4 max-w-[1400px] mx-auto">
        <span className="text-[#8BB8E8] text-xs">© 2026 Los Angeles Math Tournament · UCLA Campus · May 17, 2026</span>
      </div>
    </footer>
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
      <body className="bg-[#DAEBFE] dark:bg-black min-h-screen transition-colors duration-300">
        <Navbar />
        <DarkModeToggle />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
