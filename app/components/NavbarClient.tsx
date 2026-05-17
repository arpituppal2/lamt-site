'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tournament', label: 'LAMT 2026' },
  { href: '/live', label: 'Live' },
  { href: '/rules', label: 'Rules' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'Register', external: true },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const renderLink = ({ href, label, external }: typeof navLinks[number], mobile = false) => {
    const active = !external && (pathname === href || (href !== '/' && pathname.startsWith(href)));
    const className = `site-nav-link ${mobile ? 'site-nav-link--mobile' : ''} ${active ? 'is-active' : ''}`;

    if (external) {
      return (
        <a key={href} href={href} target="_blank" rel="noreferrer" className={className}>
          {label}
        </a>
      );
    }

    return (
      <Link key={href} href={href} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <header className="site-header site-pad">
      <div className="site-header__inner">
        <Link href="/" className="site-brand" aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT" width={56} height={56} className="site-brand__mark" priority />
          <span>LAMT</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map((link) => renderLink(link))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className="site-menu-button"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {menuOpen ? (
              <>
                <path d="M5 5L17 17" />
                <path d="M17 5L5 17" />
              </>
            ) : (
              <>
                <path d="M3 7H19" />
                <path d="M3 15H19" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="site-mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => renderLink(link, true))}
        </nav>
      )}
    </header>
  );
}
