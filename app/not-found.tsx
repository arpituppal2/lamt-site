import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#2774AE] dark:bg-black flex flex-col items-center justify-center text-center px-6 overflow-hidden relative transition-colors duration-300">
      {/* dot-grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #FFD100 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* faded bear */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <Image
          src="/LAMTBear.png"
          alt=""
          width={600}
          height={600}
          className="h-[70vh] w-auto object-contain opacity-10 dark:opacity-20"
          priority
        />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        {/* 404 */}
        <p
          className="text-[clamp(5rem,20vw,10rem)] font-bold leading-none text-white/20 select-none tabular-nums"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          aria-hidden
        >
          404
        </p>

        <h1
          className="text-[clamp(1.6rem,5vw,2.8rem)] font-bold text-white leading-tight mt-2 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          This page doesn't exist.<br />
          <span style={{ color: '#FFD100' }}>Unlike the answer to problem 3.</span>
        </h1>

        <p className="text-[#DAEBFE] text-base leading-relaxed max-w-sm mx-auto mb-8">
          You've wandered somewhere off-campus. Maybe you mistyped the URL, maybe
          a link is broken, or maybe you were trying to find the Guts Round answer key.
          Either way — not here.
        </p>

        <Link
          href="/"
          className="btn-outline inline-flex items-center gap-3 group"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to lamt.net</span>
        </Link>
      </div>
    </div>
  );
}
