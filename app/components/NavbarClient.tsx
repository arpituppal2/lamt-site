'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'HOME' },
//   { href: '/tournament', label: 'LAMT 2026' },
  { href: '/archive', label: 'ARCHIVE' },
  { href: '/rules', label: 'RULES' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'ABOUT' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'REGISTER', external: true },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const linkClass = 'font-extrabold text-xl tracking-widest uppercase text-white transition-opacity duration-200 hover:opacity-70';

  return (
    <header className="w-full bg-[#2774AE] transition-colors duration-300 dark:bg-black">
      <div className="mx-auto hidden h-20 max-w-[1600px] items-center justify-between px-4 md:flex md:px-6">
        <Link href="/" className="flex items-center gap-3 font-extrabold uppercase tracking-wide text-white transition-all hover:opacity-70">
          <Image src="/LAMTBear.png" alt="Logo" width={60} height={60} className="object-contain" />
        </Link>
        <nav className="flex items-center gap-16">
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;
            return external ? (
              <a key={href} href={href} target="_blank" rel="noreferrer" className={linkClass}>
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={linkClass}
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

      <div className="flex h-16 items-center justify-between px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-extrabold uppercase tracking-wide text-white">
          <Image src="/LAMTBear.png" alt="Logo" width={28} height={28} className="object-contain" />
          LAMT
        </Link>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" className="flex flex-col gap-1.5 p-1">
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <nav className="overflow-hidden border-t border-white/20 bg-[#2774AE] dark:bg-black md:hidden">
          <div className="flex flex-col gap-6 px-6 py-4">
            {navLinks.map(({ href, label, external }) => {
              const active = pathname === href;
              const mobileClass = 'text-lg font-extrabold uppercase tracking-widest text-white transition-opacity hover:opacity-70';

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
