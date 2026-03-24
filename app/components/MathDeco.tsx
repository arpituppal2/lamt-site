// MathDeco.tsx
'use client';
import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathDecoProps {
  latex: string;
  className?: string;
  tone?: 'primary' | 'gold' | 'muted'; // optional style hint
}

export default function MathDeco({ latex, className = '', tone = 'muted' }: MathDecoProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(latex, ref.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [latex]);

  const toneClass =
    tone === 'primary'
      ? 'text-white drop-shadow-[0_0_18px_rgba(0,0,0,0.85)]'
      : tone === 'gold'
      ? 'text-[#FFD100] drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]'
      : 'text-slate-200/90 drop-shadow-[0_0_14px_rgba(0,0,0,0.85)]';

  return (
    <span
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none ${toneClass} ${className}`}
    />
  );
}
