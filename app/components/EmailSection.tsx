import SubscribeForm from "./SubscribeForm";

export default function EmailSection() {
  return (
    <section className="page-shell border-t-4 border-[var(--ucla-gold)] bg-[var(--color-surface-2)]">
      <div className="section-row">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="serif-kicker serif-kicker--blue">Stay in the Loop</p>
            <h2 className="page-title mt-4">We&apos;re just getting started.</h2>
            <p className="page-summary mt-5">
              LAMT 2026 brought 180+ students from 8 counties to UCLA — and it&apos;s only the first one. Join the list and be
              first to know when the next tournament is announced.
            </p>
          </div>
          <div>
            <SubscribeForm buttonLabel="Keep Me Posted" />
          </div>
        </div>
      </div>
    </section>
  );
}