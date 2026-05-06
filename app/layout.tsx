import { type ReactNode } from 'react';
import NavbarClient from './components/NavbarClient';
import FooterClient from './components/FooterClient';
import DarkModeToggle from './components/DarkModeToggle';
import KaTeXLoader from './components/KaTeXLoader';
import './globals.css';

export const metadata = {
  title: 'LAMT 2026',
  description: 'Los Angeles Math Tournament 2026',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#DAEBFE] dark:bg-black min-h-screen transition-colors duration-300">
        <KaTeXLoader />
        <NavbarClient />
        <DarkModeToggle />
        <main>{children}</main>
        <FooterClient />
      </body>
    </html>
  );
}
