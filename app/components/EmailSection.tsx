import SubscribeForm from "./SubscribeForm";

export default function EmailSection() {
  return (
    <section id="email-signup" className="page-shell border-t-4 border-[var(--ucla-gold)] bg-[var(--color-surface-2)]">
      <div className="stagger-parent section-row gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="page-title">Be first to know.</h2>
          <p className="page-summary mt-5">
            Join the LAMT email list. We&apos;ll email you when details for the next tournament are ready.
          </p>
        </div>
        <div>
          <SubscribeForm buttonLabel="Sign up for emails" />
        </div>
      </div>
    </section>
  );
}
