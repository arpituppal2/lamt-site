'use client';

import { useState } from 'react';

const pastFiles = [
  {
    title: '2026',
    files: {
      Problems: {
        Shopping: '/lamt2026/Shopping Round.pdf',
        'Algebra & Number Theory': '/lamt2026/AlgNT.pdf',
        Combinatorics: '/lamt2026/Combo.pdf',
        Geometry: '/lamt2026/Geo.pdf',
        Guts: '/lamt2026/Guts.pdf',
      },
      Solutions: {
        Shopping: '/lamt2026/Shopping Round Solutions.pdf',
        'Algebra & Number Theory': '/lamt2026/AlgNT Solutions.pdf',
        Combinatorics: '/lamt2026/Combo Solutions.pdf',
        Geometry: '/lamt2026/Geo Solutions.pdf',
        Guts: '/lamt2026/Guts Solutions.pdf',
      },
      'Integration Bee': {
        'Problems and Answers': '/lamt2026/IntegrationBee2026.pdf',
        'Full Solutions': '/lamt2026/lamt26_intbee_qualSolns.pdf',
      },
      Results: {
        Results: '/lamt2026/lamt2026results',
      },
      Other: {
        'Note from the LAMT Team': '/lamt2026/Apology Letter.pdf',
      },
    },
  },
];

export default function ArchivePage() {
  const [open, setOpen] = useState<string | null>(pastFiles[0].title);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Past Exams</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-summary mt-5">
            See our past tournament exams, solutions, and results.
          </p>
        </div>
      </header>

      <div>
        {pastFiles.map((year) => {
          const isOpen = open === year.title;
          return (
            <section key={year.title} className="border-t-2 border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : year.title)}
                aria-expanded={isOpen}
                aria-controls={`archive-${year.title}`}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-2xl font-extrabold text-[var(--color-text)]">{year.title}</span>
                <span
                  aria-hidden="true"
                  className={`text-[var(--color-text-muted)] transition-transform duration-200 ${
                    isOpen ? '' : '-rotate-90'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div id={`archive-${year.title}`} className="grid grid-cols-1 gap-x-10 gap-y-12 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {Object.entries(year.files).map(([category, items]) => (
                    <section key={category} className="border-t-2 border-[var(--ucla-gold)] pt-5">
                      <h2 className="font-extrabold text-[var(--color-text)]">{category}</h2>
                      <ul className="mt-4 grid gap-3">
                        {Object.entries(items as Record<string, string>).map(([name, value]) => (
                          <li key={name}>
                            <a
                              href={value}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-[var(--color-text-secondary)] underline decoration-[var(--color-divider)] underline-offset-4 transition-colors hover:text-[var(--color-text)] hover:decoration-[var(--ucla-gold)]"
                            >
                              {name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}