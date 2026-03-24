'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(latex, ref.current, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (e) {
      console.error('KaTeX render error:', e);
    }
  }, [latex]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
