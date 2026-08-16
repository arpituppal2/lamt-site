'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'HOME' },
  // { href: '/tournament', label: 'LAMT 2026' },
  { href: '/archive', label: 'ARCHIVE' },
  { href: '/rules', label: 'RULES' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'ABOUT' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'REGISTER', external: true },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const linkClass = 'nav-link font-extrabold text-2xl tracking-wide uppercase text-white transition-opacity duration-200 hover:opacity-70';

  return (
    <header className="w-full bg-[#2774AE] transition-colors duration-300 dark:bg-black">
      <div className="mx-auto hidden h-27 max-w-[1600px] items-center justify-between px-4 md:flex md:px-6">
        <Link href="/" className="flex items-center gap-3 font-extrabold tracking-wide text-white transition-all hover:opacity-70">
          <Image src="/LAMTBear.png" alt="Logo" width={90} height={90} className="object-contain" />
        </Link>
        <nav className="site-nav relative flex items-center" style={{ gap: 'clamp(1.75rem, 4.5vw, 4.5rem)' }}>
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;
            return external ? (
              <a key={href} href={href} target="_blank" rel="noreferrer" className={linkClass} data-active={active ? 'true' : undefined}>
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={linkClass}
                data-active={active ? 'true' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex h-21 items-center justify-between px-4 md:hidden">
        <Link href="/" className="flex flex-col items-center gap-1 flex-1 text-center font-extrabold tracking-wide text-white">
          <Image src="/LAMTBear.png" alt="Logo" width={78} height={78} className="object-contain" />
          <span className="text-[10px] sm:text-xs">LOS ANGELES MATH TOURNAMENT</span>
        </Link>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" className="flex flex-col gap-1.5 p-1">
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="overflow-hidden border-t border-white/20 bg-[#2774AE] dark:bg-black md:hidden"
          style={{
            maxHeight: menuOpen ? `${menuHeight}px` : '0px',
            transition: 'max-height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="flex flex-col gap-6 px-6 py-4"
            ref={(el) => {
              if (el) setMenuHeight(el.scrollHeight);
            }}
          >
            {navLinks.map(({ href, label, external }) => {
              const active = pathname === href;
              const mobileClass = 'text-lg font-extrabold tracking-wide uppercase text-white transition-opacity hover:opacity-70';

              return external ? (
                <a key={href} href={href} target="_blank" rel="noreferrer" className={mobileClass} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={mobileClass}
                  style={{
                    textDecoration: active ? 'underline' : 'none',
                    textUnderlineOffset: '6px',
                    textDecorationThickness: '2px',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
