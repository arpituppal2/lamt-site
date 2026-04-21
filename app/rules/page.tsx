'use client';

import { useEffect, useState } from "react";
import KaTeXLoader from "../components/KaTeXLoader"; // <-- FIXED PATH

/**
 * Inline KaTeX renderer with safe fallback.
 */
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

    // Try immediately
    if (!tryRender()) {
      // Poll until KaTeX loads
      const id = setInterval(() => {
        if (tryRender()) clearInterval(id);
      }, 50);
      return () => clearInterval(id);
    }
  }, [math]);

  // Safe fallback: raw TeX as text, NOT HTML
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
    { math: '\\binom{200}{4}' },
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

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
      <KaTeXLoader /> {/* Optional: safe to include here too */}

      <h1 
        className="font-bold text-[var(--color-text)] leading-tight mb-6"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        Rules
      </h1>
      <div className="gold-rule mb-16" />

      {/* Test Format */}
      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight text-left">Test Format</h2>
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
              desc: '8 sets of 3 problems plus 1 set of estimation problems, delivered to teams in sequential order.',
            },
          ].map(({ name, desc }) => (
            <div key={name} className="border-t border-[var(--color-border)] pt-6 text-left">
              <p className="text-[var(--color-text)] font-medium mb-2">{name}</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honor Code */}
      <section className="mb-20 text-left">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Honor Code</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          We expect that when taking their individual tests, the only aid or resource students will use
          are those explicitly specified below. Students may not access the internet or
          communicate with other people. For team-based tests, students may communicate with
          their teammates, but otherwise the same expectations hold.
        </p>

        <p className="text-[var(--color-text)] font-medium mb-4">The following may not be used during any testing portion of the contest:</p>
        <ul className="space-y-3 mb-8">
          {[
            'Calculators',
            'Other computational aids, such as slide rulers and abaci',
            'Reference materials, such as books and notes',
            'Communication devices, such as cell phones and computers',
            'Any drawing aids (rulers, compasses, protractors)',
            'Graph paper',
          ].map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="text-[var(--color-gold)] font-bold text-sm mt-0.5 shrink-0">&#x2014;</span>
              <span className="text-[var(--color-text-secondary)] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Acceptable Answers */}
      <section className="mb-20 text-left">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">Acceptable Answers</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          Answers must be written in correct mathematical notation. Unless otherwise specified, 
          all answers must be exact and simplified. Graders will take a reasonably lenient interpretation of
          “simplified.” The decisions of the LAMT coordinators are final.
        </p>

        <div className="grid grid-cols-1 gap-12">
          {/* Table 1 */}
          <div className="rounded-xl border border-[var(--color-border)] p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-6 text-center uppercase tracking-widest opacity-80">
              Examples of Acceptable Answers
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[var(--color-border)] bg-transparent">
                <tbody>
                  {Array.from({ length: Math.ceil(acceptableExamples.length / 2) }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-[var(--color-border)] last:border-b-0">
                      <td className="w-1/2 p-6 text-center border-r border-[var(--color-border)] text-[var(--color-text)] text-lg">
                        <InlineMath math={acceptableExamples[rowIndex * 2].math} />
                      </td>
                      <td className="w-1/2 p-6 text-center text-[var(--color-text)] text-lg">
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

          {/* Table 2 */}
          <div className="rounded-xl border border-[var(--color-border)] p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-6 text-center uppercase tracking-widest opacity-80">
              Examples of Unacceptable Answers
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[var(--color-border)] bg-transparent">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/5">
                    <th className="w-1/2 p-4 text-center font-semibold text-[var(--color-text)] border-r border-[var(--color-border)]">
                      Unsimplified
                    </th>
                    <th className="w-1/2 p-4 text-center font-semibold text-[var(--color-text)]">
                      Simplified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unacceptableExamples.map((item, index) => (
                    <tr key={index} className="border-b border-[var(--color-border)] last:border-b-0">
                      <td className="w-1/2 p-6 text-center border-r border-[var(--color-border)]">
                        <span className="opacity-40 line-through text-[var(--color-text-secondary)]">
                          <InlineMath math={item.unsimplified} />
                        </span>
                      </td>
                      <td className="w-1/2 p-6 text-center text-[var(--color-text)] text-lg">
                        <InlineMath math={item.acceptable} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
