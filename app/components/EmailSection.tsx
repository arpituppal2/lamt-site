import SubscribeForm from "./SubscribeForm";

export default function EmailSection() {
  return (
    <section id="email-signup" className="page-shell border-t-4 border-[var(--ucla-gold)] bg-[var(--color-surface-2)]">
      <div className="stagger-parent grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="page-title">Be first to know.</h2>
          <p className="page-summary mt-5">
            LAMT Blue (middle school and below) and LAMT Gold (high school and below) are planned for
            2027. Sign up for emails and we&#39;ll tell you when registration opens.
          </p>
        </div>
        <div>
          <SubscribeForm buttonLabel="Sign up for emails" />
        </div>
      </div>
    </section>
  );
}
