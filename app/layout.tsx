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

const navLinks = [
  { href: '/',           label: 'HOME' },
  { href: '/tournament', label: 'LAMT 2026' },
  { href: '/rules',      label: 'RULES' },
  { href: '/faq',        label: 'FAQ' },
  { href: '/about',      label: 'ABOUT' },
  { href: 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u', label: 'REGISTER', external: true },
];

const DISCORD_URL  = 'https://discord.gg/cV6EHtfcD';

/* ---------------- ANIMATIONS ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

/* ---------------- ICONS ---------------- */
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

/* ---------------- NAVBAR ---------------- */
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
      <div className="hidden md:flex items-center justify-between px-4 md:px-6 h-20 max-w-[1600px] mx-auto">
        <Link
          href="/"
          className="text-white font-extrabold text-lg tracking-wide uppercase hover:opacity-70 transition-all flex items-center gap-3"
        >
          {/* Logo on the LEFT */}
          <Image src="/LAMTBear.png" alt="Logo" width={32} height={32} className="brightness-0 invert" />
          Los Angeles Math Tournament
        </Link>

        {/* Doubled gap to 20 */}
        <nav className="flex items-center gap-20">
          {navLinks.map(({ href, label, external }) => {
            const active = pathname === href;
            const className = "text-white font-extrabold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity duration-200";

            if (external) {
              return (
                <a key={href} href={href} target="_blank" rel="noreferrer" className={className}>{label}</a>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={className}
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

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-white font-extrabold text-lg tracking-wide uppercase flex items-center gap-2">
          <Image src="/LAMTBear.png" alt="Logo" width={24} height={24} className="brightness-0 invert" />
          LAMT
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5">
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#2774AE] border-t border-white/10 px-4 py-5 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="text-white font-extrabold text-lg uppercase">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const socialLinks = [
    { title: 'Email',     val: 'team@lamt.net',        href: 'mailto:team@lamt.net', icon: <EnvelopeClosedIcon /> },
    { title: 'Instagram', val: '@lamathtournament',    href: 'https://www.instagram.com/lamathtournament/', icon: <InstagramIcon /> },
    { title: 'Facebook',  val: 'LAMT Community',       href: 'https://www.facebook.com/groups/1429462591976204/', icon: <FacebookIcon /> },
    { title: 'LinkedIn',  val: 'LA Math Tournament',   href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInLogoIcon /> },
    { title: 'Discord',   val: 'Join server',          href: DISCORD_URL, icon: <DiscordLogoIcon /> },
  ];

  return (
    <footer className="bg-[#2774AE] dark:bg-black text-white border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        
        {/* Horizontal Layout: Big Logo | Schpeal | Contact Grid */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
          
          {/* 1. Big Logo (160x160) - Home Link */}
          <Link href="/" className="shrink-0 transition-transform hover:scale-105">
            <div className="rounded-full border-2 border-white/20 p-2 bg-white/5 backdrop-blur-sm">
              <Image
                src="/LAMTBear.png"
                alt="LAMT Bear Logo"
                width={160}
                height={160}
                className="object-contain brightness-0 invert"
              />
            </div>
          </Link>

          {/* 2. The Schpeal */}
          <div className="max-w-xs text-center lg:text-left">
            <p className="text-xs md:text-sm text-[#DAEBFE] leading-relaxed opacity-80 mt-4">
              We are a student group acting independently of the University of California. 
              We take full responsibility for our organization and this web site.
            </p>
          </div>

          {/* 3. Contact Grid (Exactly as given, but py-2 to condense) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 w-full lg:w-auto"
          >
            {socialLinks.map((c) => (
              <motion.a
                key={c.title}
                variants={fadeUp}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-1 bg-[#2774AE] dark:bg-black px-6 py-2.5 hover:bg-[#005587] dark:hover:bg-[#1a1a1a] transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#8BB8E8] group-hover:text-white transition-colors">
                    {c.icon}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8BB8E8]">
                    {c.title}
                  </span>
                </div>
                <span className="text-[11px] text-[#DAEBFE] group-hover:text-white transition-colors truncate">
                  {c.val}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- DARK MODE & ROOT ---------------- */
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
        <Navbar />
        <DarkModeToggle />
        <main className="pt-20 min-h-[calc(100vh-200px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
