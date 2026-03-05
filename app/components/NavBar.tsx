'use client';
import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/about',    label: 'About'    },
  { href: '/schedule', label: 'Schedule' },
  { href: '/faq',      label: 'FAQ'      },
  { href: '/contact',  label: 'Contact'  },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#003B5C] rounded flex items-center justify-center">
            <span className="text-[#FFD100] font-black text-[11px] leading-none tracking-tight">LA</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            LAMT <span className="text-[#2774AE]">2026</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#2774AE] rounded-md hover:bg-blue-50 transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/register"
            className="ml-3 bg-[#2774AE] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1a5276] transition-colors shadow-sm"
          >
            Register
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md text-slate-500 hover:text-[#2774AE] hover:bg-blue-50 transition"
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
        <div className="md:hidden border-t border-slate-100 px-4 pb-4 pt-2 space-y-1 bg-white">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2774AE] hover:bg-blue-50 rounded-md transition"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/register"
            className="block mt-2 text-center bg-[#2774AE] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1a5276] transition"
            onClick={() => setOpen(false)}
          >
            Register Your Team
          </Link>
        </div>
      )}
    </nav>
  );
}
