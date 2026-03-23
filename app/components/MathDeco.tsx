'use client';
import { useEffect, useRef, memo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathDecoProps {
  latex: string;
  className?: string;
}

// 1. Give the inner function a name (Fixes ESLint "display-name" error)
const MathDeco = memo(function MathDeco({ latex, className = '' }: MathDecoProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    // 2. Check if window exists (Prevents SSR errors on Vercel)
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting && ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: false,
        });
      } catch (error) {
        console.error("KaTeX render error:", error);
      }
    }
  }, [isIntersecting, latex]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none absolute opacity-20 text-slate-200 ${className}`}
      style={{ minWidth: '50px', minHeight: '20px' }}
    />
  );
});

// 3. Explicitly set display name for debugging/linting
MathDeco.displayName = 'MathDeco';

export default MathDeco;
