export default function MathDeco({ latex, className = '' }: { latex: string; className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* We wrap the latex string in $$ so the CDN script catches it */}
      $${latex}$$
    </div>
  );
}
