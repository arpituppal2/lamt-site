'use client';

import { useEffect, useRef } from 'react';

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const tryRender = () => {
      if (ref.current && (window as any).katex) {
        try {
          (window as any).katex.render(latex, ref.current, {
            throwOnError: false,
            displayMode: true,
          });
        } catch (e) {
          // silently ignore render errors
        }
        clearInterval(interval);
      }
    };

    // Poll every 100ms until katex is available on window
    interval = setInterval(tryRender, 100);
    tryRender(); // also try immediately

    return () => clearInterval(interval);
  }, [latex]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
