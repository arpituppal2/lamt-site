'use client';

import { useEffect, useState } from 'react';
import KaTeXLoader from '../components/KaTeXLoader';

function InlineMath({ math }: { math: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    const tryRender = () => {
      const katex = (window as any).katex;
      if (!katex) return false;

      setHtml(
        katex.renderToString(math, {
          throwOnError: false,
          displayMode: false,
        })
      );
      return true;
    };

    if (!tryRender()) {
      const id = window.setInterval(() => {
        if (tryRender()) window.clearInterval(id);
      }, 50);
      return () => window.clearInterval(id);
    }
  }, [math]);

  if (!html) return <span>{math}</span>;

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function RulesPage() {
  const acceptableExamples = [
    { math: '879' },
    { math: '2^{57} + 1' },
    { math: '\\frac{2}{7}' },
    { math: '\\sqrt{\\pi}' },
    { math: '\\frac{11}{3}' },
    { math: '\\frac{\\sqrt{2}}{2}' },
    { math: '420!' },
    { math: '\\cos(1)' },
    { math: '\\binom{10^{100000}}{4}' },
    { math: '11 \\sqrt[11]{\\frac{27}{4}}' },
  ];

  const unacceptableExamples = [
    { unsimplified: '61 \\times 17', acceptable: '1037' },
    { unsimplified: '\\sin(\\frac{\\pi}{7}) - \\sin(\\frac{6\\pi}{7})', acceptable: '0' },
    { unsimplified: '\\frac{61}{31415}', acceptable: '\\frac{1}{515}' },
    { unsimplified: '\\sqrt{3 + 2\\sqrt{2}}', acceptable: '1 + \\sqrt{2}' },
    { unsimplified: '\\sqrt{\\frac{7}{9}}', acceptable: '\\frac{\\sqrt{7}}{3}' },
    { unsimplified: '\\sin(\\frac{\\pi}{10})', acceptable: '\\frac{\\sqrt{5}-1}{4}' },
    { unsimplified: '1 / \\sqrt{3}', acceptable: '\\frac{\\sqrt{3}}{3}' },
  ];

  const testFormats = [
    { name: 'Individual Rounds', desc: '10 questions plus a tiebreaker problem. 50-minute time limit per round. Topics vary by round.' },
    { name: 'Mystery Round', desc: 'Format to be determined and announced closer to the tournament date.' },
    { name: 'Guts Round', desc: '8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in sequential order.' },
  ];

  const prohibited = [
    'Calculators',
    'Other computational aids, such as slide rulers and abaci',
    'Reference materials, such as books and notes',
    'Communication devices, such as cell phones and computers',
    'Any drawing aids (rulers, compasses, protractors)',
    'Graph paper',
  ];

  return (
    <div className="page-shell">
      <KaTeXLoader />

      <header className="page-hero">
        <div>
          <p className="page-kicker">Competition Rules</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Rules</h1>
          <p className="page-summary mt-5">
            Rules for testing format, honor code expectations, and acceptable mathematical answers.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Test Format</h2>
        <div className="grid gap-6">
          {testFormats.map(({ name, desc }) => (
            <div key={name} className="border-t-2 border-[var(--color-border)] pt-5 first:border-t-0 first:pt-0">
              <h3 className="font-extrabold text-[var(--color-text)]">{name}</h3>
              <p className="section-copy mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Honor Code</h2>
        <div>
          <p className="section-copy mb-6">
            We expect that when taking their individual tests, the only aid or resource students will use are those explicitly specified below. Students may not access the internet or communicate with other people. For team-based tests, students may communicate with their teammates, but otherwise the same expectations hold.
          </p>
          <p className="mb-4 font-extrabold text-[var(--color-text)]">
            The following may not be used during any testing portion of the contest:
          </p>
          <ul className="dash-list">
            {prohibited.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">Acceptable Answers</h2>
        <div>
          <p className="section-copy mb-8">
            Answers must be written in correct mathematical notation. Unless otherwise specified, all answers must be exact and simplified. Graders will take a reasonably lenient interpretation of &quot;simplified.&quot; The decisions of the LAMT coordinators are final.
          </p>

          <div className="grid gap-10">
            <div>
              <h3 className="mb-4 font-extrabold text-[var(--color-text)]">Examples of Acceptable Answers</h3>
              <div className="overflow-x-auto">
                <table className="lamt-table">
                  <tbody>
                    {Array.from({ length: Math.ceil(acceptableExamples.length / 2) }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="w-1/2 text-center text-lg text-[var(--color-text)]">
                          <InlineMath math={acceptableExamples[rowIndex * 2].math} />
                        </td>
                        <td className="w-1/2 text-center text-lg text-[var(--color-text)]">
                          {acceptableExamples[rowIndex * 2 + 1] && (
                            <InlineMath math={acceptableExamples[rowIndex * 2 + 1].math} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-extrabold text-[var(--color-text)]">Examples of Unacceptable Answers</h3>
              <div className="overflow-x-auto">
                <table className="lamt-table">
                  <thead>
                    <tr>
                      <th>Unsimplified</th>
                      <th>Simplified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unacceptableExamples.map((item) => (
                      <tr key={item.unsimplified}>
                        <td className="text-center text-[var(--color-text-secondary)] line-through">
                          <InlineMath math={item.unsimplified} />
                        </td>
                        <td className="text-center text-lg text-[var(--color-text)]">
                          <InlineMath math={item.acceptable} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
