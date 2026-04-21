'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DiscordLogoIcon, 
  EnvelopeClosedIcon, 
  LinkedInLogoIcon 
} from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import './globals.css';
import KaTeXLoader from "./components/KaTeXLoader";


const navLinks = [
  { href: '/',           label: 'HOME' },
  { href: '/tournament', label: 'LAMT 2026' },
  { href: '/rules',      label: 'RULES' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/about',      label: 'ABOUT' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'REGISTER', external: true },
];

const DISCORD_URL = 'https://discord.gg/cV6EHtfcD';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2774AE] dark:bg-black transition-colors duration-300">
      <div className="hidden md:flex items-center justify-between px-4 md:px-6 h-20 max-w-[1600px] mx-auto">
        <Link href="/" className="font-extrabold text-xl tracking-wide uppercase hover:opacity-70 transition-all flex items-center gap-3 text-white">
          <Image 
            src="/LAMTBear.png" 
            alt="Logo" 
            width={60} 
            height={60} 
            className="object-contain" 
          />
        </Link>

        <nav className="flex items-center gap-16">
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;
            const className = "font-extrabold text-xl tracking-widest uppercase hover:opacity-70 transition-opacity duration-200 text-white";
            return external ? (
              <a key={href} href={href} target="_blank" rel="noreferrer" className={className}>{label}</a>
            ) : (
              <Link key={href} href={href} className={className} style={{ textDecoration: active ? 'underline' : 'none', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="md:hidden flex items-center justify-between px-4 h-16">
        <Link href="/" className="font-extrabold text-lg tracking-wide uppercase flex items-center gap-2 text-white">
          <Image src="/LAMTBear.png" alt="Logo" width={28} height={28} className="object-contain" />
          LAMT
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-1">
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
    </header>
  );
}

function Footer() {
  const socialLinks = [
    { title: 'Email',     href: 'mailto:team@lamt.net',                                 icon: <EnvelopeClosedIcon width={18} height={18} /> },
    { title: 'Instagram', href: 'https://www.instagram.com/lamathtournament/',          icon: <InstagramIcon /> },
    { title: 'Facebook',  href: 'https://www.facebook.com/groups/1429462591976204/',    icon: <FacebookIcon /> },
    { title: 'LinkedIn',  href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInLogoIcon width={18} height={18} /> },
    { title: 'Discord',   href: DISCORD_URL,                                            icon: <DiscordLogoIcon width={18} height={18} /> },
  ];

  return (
    <footer className="bg-[#2774AE] dark:bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-10">

          {/* Logo (left) */}
          <div className="flex justify-center lg:justify-start">
            <Link href="/" className="shrink-0 transition-transform hover:scale-105">
              <Image
                src="/LAMTBear.png"
                alt="LAMT Bear Logo"
                width={160}
                height={160}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Contact circles (center, nudged slightly right) */}
          <div className="flex justify-center pl-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex items-center gap-4"
            >
              {socialLinks.map((c) => (
                <motion.a
                  key={c.title}
                  variants={fadeUp}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={c.title}
                  className="
                    flex items-center justify-center
                    w-11 h-11 rounded-full
                    bg-white dark:bg-black
                    text-[#2774AE] dark:text-white
                    border-2 border-white dark:border-white
                    shadow-md
                    hover:scale-110 hover:shadow-xl
                    transition-all duration-200
                  "
                >
                  {c.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Non-affiliation text (right) */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-xs text-center lg:text-right">
              <p className="text-[11px] md:text-xs text-[#DAEBFE] leading-relaxed opacity-80">
                We are a student group acting independently of the University of California.
                We take full responsibility for our organization and this web site.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
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
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center bg-[#003B5C] dark:bg-white text-white dark:text-[#003B5C] shadow-lg transition-transform hover:scale-105"
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
      )}
    </button>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#DAEBFE] dark:bg-black min-h-screen transition-colors duration-300">
        <KaTeXLoader />
        <Navbar />
        <DarkModeToggle />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
