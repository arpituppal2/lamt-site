import { type ReactNode } from 'react';
import NavbarClient from './components/NavbarClient';
import FooterClient from './components/FooterClient';
import DarkModeToggle from './components/DarkModeToggle';
import KaTeXLoader from './components/KaTeXLoader';
import EmailPopup from './components/EmailPopup';
import AnimationEngine from './components/AnimationEngine';
import './globals.css';

export const metadata = {
  title: 'LAMT 2026',
  description: 'Los Angeles Math Tournament 2026',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <KaTeXLoader />
        <AnimationEngine />
        <NavbarClient />
        <DarkModeToggle />
        <main>{children}</main>
        <FooterClient />
        <EmailPopup />
      </body>
    </html>
  );
}
