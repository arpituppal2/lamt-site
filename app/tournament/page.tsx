export default function TournamentPage() {
  const schedule = [
    { time: '8:00 AM',  event: 'Contestant Check-In',             location: 'Outside MS 4000A' },
    { time: '8:45 AM',  event: 'Opening Ceremony',                location: 'MS 4000A' },
    { time: '9:00 AM',  event: 'Secret Team Round',               location: 'MS 4000A, 5200' },
    { time: '10:45 AM', event: 'Algebra / Number Theory',         location: 'MS 4000A, 5200' },
    { time: '11:45 AM', event: 'Combinatorics',                   location: 'MS 4000A, 5200' },
    { time: '12:45 PM', event: 'Lunch & Disputes',                location: 'Court of Sciences' },
    { time: '1:45 PM',  event: 'Geometry',                        location: 'MS 4000A, 5200' },
    { time: '3:00 PM',  event: 'Guts Round',                      location: 'MS 4000A, 5200' },
    { time: '4:30 PM',  event: 'Activities',                      location: 'MS 4000A, 5200' },
    { time: '6:00 PM',  event: 'Awards Ceremony',                 location: 'MS 4000A' },
  ];

  return (
    <div className="pt-16 pb-24 px-4 md:px-8 max-w-5xl mx-auto">

      <h1 className="font-bold text-[var(--color-text)] leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
        LAMT &apos;26: May 17th, 2026
      </h1>
      <div className="gold-rule mb-16" />

      <section className="mb-20">
        <p className="text-[var(--color-text)] text-lg md:text-xl leading-relaxed max-w-2xl">
          LAMT 2026 will take place on <strong>May 17, 2026</strong> on the UCLA Campus. We will be inviting approximately <strong>250 students (~60&ndash;75 teams)</strong> to compete. There is <strong>no registration fee</strong> for this tournament, but each participant is responsible for their own travel, housing, and related expenses.
        </p>
      </section>

      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Eligibility</h2>
        <ul className="space-y-5">
          {[
            'Students must be in grade 12 or below at the time of participation (May 2026).',
            'Teams may consist of at most 6 students.',
            'Students on eligible teams must come from the same school or organization, but there are no geographical restrictions.',
            'One school or organization may apply to send multiple eligible teams to compete. However, we require each team to have their own accompanying chaperone throughout the event.',
            'Students who are not able to form an eligible team are also able to apply to compete as an individual. Please note that each individual must have their own accompanying chaperone.',
          ].map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="text-[var(--color-gold)] font-bold text-sm mt-0.5 shrink-0">&#x2014;</span>
              <span className="text-[var(--color-text-secondary)] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Format</h2>
        <div className="space-y-6">
          {[
            { name: 'Individual Rounds', desc: 'Each individual round consists of 10 questions plus a tiebreaker problem, with a 50-minute time limit. Topics may vary by round.' },
            { name: 'Mystery Round', desc: 'Format to be determined. Details will be released closer to the tournament date.' },
            { name: 'Guts Round', desc: 'A standard guts round consisting of 8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in order. Any topics from the individual rounds may also appear on team exams.' },
          ].map(({ name, desc }) => (
            <div key={name} className="border-t border-[var(--color-border)] pt-6">
              <p className="text-[var(--color-text)] font-medium mb-2">{name}</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Tentative Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[var(--color-border)] bg-transparent">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/5">
                <th className="p-4 text-left font-semibold text-[var(--color-text)] border-r border-[var(--color-border)] w-28">Time</th>
                <th className="p-4 text-left font-semibold text-[var(--color-text)] border-r border-[var(--color-border)]">Event</th>
                <th className="p-4 text-left font-semibold text-[var(--color-text)]">Location</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(({ time, event, location }, i) => (
                <tr key={i} className="border-b border-[var(--color-border)] last:border-b-0">
                  <td className="p-4 text-[var(--color-text-secondary)] border-r border-[var(--color-border)] tabular-nums whitespace-nowrap">{time}</td>
                  <td className="p-4 text-[var(--color-text)] font-medium border-r border-[var(--color-border)]">{event}</td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Location</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          The tournament will be held at the <strong>Court of Sciences</strong> on the UCLA campus in Los Angeles, California.
        </p>
        <div className="w-full rounded-sm overflow-hidden border border-[var(--color-border)]" style={{ height: '360px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7!2d-118.4417!3d34.0683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85b3b3b3b3%3A0x0!2sCourt+of+Sciences%2C+UCLA!5e0!3m2!1sen!2sus!4v1617000000000!5m2!1sen!2sus"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <div className="border-t border-[var(--color-border)] pt-12">
        <a href="https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u" target="_blank" rel="noopener noreferrer" className="btn-filled">
          REGISTER NOW
        </a>
      </div>
    </div>
  );
}
