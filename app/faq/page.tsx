'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Who is eligible to compete at LAMT?',
    a: 'Any student currently enrolled in grade 12 or below as of May 2026 is eligible. There are no geographical restrictions.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No. There is no registration fee for LAMT 2026. Each participant is responsible for their own travel, housing, and related expenses.',
  },
  {
    q: 'How large can a team be?',
    a: 'Teams may consist of at most 6 students. All students on a team must come from the same school or organization.',
  },
  {
    q: 'Can I compete as an individual?',
    a: 'Yes. Students who are not able to form an eligible team may apply to compete as an individual. Each individual competitor must have their own accompanying chaperone.',
  },
  {
    q: 'Can a school send more than one team?',
    a: 'Yes. One school or organization may apply to send multiple eligible teams. Each team must have their own accompanying chaperone throughout the event.',
  },
  {
    q: 'What topics are covered on the individual rounds?',
    a: 'Topics vary by individual round. Any topics from the individual rounds may also appear on team exams. Specific subject areas will be announced closer to the event.',
  },
  {
    q: 'What is the format of the Guts Round?',
    a: 'The Guts Round consists of 8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in sequential order.',
  },
  {
    q: 'Are calculators allowed?',
    a: 'No. Calculators and all other computational aids are strictly prohibited during all testing portions of the contest.',
  },
  {
    q: 'Where will LAMT 2026 take place?',
    a: 'LAMT 2026 will be held on the UCLA campus in Los Angeles, California on May 17, 2026. Specific venue details will be announced closer to the event.',
  },
  {
    q: 'How do I register?',
    a: 'Registration is through the Google Form linked on this site. Click \'Register Now\' on the home page or in the navigation bar.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[var(--color-border)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex justify-between items-start gap-4 group"
      >
        <span className={`text-[var(--color-text)] leading-snug transition-colors duration-200 ${open ? 'text-[var(--color-gold)]' : 'group-hover:text-[var(--color-gold)]'}`}>
          {q}
        </span>
        <span className={`text-[var(--color-gold)] text-xl font-light shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <p className="text-[var(--color-text-secondary)] leading-relaxed pb-6 pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-16 max-w-3xl mx-auto">
      <p className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4">LAMT 2026</p>
      <h1 className="font-bold text-[var(--color-text)] leading-tight mb-6"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        FAQ
      </h1>
      <div className="gold-rule mb-16" />

      <div>
        {faqs.map(({ q, a }) => (
          <FAQItem key={q} q={q} a={a} />
        ))}
        <div className="border-t border-[var(--color-border)]" />
      </div>

      <p className="mt-12 text-[var(--color-text-muted)] text-sm leading-relaxed">
        Have a question not answered here?{' '}
        <a href="mailto:lamt@math.ucla.edu" className="text-[var(--color-gold)] hover:underline underline-offset-4">
          Email us
        </a>.
      </p>
    </div>
  );
}
