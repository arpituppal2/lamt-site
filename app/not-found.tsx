import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3% 3% 0',
      textAlign: 'center',
    }}>
      {/* ── Gold rule at top */}
      <div style={{ width: '2.5rem', height: 2, background: 'var(--ucla-gold)', marginBottom: '2rem' }} />

      {/* ── 404 */}
      <p
        aria-hidden
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(5rem, 18vw, 9rem)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'var(--color-border)',
          marginBottom: '1.5rem',
          fontVariantNumeric: 'tabular-nums',
          userSelect: 'none',
        }}
      >
        404
      </p>

      {/* ── Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          color: 'var(--color-text)',
          lineHeight: 1.15,
          marginBottom: '1rem',
          letterSpacing: '-0.01em',
        }}
      >
        Page not found.
      </h1>

      {/* ── Gold accent line under heading */}
      <div style={{ width: '2.5rem', height: 2, background: 'var(--ucla-gold)', marginBottom: '1.25rem' }} />

      {/* ── Subtext */}
      <p
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          lineHeight: 1.65,
          maxWidth: 420,
          marginBottom: '0.5rem',
        }}
      >
        This URL doesn't resolve to a page — much like{' '}
        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>x = x + 1</span>{' '}
        doesn't resolve to a value.
      </p>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-faint)',
          lineHeight: 1.65,
          maxWidth: 380,
          marginBottom: '2.5rem',
        }}
      >
        You may have mistyped the URL, or this page was removed. Either way, no partial credit.
      </p>

      {/* ── CTA */}
      <Link href="/" className="btn-filled" style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Return to lamt.net
      </Link>
    </div>
  );
}
