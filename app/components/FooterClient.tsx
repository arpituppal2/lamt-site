'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DiscordLogoIcon, EnvelopeClosedIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

const DISCORD_URL = 'https://discord.gg/cV6EHtfcD';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="2" y="2" width="20" height="20" />
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
    { title: 'Email', href: 'mailto:team@lamt.net', icon: <EnvelopeClosedIcon width={18} height={18} /> },
    { title: 'Instagram', href: 'https://www.instagram.com/lamathtournament/', icon: <InstagramIcon /> },
    { title: 'Facebook', href: 'https://www.facebook.com/groups/1429462591976204/', icon: <FacebookIcon /> },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/la-math-tournament/', icon: <LinkedInLogoIcon width={18} height={18} /> },
    { title: 'Discord', href: DISCORD_URL, icon: <DiscordLogoIcon width={18} height={18} /> },
  ];

  return (
    <footer className="site-footer site-pad">
      <div className="site-footer__inner">
        <Link href="/" className="site-footer__brand" aria-label="LAMT home">
          <Image src="/LAMTBear.png" alt="LAMT Bear Logo" width={96} height={96} className="site-footer__mark" />
          <div>
            <p>Los Angeles Math Tournament</p>
            <strong>LAMT 2026</strong>
          </div>
        </Link>

        <div className="site-footer__socials">
          {socialLinks.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.title}
              className="site-social-link"
            >
              {item.icon}
            </a>
          ))}
        </div>

        <p className="site-footer__note">
          We are a student group acting independently of the University of California. We take full responsibility for our organization and this web site.
        </p>
      </div>
    </footer>
  );
}
