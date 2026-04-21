export default function RulesPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-16 max-w-4xl mx-auto">
      <h1 className="font-bold text-[var(--color-text)] leading-tight mb-6"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        Rules
      </h1>
      <div className="gold-rule mb-16" />

      {/* Test Format */}
      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Test Format</h2>
        <div className="space-y-6">
          {[
            {
              name: 'Individual Rounds',
              desc: '10 questions plus a tiebreaker problem. 50-minute time limit per round. Topics vary by round.',
            },
            {
              name: 'Mystery Round',
              desc: 'Format to be determined and announced closer to the tournament date.',
            },
            {
              name: 'Guts Round',
              desc: '8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in sequential order. Any topics from the individual rounds may also appear on team exams.',
            },
          ].map(({ name, desc }) => (
            <div key={name} className="border-t border-[var(--color-border)] pt-6">
              <p className="text-[var(--color-text)] font-medium mb-2">{name}</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honor Code */}
      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Honor Code</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          We expect that when taking their individual tests, the only aid or resource students will use
          are those explicitly specified below. In particular, students may not access the internet or
          communicate with other people. For team-based tests, students may certainly communicate with
          their teammates but otherwise the same expectations hold.
        </p>

        <p className="text-[var(--color-text)] font-medium mb-4">The following may not be used during any testing portion of the contest:</p>
        <ul className="space-y-3 mb-8">
          {[
            'Calculators',
            'Other computational aids, such as slide rulers and abaci',
            'Reference materials, such as books and notes',
            'Communication devices, such as cell phones and computers',
            'Any drawing aids',
            'Rulers, compasses, protractors, and graph paper',
          ].map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="text-[var(--color-gold)] font-bold text-sm mt-0.5 shrink-0">&#x2014;</span>
              <span className="text-[var(--color-text-secondary)] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
          Students participating in-person agree not to discuss exam questions until all students have
          left the examination hall, or to post them online until 96 hours after the tournament has
          concluded. They understand that failure to abide by this can and will lead to disqualification
          and being banned from LAMT events.
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          By choosing to participate in the Los Angeles Math Tournament, one agrees to uphold academic
          integrity and abide by the{' '}
          <a
            href="https://studentconduct.ucla.edu/2026-individual-student-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-gold)] hover:underline underline-offset-4"
          >
            UCLA Student Code
          </a>.
        </p>
      </section>

      {/* Acceptable Answers */}
      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Acceptable Answers</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          Answers must be written in correct mathematical notation. No partial credit will be awarded
          except for the proofs on the Power Round. Unless otherwise specified, all answers must be
          exact and simplified. Graders will take a reasonably lenient interpretation of
          &ldquo;simplified.&rdquo; The decisions of the LAMT coordinators are final.
        </p>

        <p className="text-[var(--color-text)] font-medium mb-6">General guidelines for answer simplification:</p>
        <ul className="space-y-4 mb-12">
          {[
            'Carry out any reasonable calculations. For instance, evaluate expressions which take negligible time to compute (such as ½ + ⅓). Unreasonable calculations include large powers (e.g. 7⁸), large factorials, large products, and trigonometric functions which cannot be expressed in terms of radicals.',
            'Write rational numbers in lowest terms. Decimals are also acceptable, provided they are exact.',
            'Move all square factors outside radicals. For example, write 3√7 instead of √63.',
            'Denominators need to be rationalized. For example, write 1/√2 as √2/2 instead.',
            'Do not express an answer using a repeated sum or product.',
          ].map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="text-[var(--color-gold)] font-bold text-sm mt-0.5 shrink-0">&#x2014;</span>
              <span className="text-[var(--color-text-secondary)] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        {/* Simplified vs Unsimplified Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 pr-8 text-[var(--color-text)] font-medium">Simplified</th>
                <th className="text-left py-3 pr-8 text-[var(--color-text)] font-medium">Unsimplified</th>
                <th className="text-left py-3 text-[var(--color-text)] font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              {[
                { simplified: '5/6', unsimplified: '10/12', notes: 'Reduce fractions to lowest terms' },
                { simplified: '3√7', unsimplified: '√63', notes: 'Move square factors outside radicals' },
                { simplified: '√2/2', unsimplified: '1/√2', notes: 'Rationalize the denominator' },
                { simplified: '7/4', unsimplified: '1.75', notes: 'Either form acceptable if exact' },
                { simplified: '5/6', unsimplified: '0.8333...', notes: 'Non-terminating decimals not accepted' },
              ].map(({ simplified, unsimplified, notes }, i) => (
                <tr key={i} className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 pr-8 font-mono text-[var(--color-text)]">{simplified}</td>
                  <td className="py-3 pr-8 font-mono line-through opacity-50">{unsimplified}</td>
                  <td className="py-3">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
