'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DiscordLogoIcon, EnvelopeClosedIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

const DISCORD_URL = 'https://discord.gg/tqR3bGjVke';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function FooterClient() {
  const socialLinks = [
    { title: 'Email', href: 'mailto:info@lamt.net', icon: <EnvelopeClosedIcon width={18} height={18} /> },
    { title: 'Instagram', href: 'https://www.instagram.com/lamathtournament/', icon: <InstagramIcon /> },
    { title: 'Facebook', href: 'https://www.facebook.com/groups/1429462591976204/', icon: <FacebookIcon /> },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInLogoIcon width={18} height={18} /> },
    { title: 'Discord', href: DISCORD_URL, icon: <DiscordLogoIcon width={18} height={18} /> },
  ];

  return (
    <footer className="bg-[var(--ucla-blue)] text-white dark:bg-[#000000]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">
        {/* Equal columns so the social cluster is true-center, not space-between skewed */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="transition-transform hover:scale-105">
              <Image src="/LAMTBear.png" alt="LAMT Bear Logo" width={120} height={120} className="object-contain" />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4 justify-self-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.title}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-[var(--ucla-blue)] shadow-md transition-all duration-200 hover:scale-110 hover:shadow-xl"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <Link
              href="/sponsorships"
              className="text-xs font-extrabold uppercase tracking-[0.14em] text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-[var(--ucla-gold)] hover:decoration-[var(--ucla-gold)]"
            >
              Sponsorships
            </Link>
          </div>

          <div className="w-full max-w-xs justify-self-center text-center md:justify-self-end md:text-right">
            <p className="text-[11px] leading-relaxed text-white/85 md:text-xs md:text-right">
              We are a student group acting independently of the University of California.
              We take full responsibility for our organization and this web site.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
