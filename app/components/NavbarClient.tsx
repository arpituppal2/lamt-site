'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '../lib/api';

type NavLink = { href: string; label: string; external: boolean };

const BASE_LINKS: NavLink[] = [
  { href: '/', label: 'HOME', external: false },
  { href: '/about', label: 'ABOUT', external: false },
  { href: '/archive', label: 'ARCHIVE', external: false },
  { href: '/rules', label: 'RULES', external: false },
  { href: '/faq', label: 'FAQ', external: false },
  { href: '/sponsorships', label: 'SPONSORS', external: false },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [siteMode, setSiteMode] = useState<'offseason' | 'tournament'>('offseason');
  const [registerEnabled, setRegisterEnabled] = useState(false);
  const [registerUrl, setRegisterUrl] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    api.getSettings().then(({ settings }) => {
      if (settings.site_mode === 'tournament' || settings.site_mode === 'offseason') {
        setSiteMode(settings.site_mode);
      }
      setRegisterEnabled(settings.register_enabled === 'true');
      if (settings.register_url) setRegisterUrl(settings.register_url);
    }).catch(() => {});
  }, []);

  const linkClass =
    'nav-link font-extrabold text-2xl uppercase tracking-wide text-white transition-opacity duration-200 hover:opacity-70';

  const isTournament = siteMode === 'tournament';
  const baseNavLinks = isTournament
    ? [...BASE_LINKS, { href: '/live', label: 'TOURNAMENT DAY', external: false }]
    : BASE_LINKS;

  const navLinks = registerEnabled && registerUrl
    ? [...baseNavLinks, { href: registerUrl, label: 'REGISTER', external: true }]
    : baseNavLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] w-full bg-[var(--ucla-blue)] dark:bg-[#000000] transition-colors duration-300">
      {/* Desktop shell at 901px+ — not Tailwind md/768 */}
      <div className="mx-auto hidden h-[7.875rem] max-w-[1600px] items-center justify-between px-6 min-[901px]:flex min-[901px]:px-8">
        <Link href="/" className="flex items-center gap-3 font-extrabold tracking-wide text-white transition-all hover:opacity-70">
          <Image src="/LAMTBear.png" alt="Los Angeles Math Tournament" width={85} height={85} className="object-contain py-1" />
        </Link>
        <nav className="site-nav relative flex items-center gap-x-8 min-[901px]:gap-x-[clamp(1.75rem,4.5vw,4.5rem)]" aria-label="Primary">
          {navLinks.map(({ href, label, external }) => {
            const isHome = href === '/' && pathname === '/';
            if (isHome) return null;
            const active = !external && (href === '/' ? pathname === '/' : pathname.startsWith(href));
            return external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`${linkClass} border-2 border-[var(--ucla-gold)] px-3 py-2 text-[var(--ucla-gold)] hover:bg-[var(--ucla-gold)] hover:text-[var(--ucla-blue-deep)] hover:opacity-100`}
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={linkClass}
                data-active={active ? 'true' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex h-21 items-center justify-between px-4 max-[900px]:flex min-[901px]:hidden">
        <Link href="/" className="flex flex-1 flex-col items-start gap-1 text-left font-extrabold tracking-wide text-white">
          <Image src="/LAMTBear.png" alt="Los Angeles Math Tournament" width={78} height={78} className="object-contain" />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex flex-col gap-1.5 p-2"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="overflow-hidden border-t border-white/20 bg-[var(--ucla-blue)] dark:bg-[#000000] min-[901px]:hidden"
          aria-label="Mobile"
          style={{
            maxHeight: menuOpen ? `${menuHeight}px` : '0px',
            transition: 'max-height 320ms cubic-bezier(0.33, 0, 0.2, 1)',
          }}
        >
          <div
            className="flex flex-col gap-6 px-6 py-4"
            ref={(el) => {
              if (el) setMenuHeight(el.scrollHeight);
            }}
          >
            {navLinks.map(({ href, label, external }) => {
              const isHome = href === '/' && pathname === '/';
              if (isHome) return null;
              const active = !external && (href === '/' ? pathname === '/' : pathname.startsWith(href));
              const mobileClass = 'text-lg font-extrabold uppercase tracking-wide text-white transition-opacity hover:opacity-70';

              return external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${mobileClass} text-[var(--ucla-gold)]`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={mobileClass}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    textDecoration: active ? 'underline' : 'none',
                    textUnderlineOffset: '6px',
                    textDecorationThickness: '2px',
                    textDecorationColor: 'var(--ucla-gold)',
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
