import SubscribeForm from "./SubscribeForm";

export default function EmailSection() {
  return (
    <section className="page-shell border-t-4 border-[var(--ucla-gold)] bg-[var(--color-surface-2)]">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="serif-kicker serif-kicker--blue">Stay in the Loop</p>
          <h2 className="page-title mt-4">Be first to know.</h2>
          <p className="page-summary mt-5 reveal">
            LAMT Blue (middle school and below) and LAMT Gold (high school and below) are coming in
            2027. Sign up for emails and we&#39;ll let you know when registration opens for each
            tournament.
          </p>
        </div>
        <div className="reveal">
          <SubscribeForm buttonLabel="Sign up for emails" />
        </div>
      </div>
    </section>
  );
}
