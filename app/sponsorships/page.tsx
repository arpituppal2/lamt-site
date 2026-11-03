import SponsorsSection from '../components/SponsorsSection';
import { getSponsorsByTier } from '../lib/sponsors';

export default function SponsorshipsPage() {
  const sponsorsByTier = getSponsorsByTier();

  return (
    <div>
      <div className="page-shell">
        <header className="page-hero">
          <h1 className="page-title hero-animate-words">
            <span className="word">Sponsor</span>{' '}
            <span className="word">LAMT</span>
          </h1>
          <p className="page-summary mt-5">
            Help us bring LAMT Blue (middle school and below) and LAMT Gold (high school and below)
            to life. Our sponsorship packet has everything you need to partner with us.
          </p>
        </header>

        <section className="section-row reveal">
          <h2 className="section-title">Sponsorship Packet</h2>
          <div>
            <p className="section-copy">
              Download the full LAMT 2026–27 sponsorship overview, including audience reach, sponsor
              benefits, and partnership tiers.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/sponsors/LAMT_Sponsorship_26_27.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn-filled"
              >
                Download Sponsorship Packet (PDF)
              </a>
              <a href="mailto:info@lamt.net" className="btn-outline">
                Contact Us
              </a>
            </div>
          </div>
        </section>

        <section className="section-row reveal">
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

        <section className="section-row reveal">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-copy">
            Questions about sponsorship or interested in a custom partnership? Email us at{' '}
            <a className="subtle-link" href="mailto:info@lamt.net">
              info@lamt.net
            </a>
            .
          </p>
        </section>
      </div>

      <SponsorsSection sponsorsByTier={sponsorsByTier} showPacketCta={false} />
    </div>
  );
}
