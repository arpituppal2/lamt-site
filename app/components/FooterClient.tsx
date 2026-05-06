'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { DiscordLogoIcon, EnvelopeClosedIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

const DISCORD_URL = 'https://discord.gg/cV6EHtfcD';

const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

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

export default function FooterClient() {
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
          <div className="flex justify-center lg:justify-start">
            <Link href="/" className="shrink-0 transition-transform hover:scale-105">
              <Image src="/LAMTBear.png" alt="LAMT Bear Logo" width={160} height={160} className="object-contain" />
            </Link>
          </div>
          <div className="flex justify-center pl-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex items-center gap-4">
              {socialLinks.map((c) => (
                <motion.a key={c.title} variants={fadeUp} href={c.href} target="_blank" rel="noreferrer" aria-label={c.title}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-black text-[#2774AE] dark:text-white border-2 border-white dark:border-white shadow-md hover:scale-110 hover:shadow-xl transition-all duration-200"
                >{c.icon}</motion.a>
              ))}
            </motion.div>
          </div>
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
