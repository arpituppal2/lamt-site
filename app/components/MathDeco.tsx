'use client';

interface MathDecoProps {
  latex: string;
  className?: string;
}

export default function MathDeco({ latex, className = '' }: MathDecoProps) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      $${latex}$$
    </div>
  );
}
