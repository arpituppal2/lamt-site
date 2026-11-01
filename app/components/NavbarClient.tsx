'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = { href: string; label: string; external: boolean };

const BASE_LINKS: NavLink[] = [
  { href: '/', label: 'Home', external: false },
  { href: '/archive', label: 'Archive', external: false },
  { href: '/rules', label: 'Rules', external: false },
  { href: '/faq', label: 'FAQ', external: false },
  { href: '/sponsorships', label: 'Sponsorships', external: false },
  { href: '/about', label: 'About', external: false },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [navLinks, setNavLinks] = useState<NavLink[]>(BASE_LINKS);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let mounted = true;
    fetch('/settings')
      .then((r) => r.json())
      .then(({ settings }) => {
        if (!mounted) return;
        const links = [...BASE_LINKS];
        if (settings.register_enabled === 'true' && settings.register_url) {
          links.push({
            href: settings.register_url,
            label: 'Register',
            external: true,
          });
        }
        setNavLinks(links);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const linkClass =
    'nav-link font-extrabold text-lg tracking-wide text-white transition-opacity duration-200 hover:opacity-70 md:text-xl';

  return (
    <header className="w-full bg-[var(--ucla-blue)] transition-colors duration-300 dark:bg-black">
      <div className="mx-auto hidden h-[7.875rem] max-w-[1600px] items-center justify-between px-4 md:flex md:px-6">
        <Link href="/" className="flex items-center gap-3 font-extrabold tracking-wide text-white transition-all hover:opacity-70">
          <Image src="/LAMTBear.png" alt="Los Angeles Math Tournament" width={85} height={85} className="object-contain py-1" />
        </Link>
        <nav className="site-nav relative flex items-center" aria-label="Primary" style={{ gap: 'clamp(1.25rem, 3.5vw, 3.5rem)' }}>
          {navLinks.map(({ href, label, external }) => {
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

      <div className="flex h-21 items-center justify-between px-4 md:hidden">
        <Link href="/" className="flex flex-1 flex-col items-center gap-1 text-center font-extrabold tracking-wide text-white">
          <Image src="/LAMTBear.png" alt="Los Angeles Math Tournament" width={78} height={78} className="object-contain" />
          <span className="text-[10px] sm:text-xs">Los Angeles Math Tournament</span>
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
          className="overflow-hidden border-t border-white/20 bg-[var(--ucla-blue)] dark:bg-black md:hidden"
          aria-label="Mobile"
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
              const active = !external && (href === '/' ? pathname === '/' : pathname.startsWith(href));
              const mobileClass = 'text-lg font-extrabold tracking-wide text-white transition-opacity hover:opacity-70';

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
