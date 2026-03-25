'use client';

import { useEffect } from 'react';

export default function KaTeXLoader() {
  useEffect(() => {
    if ((window as any).katex) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.async = true;
    script.onload = () => {
      console.log('KaTeX loaded and ready on window.katex');
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
