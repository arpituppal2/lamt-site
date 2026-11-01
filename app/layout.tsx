import { type ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import NavbarClient from './components/NavbarClient';
import FooterClient from './components/FooterClient';
import DarkModeToggle from './components/DarkModeToggle';
import KaTeXLoader from './components/KaTeXLoader';
import AnimationEngine from './components/AnimationEngine';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lamt.net'),
  title: {
    default: 'Los Angeles Math Tournament',
    template: '%s · LAMT',
  },
  description:
    'Free UCLA-hosted math tournament for students in grade 12 or below. Sign up for emails for LAMT Blue and LAMT Gold.',
  applicationName: 'LAMT',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'Los Angeles Math Tournament',
    title: 'Los Angeles Math Tournament',
    description:
      'Free UCLA-hosted math tournament for students in grade 12 or below.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'LAMT' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Los Angeles Math Tournament',
    description:
      'Free UCLA-hosted math tournament for students in grade 12 or below.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2774AE' },
    { media: '(prefers-color-scheme: dark)', color: '#031522' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('lamt-theme');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen transition-colors duration-300">
        <KaTeXLoader />
        <AnimationEngine />
        <NavbarClient />
        <DarkModeToggle />
        <main>{children}</main>
        <FooterClient />
      </body>
    </html>
  );
}
