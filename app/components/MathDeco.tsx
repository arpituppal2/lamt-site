'use client';
import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(latex, containerRef.current, {
        throwOnError: false, // Prevents crashes from syntax errors
        displayMode: true,
        colorIsTextColor: true, // Forces KaTeX to use Tailwind text colors
      });
    }
  }, [latex]);

  return (
    <span
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none select-none inline-block ${className}`}
    />
  );
}
