export default function SponsorshipsPage() {
  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Sponsorship</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title hero-animate-words">
            <span className="word">Sponsor</span>
            <span className="word">LAMT</span>
          </h1>
          <p className="page-summary reveal mt-5">
            Help us bring LAMT Blue (middle school and below) and LAMT Gold (high school and below)
            to life. Our sponsorship packet has everything you need to partner with us.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Sponsorship Packet</h2>
        <p className="section-copy mt-4">
          Download the full LAMT 2026–27 sponsorship overview, including audience reach, sponsor
          benefits, and partnership tiers.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="/sponsors/LAMT_Sponssorship_26_27.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-filled"
          >
            Download Sponsorship Packet (PDF)
          </a>
          <a href="mailto:uclamathtournament@gmail.com" className="btn-outline">
            Contact Us
          </a>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Why Sponsor LAMT?</h2>
        <div className="stagger-parent grid gap-5">
          <p className="section-copy">
            LAMT is a student-run math tournament serving middle and high school students across
            Los Angeles. Your support keeps the competition accessible and helps us grow the program
            year after year.
          </p>
          <p className="section-copy">
            Sponsors receive visibility across our website, emails, tournament-day materials, and
            social channels — reaching students, parents, teachers, and coaches throughout the
            Southern California math community.
          </p>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-copy">
          Questions about sponsorship or interested in a custom partnership? Email us at{' '}
          <a className="subtle-link" href="mailto:uclamathtournament@gmail.com">
            uclamathtournament@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
