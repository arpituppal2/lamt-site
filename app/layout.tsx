import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LAMT 2026 | Los Angeles Math Tournament',
  description: 'Los Angeles Math Tournament — May 23, 2026. A premier math competition for middle and high school students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans antialiased">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-lg text-[#2774AE]">LAMT 2026</a>
            <div className="flex gap-6 text-sm font-medium">
              <a href="/about" className="hover:text-[#2774AE]">About</a>
              <a href="/schedule" className="hover:text-[#2774AE]">Schedule</a>
              <a href="/faq" className="hover:text-[#2774AE]">FAQ</a>
              <a href="/contact" className="hover:text-[#2774AE]">Contact</a>
              <a href="/register" className="bg-[#2774AE] text-white px-4 py-1.5 rounded-md hover:bg-blue-700">Register</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-slate-900 text-slate-400 text-center text-sm py-6 mt-16">
          <p>Los Angeles Math Tournament 2026 &mdash; May 23, 2026</p>
          <p className="mt-1">Contact: <a href="mailto:lamt2026@gmail.com" className="underline">lamt2026@gmail.com</a></p>
        </footer>
      </body>
    </html>
  );
}
