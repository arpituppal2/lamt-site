import SubscribeForm from "./SubscribeForm";

export default function EmailSection() {
  return (
    <section className="page-shell border-t-4 border-[var(--ucla-gold)] bg-[var(--color-surface-2)]">
      <div className="section-row">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="page-kicker">Stay in the Loop</p>
            <span className="gold-rule" />
            <h2 className="page-title mt-4">We&apos;re just getting started.</h2>
            <p className="page-summary mt-5">
              LAMT 2026 brought 180+ students from 8 counties to UCLA — and it&apos;s only the first one. Join the list and be
              first to know when the next tournament is announced.
            </p>
          </div>
          <div className="lamt-panel">
            <div className="lamt-panel-body">
              <SubscribeForm buttonLabel="Keep Me Posted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}