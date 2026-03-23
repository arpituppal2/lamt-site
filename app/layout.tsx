import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LAMT 2026 | Los Angeles Math Tournament',
  description:
    'Los Angeles Math Tournament — May 17, 2026. An international high school math competition hosted at UCLA. All students are encouraged to apply.',
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
                  An international high school math competition hosted at UCLA. All students are encouraged to apply.
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
                <div className="space-y-2 text-sm">
                  <div>
                    <a
                      href="mailto:uclamathtournament@gmail.com"
                      className="text-slate-300 hover:text-[#FFD100] transition-colors"
                    >
                      uclamathtournament@gmail.com
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://fb.me/g/6xUwpXU1F/C1KP5svv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-[#FFD100] transition-colors"
                    >
                      Facebook Group
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://www.instagram.com/lamathtournament/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-[#FFD100] transition-colors"
                    >
                      Instagram @lamathtournament
                    </a>
                  </div>
                  <p className="text-slate-400 mt-2">UCLA <br />Los Angeles, CA</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
              <span>© 2026 Los Angeles Math Tournament. All rights reserved.</span>
              <span>Hosted at UCLA · May 17, 2026</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
