'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

// Event type classification for schedule visual treatment (#14)
type RowType = 'ceremony' | 'break' | 'round';
const daySchedule: { time: string; title: string; note: string; type: RowType }[] = [
  { time: '8:00 AM',  title: 'Check-in & Registration',   note: '',                  type: 'ceremony' },
  { time: '8:45 AM',  title: 'Opening Ceremony',           note: '',                  type: 'ceremony' },
  { time: '9:15 AM',  title: 'Special Team Round',         note: '75 min',            type: 'round' },
  { time: '10:45 AM', title: 'Algebra & Number Theory',    note: '50 min · individual', type: 'round' },
  { time: '12:00 PM', title: 'Geometry Round',             note: '50 min · individual', type: 'round' },
  { time: '1:00 PM',  title: 'Lunch & Disputes',           note: '',                  type: 'break' },
  { time: '2:00 PM',  title: 'Combinatorics Round',        note: '50 min · individual', type: 'round' },
  { time: '3:15 PM',  title: 'Guts Round',                 note: '75 min · live-scored', type: 'round' },
  { time: '4:30 PM',  title: 'Integration Bee & Talk',     note: '',                  type: 'ceremony' },
  { time: '6:00 PM',  title: 'Awards Ceremony',            note: '',                  type: 'ceremony' },
];

const faqs = [
  { q: 'Who can participate?',
    a: 'Any student in grades 6–12 during the 2025–2026 academic year. No prior competition experience required.' },
  { q: 'How large can a team be?',
    a: 'Up to 6 students per team. Schools may enter multiple teams, and grade levels can be mixed freely within a team.' },
  { q: 'Can I sign up as an individual?',
    a: 'Yes. Individual registration is available and we will help place you on a composite team. Details shared upon sign-up.' },
  { q: 'Will middle and high schoolers take the same exam?',
    a: 'Yes. All contestants receive the same problems. The difficulty is calibrated to the high school level, but middle schoolers are very welcome.' },
  { q: 'Are calculators allowed?',
    a: 'No. All computational aids — calculators, phones, smart devices — are strictly prohibited during testing rounds.' },
  { q: 'Does each team need a chaperone?',
    a: 'Yes. An adult chaperone (parent, teacher, or coach) must accompany students and remain on the UCLA campus throughout the event.' },
  { q: 'What is the registration fee?',
    a: 'The fee is TBD. It will cover contest materials, scoring, and on-site logistics. Need-based accommodations may be available — reach out to team@lamt.net.' },
  { q: 'Where exactly is the competition held?',
    a: 'UCLA Mathematical Sciences Building, 520 Portola Plaza, Los Angeles, CA 90095. Room assignments emailed to registered teams closer to the date.' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/* #5 — no dead top space: use flex column + justify-end, fixed height */}
      <section
        aria-label="Hero"
        style={{
          minHeight: '80dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: 'var(--blue)',
          padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* subtle dot grid */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* main content */}
        <div style={{
          maxWidth: '1000px',
          marginInline: 'auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            paddingTop: 'clamp(2rem, 6vw, 4rem)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            {/* #7 — supertitle dateline */}
            <p style={{
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '1.25rem',
            }}>
              Los Angeles Math Tournament · UCLA · Court of Sciences · May 17, 2026
            </p>

            {/* #8 — CTA in copy flow (left-aligned column); #9 — headline is the statement */}
            <div>
              {/* #6 — no single-word gold coloring; full title white; #9 — "A full day..." is the hero statement */}
              <h1 style={{
                fontSize: 'var(--text-hero)',
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                color: '#fff',
                marginBottom: '2rem',
              }}>
                A full day of<br />serious math.
              </h1>

              {/* #8 — button flush-left under headline */}
              <Link
                href={REGISTER_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ marginBottom: '1.5rem' }}
              >
                Register now
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </Link>

              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href="#about"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'rgba(255,255,255,0.45)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'inline-block',
                  }}
                  className="hover:!text-white/70"
                >
                  What is LAMT? ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      {/* #10 #31 — no section banding, same bg surface */}
      <section id="about" style={{
        padding: 'clamp(4rem, 9vw, 8rem) clamp(1rem, 4vw, 3rem)',
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 'clamp(2.5rem, 6vw, 6rem)',
            alignItems: 'start',
          }}>
            <div>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                lineHeight: 1.05,
                color: 'var(--text)',
                marginBottom: '1.5rem',
              }}>
                A full day of<br />serious math.
              </h2>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-muted)',
                lineHeight: 1.75,
                marginBottom: '1.125rem',
              }}>
                LAMT is a student-run competition held at UCLA for grades 6–12.
                Problems span algebra, geometry, combinatorics, and number theory —
                written to reward deep thinking, not just technique recall.
              </p>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-muted)',
                lineHeight: 1.75,
              }}>
                From first-time competitors to Olympiad veterans, the full-day format
                is designed to give everyone room to think, collaborate, and experience
                what competitive math really feels like.
              </p>
            </div>

            {/* #11 — no card scaffolding, hairline rows only; #12 — distinct round descriptions */}
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    {
                      round: 'Special Team Round',
                      dur: '75 min',
                      // #13 — rewritten Special Team Round description
                      desc: 'Format announced day-of. Teams of up to 6 — no spoilers.',
                    },
                    {
                      round: 'Algebra & Number Theory',
                      dur: '50 min',
                      desc: '10 problems. Numerical answers. Emphasizes algebraic manipulation and classical number theory.',
                    },
                    {
                      round: 'Geometry',
                      dur: '50 min',
                      desc: '10 problems. Figure-based and proof-adjacent reasoning, no coordinates required.',
                    },
                    {
                      round: 'Combinatorics',
                      dur: '50 min',
                      desc: '10 problems. Counting, probability, and combinatorial reasoning.',
                    },
                    {
                      round: 'Guts Round',
                      dur: '75 min',
                      desc: 'Live-scored relay. Sets of 3 problems released continuously with a running leaderboard.',
                    },
                  ].map((r, i) => (
                    <tr key={r.round} style={{
                      borderTop: '1px solid oklch(0 0 0 / 0.08)',
                      borderBottom: i === 4 ? '1px solid oklch(0 0 0 / 0.08)' : 'none',
                    }}>
                      <td style={{ padding: '0.9rem 0.75rem 0.9rem 0', verticalAlign: 'top', width: '55%' }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>
                          {r.round}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {r.desc}
                        </div>
                      </td>
                      <td style={{ padding: '0.9rem 0 0.9rem 0.5rem', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 700,
                          color: 'var(--text-faint)',
                          fontVariantNumeric: 'tabular-nums',
                        }}>{r.dur}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ─────────────────────────────────────────────────────── */}
      {/* #10 #16 — same bg as rest of page, top border separator */}
      <section id="schedule" style={{
        padding: 'clamp(4rem, 9vw, 8rem) clamp(1rem, 4vw, 3rem)',
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '680px', marginInline: 'auto' }}>
          <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '0.375rem',
            }}>Schedule</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Sunday, May 17, 2026 — all times approximate
            </p>
          </div>

          <div>
            {daySchedule.map((row) => {
              // #14 — visual distinction by event type
              const isRound = row.type === 'round';
              return (
                <div key={row.time} style={{
                  display: 'grid',
                  gridTemplateColumns: '5.5rem 1fr auto',
                  gap: '0 1.25rem',
                  padding: '0.8rem 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'baseline',
                }}>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-faint)',
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                  }}>{row.time}</span>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: isRound ? 600 : 400,
                    color: isRound ? 'var(--text)' : 'var(--text-muted)',
                  }}>{row.title}</span>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-faint)',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}>{row.note}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {/* #17 — renamed to FAQ; #10 — same bg */}
      <section id="faq" style={{
        padding: 'clamp(4rem, 9vw, 8rem) clamp(1rem, 4vw, 3rem)',
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '680px', marginInline: 'auto' }}>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}>FAQ</h2>

          <div>
            {faqs.map((item) => {
              const isOpen = openFaq === item.q;
              return (
                <div key={item.q} style={{ borderBottom: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : item.q)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.5rem',
                      // #18 — compressed vertical padding
                      padding: '0.75rem 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      lineHeight: 1.4,
                    }}>{item.q}</span>
                    {/* #19 — chevron SVG that rotates */}
                    <span aria-hidden="true" style={{
                      flexShrink: 0,
                      color: 'var(--text-faint)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      display: 'flex',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{
                          paddingBottom: '0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.7,
                        }}>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LOCATION ─────────────────────────────────────────────────────── */}
      {/* #10 #21 — same bg, stripped description paragraph */}
      <section id="location" style={{
        padding: 'clamp(4rem, 9vw, 8rem) clamp(1rem, 4vw, 3rem)',
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}>UCLA Mathematical Sciences Building</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              520 Portola Plaza, Los Angeles, CA 90095
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
              Rounds take place in MSB. Room assignments emailed one week before the event.
            </p>
          </div>
          {/* #22 — map capped at 280px, border-radius, border */}
          <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            height: '280px',
          }}>
            <iframe
              title="UCLA Mathematical Sciences Building"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.738!2d-118.4427!3d34.0689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85cbbb5827%3A0x76b2f6b7e4b2ef8a!2sMathematical%20Sciences%20Building%2C%20Los%20Angeles%2C%20CA%2090095!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── REGISTER ─────────────────────────────────────────────────────── */}
      {/* #24 — no dark teal band; same bg surface; border-top separator */}
      <section id="register" style={{
        padding: 'clamp(4rem, 9vw, 8rem) clamp(1rem, 4vw, 3rem)',
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1000px', marginInline: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'start',
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              lineHeight: 1.05,
              color: 'var(--text)',
              marginBottom: '1.125rem',
            }}>
              {/* #23 — specific CTA copy */}
              Register your team<br />on ContestDojo.
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}>
              Spots are limited — register before they fill. LAMT 2026 takes place May 17 at UCLA.
            </p>
            <Link
              href={REGISTER_URL}
              target="_blank" rel="noreferrer"
              className="btn-primary"
            >
              Register on ContestDojo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </Link>
          </div>

          <div>
            {/* #25 — keep CONTACT uppercase tracked label */}
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-faint)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>Contact</p>
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {/* #26 — all contact links clickable */}
              {[
                { label: 'Email',     val: 'team@lamt.net',            href: 'mailto:team@lamt.net' },
                { label: 'Instagram', val: '@lamathtournament',         href: 'https://www.instagram.com/lamathtournament/' },
                { label: 'Facebook',  val: 'LAMT Community Group',      href: 'https://www.facebook.com/groups/1429462591976204/' },
                { label: 'LinkedIn',  val: 'LA Math Tournament',        href: 'https://www.linkedin.com/company/la-math-tournament/' },
              ].map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{
                  display: 'flex', alignItems: 'baseline',
                  justifyContent: 'space-between', gap: '1rem',
                  padding: '0.8125rem 0',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none', transition: 'opacity 0.15s',
                }}
                className="hover:opacity-70"
                >
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)', minWidth: '5rem', fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, textAlign: 'right' }}>{c.val}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
