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

  const eligibility = [
    'Students must be in grade 12 or below at the time of participation (May 2026).',
    'Teams may consist of at most 6 students.',
    'Students on eligible teams must come from the same school or organization, but there are no geographical restrictions.',
    'One school or organization may apply to send multiple eligible teams to compete. However, we require each team to have their own accompanying chaperone throughout the event.',
    'Students who are not able to form an eligible team are also able to apply to compete as an individual. Please note that each individual must have their own accompanying chaperone.',
  ];

  const format = [
    { name: 'Individual Rounds', desc: 'Each individual round consists of 10 questions plus a tiebreaker problem, with a 50-minute time limit. Topics may vary by round.' },
    { name: 'Mystery Round', desc: 'Format to be determined. Details will be released closer to the tournament date.' },
    { name: 'Guts Round', desc: 'A standard guts round consisting of 8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in order. Any topics from the individual rounds may also appear on team exams.' },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Tournament</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">LAMT 2026: May 17, 2026</h1>
          <p className="page-summary mt-5">
            LAMT 2026 will take place on <strong>May 17, 2026</strong> on the UCLA Campus. We will be inviting approximately <strong>250 students (~60-75 teams)</strong> to compete. There is <strong>no registration fee</strong> for this tournament, but each participant is responsible for their own travel, housing, and related expenses.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Eligibility</h2>
        <ul className="dash-list">
          {eligibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-row">
        <h2 className="section-title">Format</h2>
        <div className="grid gap-6">
          {format.map(({ name, desc }) => (
            <div key={name} className="border-t-2 border-[var(--color-border)] pt-5 first:border-t-0 first:pt-0">
              <h3 className="font-extrabold text-[var(--color-text)]">{name}</h3>
              <p className="section-copy mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Tentative Schedule</h2>
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

      <section className="section-row">
        <h2 className="section-title">Location</h2>
        <div>
          <p className="section-copy mb-6">
            The tournament will be held at the <strong>Court of Sciences</strong> on the UCLA campus in Los Angeles, California.
          </p>
          <div className="h-[360px] border-2 border-[var(--color-border)]">
            <iframe
              title="Court of Sciences UCLA map"
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7!2d-118.4417!3d34.0683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85b3b3b3b3%3A0x0!2sCourt+of+Sciences%2C+UCLA!5e0!3m2!1sen!2sus!4v1617000000000!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u" target="_blank" rel="noopener noreferrer" className="btn-outline">
            Register Now
          </a>
          <a href="/live" className="btn-filled">
            Tournament Day Site
          </a>
        </div>
      </section>
    </div>
  );
}
