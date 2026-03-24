'use client';

import { useEffect, useRef } from 'react';

// We will assume KaTeX JS + CSS come from CDN (see layout.tsx change below)
declare const katex: any;

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // If KaTeX hasn't loaded yet, try again shortly
    if (!ref.current || typeof window === 'undefined' || !(window as any).katex) {
      const id = setTimeout(() => {
        if (ref.current && (window as any).katex) {
          (window as any).katex.render(latex, ref.current, {
            throwOnError: false,
            displayMode: true,
          });
        }
      }, 200);
      return () => clearTimeout(id);
    }

    // Normal render path
    (window as any).katex.render(latex, ref.current, {
      throwOnError: false,
      displayMode: true,
    });
  }, [latex]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
