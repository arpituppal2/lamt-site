'use client';

import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar';
import Link from 'next/link';
import { useEffect } from 'react';

// metadata cannot be in client component, so we move it to a separate layout-metadata.ts or just handle it.
// For now, since I'm editing layout.tsx directly and it needs client logic for cursor/scroll, 
// I'll make it a client component. In a real Next.js app, we'd wrap this or use a client wrapper.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    const progressBar = document.getElementById('scroll-progress');

    const onMouseMove = (e: MouseEvent) => {
      if (cursor && ring) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
      }
    };

    const onScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (progressBar) progressBar.style.width = scrolled + '%';
      
      // Reveal system
      const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          el.classList.add('visible');
        }
      });
    };

    const onMouseEnter = () => document.body.classList.add('cursor-hover');
    const onMouseLeave = () => document.body.classList.remove('cursor-hover');

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);
    
    // Add hover listeners to all interactive elements
    const updateHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, .card-premium, .stat-item');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
        
        // Card mouse reactive lighting
        if (el.classList.contains('card-premium')) {
          el.addEventListener('mousemove', (e: any) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            (el as HTMLElement).style.setProperty('--mx', `${x}%`);
            (el as HTMLElement).style.setProperty('--my', `${y}%`);
          });
        }
      });
    };

    updateHoverListeners();
    onScroll(); // Initial check

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
      </head>
      <body className="bg-[#003B5C] text-slate-200 antialiased font-sans selection:bg-[#FFD100] selection:text-[#003B5C]">
        <div id="cursor"></div>
        <div id="cursor-ring"></div>
        <div id="scroll-progress"></div>
        
        <NavBar />
        {children}

        <footer className="bg-[#002B44] text-white border-t border-white/5 relative overflow-hidden">
          <div className="noise-overlay" />
          <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
            <div className="grid md:grid-cols-3 gap-16">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#2774AE] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-[#FFD100] font-black text-xs">LA</span>
                  </div>
                  <span className="font-black text-xl tracking-tight">LAMT 2026</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  An international high school math competition hosted at UCLA. 
                  Pushing the boundaries of mathematical challenge since inception.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD100] mb-8">Navigation</h3>
                <ul className="space-y-4">
                  {['About', 'Schedule', 'FAQ', 'Contact', 'Register'].map((label) => (
                    <li key={label}>
                      <Link 
                        href={`/${label.toLowerCase()}`} 
                        className="text-slate-400 hover:text-[#FFD100] transition-colors text-sm font-medium link-underline"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD100] mb-8">Connect</h3>
                <div className="space-y-4">
                  <a href="mailto:uclamathtournament@gmail.com" className="block text-slate-400 hover:text-white transition-colors text-sm link-underline">uclamathtournament@gmail.com</a>
                  <a href="https://www.instagram.com/lamathtournament/" className="block text-slate-400 hover:text-white transition-colors text-sm link-underline">Instagram @lamathtournament</a>
                  <div className="pt-4 text-slate-500 text-xs uppercase tracking-widest font-bold">
                    UCLA · LOS ANGELES, CA
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                © 2026 Los Angeles Math Tournament. All rights reserved.
              </p>
              <div className="flex items-center gap-8">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">Hosted at UCLA</span>
                <span className="w-1.5 h-1.5 bg-[#FFD100] rounded-full"></span>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">May 17, 2026</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
