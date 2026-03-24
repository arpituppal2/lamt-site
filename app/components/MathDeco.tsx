'use client';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  let html = '';
  
  try {
    // Generate the raw HTML string from the latex
    html = katex.renderToString(latex, {
      throwOnError: false, // Prevents the whole app from crashing if a slash is missed
      displayMode: true,
      colorIsTextColor: true, // Tells KaTeX to respect parent text color
    });
  } catch (e) {
    console.error("KaTeX Error:", e);
  }

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
