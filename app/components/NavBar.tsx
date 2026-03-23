'use client';
import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/#about',    label: 'About'    },
  { href: '/#schedule', label: 'Schedule' },
  { href: '/#faq',      label: 'FAQ'      },
  { href: '/#contact',  label: 'Contact'  },
  { href: '/#register', label: 'Register' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#020816]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#003B5C] rounded flex items-center justify-center">
            <span className="text-[#FFD100] font-black text-[11px] leading-none tracking-tight">
              LA
            </span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-50">
            LAMT <span className="text-[#FFB300]">2026</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-[#FFB300] rounded-md hover:bg-white/5 transition-colors tracking-[0.2em] uppercase"
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 rounded-md text-slate-200 hover:text-[#FFB300] hover:bg-white/5 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4 pt-2 space-y-1 bg-[#020816]/95">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 text-sm font-medium text-slate-100 hover:text-[#FFB300] hover:bg-white/5 rounded-md transition"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
