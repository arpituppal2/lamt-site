import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-shell grid min-h-screen place-items-center text-center">
      <section className="max-w-2xl">
        <p className="mb-4 text-8xl font-extrabold tabular-nums text-[var(--color-border-strong)]">404</p>
        <h1 className="text-4xl font-extrabold text-[var(--color-text)]">Page not found.</h1>
        <span className="gold-rule mx-auto mb-6" />
        <p className="section-copy mb-8">
          This URL does not resolve to a page. You may have mistyped the URL, or this page was removed.
        </p>
        <Link href="/" className="btn-filled">
          Return to lamt.net
        </Link>
      </section>
    </div>
  );
}
