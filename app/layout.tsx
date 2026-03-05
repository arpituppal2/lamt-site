import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LAMT 2026 | Los Angeles Math Tournament',
  description:
    'Los Angeles Math Tournament — May 23, 2026. A premier one-day math competition for middle and high school students in Southern California, hosted at UCLA.',
};

const footerLinks = ['About', 'Schedule', 'FAQ', 'Contact', 'Register'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        <NavBar />
        {children}

        <footer className="bg-[#003B5C] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-[#2774AE] rounded flex items-center justify-center">
                    <span className="text-[#FFD100] font-black text-[11px]">LA</span>
                  </div>
                  <span className="font-extrabold text-lg">LAMT 2026</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  A student-run mathematics competition hosted at UCLA, celebrating mathematical curiosity and excellence across Southern California.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Navigation</h3>
                <ul className="space-y-2">
                  {footerLinks.map((label) => (
                    <li key={label}>
                      <Link
                        href={`/${label.toLowerCase()}`}
                        className="text-slate-300 text-sm hover:text-[#FFD100] transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contact</h3>
                <a
                  href="mailto:lamt2026@gmail.com"
                  className="text-slate-300 text-sm hover:text-[#FFD100] transition-colors"
                >
                  lamt2026@gmail.com
                </a>
                <p className="text-slate-400 text-sm mt-2">UCLA Campus</p>
                <p className="text-slate-400 text-sm">Los Angeles, CA</p>
              </div>
            </div>

            <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
              <p>&copy; 2026 Los Angeles Math Tournament. All rights reserved.</p>
              <p>Hosted at UCLA &middot; May 23, 2026</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
