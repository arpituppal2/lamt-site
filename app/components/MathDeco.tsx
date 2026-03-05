'use client';
import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(latex, ref.current, {
        throwOnError: false,
        displayMode: false,
      });
    }
  }, [latex]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`math-deco ${className}`}
    />
  );
}
