'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navLinks = [
  { href: '/',           label: 'HOME' },
  { href: '/tournament', label: 'LAMT 2026' },
  { href: '/rules',      label: 'RULES' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/about',      label: 'ABOUT' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'REGISTER', external: true },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const linkClass = 'font-extrabold text-xl tracking-widest uppercase hover:opacity-70 transition-opacity duration-200 text-white';

  return (
    <header className="w-full bg-[#2774AE] dark:bg-black transition-colors duration-300">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-4 md:px-6 h-20 max-w-[1600px] mx-auto">
        <Link href="/" className="font-extrabold text-xl tracking-wide uppercase hover:opacity-70 transition-all flex items-center gap-3 text-white">
          <Image src="/LAMTBear.png" alt="Logo" width={60} height={60} className="object-contain" />
        </Link>
        <nav className="flex items-center gap-16">
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;
            return external ? (
              <a key={href} href={href} target="_blank" rel="noreferrer" className={linkClass}>{label}</a>
            ) : (
              <Link key={href} href={href} className={linkClass}
                style={{ textDecoration: active ? 'underline' : 'none', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-16">
        <Link href="/" className="font-extrabold text-lg tracking-wide uppercase flex items-center gap-2 text-white">
          <Image src="/LAMTBear.png" alt="Logo" width={28} height={28} className="object-contain" />
          LAMT
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="flex flex-col gap-1.5 p-1">
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#2774AE] dark:bg-black border-t border-white/20"
          >
            <div className="flex flex-col px-6 py-4 gap-6">
              {navLinks.map(({ href, label, external }) => {
                const active = pathname === href;
                return external ? (
                  <a key={href} href={href} target="_blank" rel="noreferrer"
                    className="font-extrabold text-lg tracking-widest uppercase text-white hover:opacity-70 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >{label}</a>
                ) : (
                  <Link key={href} href={href}
                    className="font-extrabold text-lg tracking-widest uppercase text-white hover:opacity-70 transition-opacity"
                    style={{ textDecoration: active ? 'underline' : 'none', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}
                    onClick={() => setMenuOpen(false)}
                  >{label}</Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
