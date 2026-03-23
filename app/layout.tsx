'use client';
import './globals.css';
import NavBar from './components/NavBar';
import PremiumLogic from './components/PremiumLogic';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
      </head>
      <body className="bg-[#003B5C] text-slate-200 antialiased font-sans selection:bg-[#FFD100] selection:text-[#003B5C] overflow-x-hidden">
        <PremiumLogic />
        <div id="cursor" className="hidden md:block" />
        <div id="cursor-ring" className="hidden md:block" />
        <div id="scroll-progress" />
        
        <NavBar />
        <main className="min-h-screen">{children}</main>

        <footer className="bg-[#002B44]/80 backdrop-blur-md border-t border-white/5 py-12 mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2774AE] rounded-lg flex items-center justify-center">
                  <span className="text-[#FFD100] font-black text-[10px]">LA</span>
                </div>
                <span className="font-bold text-lg tracking-tight">LAMT 2026</span>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {['About', 'Schedule', 'FAQ', 'Contact', 'Register'].map((label) => (
                  <Link 
                    key={label}
                    href={`/${label.toLowerCase()}`} 
                    className="text-slate-400 hover:text-[#FFD100] transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                © 2026 Los Angeles Math Tournament · Hosted at UCLA
              </p>
              <div className="flex gap-6">
                <a href="mailto:uclamathtournament@gmail.com" className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Email</a>
                <a href="https://www.instagram.com/lamathtournament/" className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Instagram</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
