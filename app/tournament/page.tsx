import Link from 'next/link';

export default function TournamentPage() {
  const schedule = [
    { time: '8:00 AM', event: 'Contestant Check-In', location: 'Outside MS 4000A' },
    { time: '8:45 AM', event: 'Opening Ceremony', location: 'MS 4000A' },
    { time: '9:15 AM', event: 'Secret Team Round', location: 'MS 4000A, 5200' },
    { time: '10:30 AM', event: 'Algebra / Number Theory', location: 'MS 4000A, 5200' },
    { time: '11:30 AM', event: 'Combinatorics', location: 'MS 4000A, 5200' },
    { time: '12:30 PM', event: 'Lunch & Disputes', location: 'Court of Sciences' },
    { time: '1:30 PM', event: 'Geometry', location: 'MS 4000A, 5200' },
    { time: '2:45 PM', event: 'Guts Round', location: 'MS 4000A, 5200' },
    { time: '4:15 PM', event: 'Activities', location: 'MS 4000A, 5200' },
    { time: '6:00 PM', event: 'Awards Ceremony', location: 'MS 4000A' },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <h1 className="page-title hero-animate-words">
          <span className="word">LAMT</span>{' '}
          <span className="word">2026</span>
        </h1>
        <p className="page-summary mt-5">
          On <strong>May 17, 2026</strong>, LAMT welcomed <strong>180+ students</strong> from{' '}
          <strong>8 counties</strong> to the UCLA campus for a free, national-stage team math
          tournament. Problems, solutions, and results live in the archive.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/archive" className="btn-filled">
            Open Archive
          </Link>
          <Link href="/#email-signup" className="btn-outline">
            Get notified for next year
          </Link>
        </div>
      </header>

      <section className="section-row reveal">
        <h2 className="section-title">Day Schedule</h2>
        <div className="overflow-x-auto">
          <table className="lamt-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(({ time, event, location }) => (
                <tr key={`${time}-${event}`}>
                  <td className="tabular-nums text-[var(--color-text-secondary)]">{time}</td>
                  <td className="font-bold text-[var(--color-text)]">{event}</td>
                  <td className="text-[var(--color-text-secondary)]">{location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-row reveal">
        <h2 className="section-title">What&rsquo;s next</h2>
        <div>
          <p className="section-copy mb-6">
            LAMT Blue (middle school and below) and LAMT Gold (high school and below) are planned for
            2027. Exact dates will be announced by email.
          </p>
          <Link href="/#email-signup" className="btn-filled">
            Sign up for emails
          </Link>
        </div>
      </section>
    </div>
  );
}
