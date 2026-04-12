'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- DATA ------------------------------------------------------------------
const daySchedule = [
  { time: '8:00 AM',  title: 'Check-in',               subtitle: 'Arrive on campus, register your team, settle into Westwood.' },
  { time: '8:45 AM',  title: 'Opening Ceremony',        subtitle: 'Welcome remarks from UCLA students and LAMT hosts.' },
  { time: '9:15 AM',  title: 'Special Team Round',      subtitle: '75 minutes. Format revealed on contest day.' },
  { time: '10:45 AM', title: 'Algebra / Number Theory',  subtitle: '50 minutes · 10 problems · individual.' },
  { time: '12:00 PM', title: 'Geometry Round',           subtitle: '50 minutes · 10 problems · individual.' },
  { time: '1:00 PM',  title: 'Lunch & Disputes',         subtitle: 'Recharge, explore campus, submit solution disputes.' },
  { time: '2:00 PM',  title: 'Combinatorics Round',      subtitle: '50 minutes · 10 problems · individual.' },
  { time: '3:15 PM',  title: 'Guts Round',               subtitle: '75 minutes · live-scored relay. Multiple sets of 3 problems.' },
  { time: '4:30 PM',  title: 'Integration Bee & Talk',   subtitle: 'Integration Bee, guest lecture, final disputes.' },
  { time: '6:00 PM',  title: 'Awards Ceremony',          subtitle: 'Team and individual awards, photos, celebration.' },
];

const faqs = [
  { q: 'Who can participate?', a: 'LAMT is open to students in grades 6–12 during the 2025–2026 academic year. We welcome both newcomers and seasoned contestants.' },
  { q: 'When and where is the tournament?', a: "LAMT takes place on May 17, 2026 at UCLA's Court of Sciences. Rounds are held in the Mathematical Sciences Building; room assignments will be emailed to registered teams closer to the date." },
  { q: 'Will middle school students have a different exam?', a: 'No. All students receive the same exam. The problems are calibrated for the high school level, though middle school students are welcome to compete.' },
  { q: 'How many students per team?', a: 'Teams may have up to 6 students. Schools may register multiple teams. There is no restriction on mixing grade levels within a team.' },
  { q: 'Can individuals sign up without a team?', a: 'Yes. Individual registration is available and we will help form composite teams when appropriate. Details will be shared upon registration.' },
  { q: 'What is the registration fee?', a: 'The final fee is currently TBD. Pricing will cover contest materials, scoring, and on-campus logistics. Need-based accommodations may be available.' },
  { q: 'Are calculators allowed?', a: 'No. Calculators, smart devices, and all computational aids are strictly prohibited during testing rounds.' },
  { q: 'Do teams need a chaperone?', a: 'Yes. All students must be accompanied by an adult chaperone (parent, teacher, or coach) who must remain on the UCLA campus for the duration of the event.' },
];

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

// --- PAGE ------------------------------------------------------------------
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div>

      {/* HERO */}
      <section
        aria-label="Hero"
        style={{
          minHeight: '88dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem)',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--blue)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1000px', marginInline: 'auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}
          >
            <span style={{ display: 'inline-block', width: '32px', height: '1px', backgroundColor: 'var(--gold)' }} />
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
            }}>
              UCLA Court of Sciences · Sunday, May 17, 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'var(--text-hero)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '2rem',
            }}
          >
            Los Angeles<br />
            <span style={{ color: 'var(--gold)' }}>Math</span><br />
            Tournament
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '44ch',
              lineHeight: 1.65,
            }}>
              A student-run competition at UCLA for grades 6–12.
              Algebra, geometry, combinatorics, and number theory — a full day of serious problem solving.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href={REGISTER_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.625rem 1.375rem',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--blue)',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                  letterSpacing: '0.01em',
                }}
                className="hover:opacity-90"
              >
                Register on ContestDojo
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </Link>
              <a
                href="#about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.625rem 1.375rem',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                  fontSize: 'var(--text-sm)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                className="hover:!border-white/50 hover:!text-white"
              >
                Learn more
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              marginBottom: '1rem',
            }}>
              About
            </p>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: 'var(--text)',
              marginBottom: '1.5rem',
              maxWidth: '20ch',
            }}>
              What is LAMT?
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'start',
          }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-muted)',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}>
                The Los Angeles Math Tournament is an annual, student-run competition
                hosted at UCLA for middle and high school students. Teams work through
                carefully crafted problems in algebra, geometry, combinatorics, and number
                theory — with an emphasis on depth and creative reasoning, not speed.
              </p>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-muted)',
                lineHeight: 1.75,
              }}>
                LAMT is designed to challenge students at every level, from first-time
                competitors to seasoned veterans. The full-day format gives everyone time
                to think carefully, collaborate with teammates, and experience serious
                mathematics in a competitive setting.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  { label: 'Special Team Round', meta: '75 min', detail: 'Collaborative format revealed day-of. Teams of up to 6.' },
                  { label: 'Individual Rounds', meta: '3 × 50 min', detail: 'Algebra/NT, Geometry, Combinatorics — 10 numerical-answer problems each.' },
                  { label: 'Guts Round', meta: '75 min', detail: 'Live-scored relay. Multiple sets of 3 problems with a running scoreboard.' },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '0.5rem',
                      padding: '1.25rem 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--text)',
                        marginBottom: '0.25rem',
                      }}>
                        {r.label}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                        lineHeight: 1.55,
                      }}>
                        {r.detail}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--blue)',
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                        paddingLeft: '1rem',
                      }}
                      className="dark:!text-[#4a9ac4]"
                    >
                      {r.meta}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section
        id="schedule"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem)',
          borderTop: '1px solid var(--border)',
        }}
        className="[background-color:var(--surface-2)]"
      >
        <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              marginBottom: '0.75rem',
            }}>
              Day schedule
            </p>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}>
              Sunday, May 17, 2026
            </h2>
          </motion.div>

          <div>
            {daySchedule.map((row, idx) => (
              <motion.div
                key={row.time + row.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '5.5rem 1fr',
                  gap: '0 2rem',
                  padding: '0.875rem 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'baseline',
                }}
              >
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--text-faint)',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.04em',
                  paddingTop: '0.125rem',
                }}>
                  {row.time}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 0.75rem' }}>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}>
                    {row.title}
                  </span>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    {row.subtitle}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem)',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div style={{ maxWidth: '720px', marginInline: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              marginBottom: '0.75rem',
            }}>
              FAQs
            </p>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}>
              Common questions
            </h2>
          </motion.div>

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
                      gap: '1rem',
                      padding: '1.125rem 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text)',
                      lineHeight: 1.4,
                    }}>
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{
                          paddingBottom: '1.25rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.7,
                          maxWidth: '62ch',
                        }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section
        id="location"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem)',
          borderTop: '1px solid var(--border)',
        }}
        className="[background-color:var(--surface-2)]"
      >
        <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ marginBottom: '2rem' }}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              marginBottom: '0.75rem',
            }}>
              Venue
            </p>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}>
              UCLA Mathematical Sciences Building
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              520 Portola Plaza, Los Angeles, CA 90095
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              aspectRatio: '16/7',
            }}
          >
            <iframe
              title="UCLA Mathematical Sciences Building"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.738!2d-118.4427!3d34.0689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85cbbb5827%3A0x76b2f6b7e4b2ef8a!2sMathematical%20Sciences%20Building%2C%20Los%20Angeles%2C%20CA%2090095!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* REGISTER */}
      <section
        id="register"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem)',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--blue)',
        }}
      >
        <div style={{ maxWidth: '1000px', marginInline: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'start',
          }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '1rem',
              }}>
                Registration
              </p>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}>
                Registration is now open.
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.7,
                maxWidth: '44ch',
                marginBottom: '2rem',
              }}>
                LAMT 2026 takes place May 17 at UCLA. Register your team on ContestDojo
                and share with any students interested in competing.
              </p>
              <Link
                href={REGISTER_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.6875rem 1.5rem',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--blue)',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                  letterSpacing: '0.01em',
                }}
                className="hover:opacity-90"
              >
                Register on ContestDojo
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <p style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '1.25rem',
              }}>
                Get in touch
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                {[
                  { label: 'Email', val: 'team@lamt.net', href: 'mailto:team@lamt.net' },
                  { label: 'Instagram', val: '@lamathtournament', href: 'https://www.instagram.com/lamathtournament/' },
                  { label: 'Facebook', val: 'LAMT Community Group', href: 'https://www.facebook.com/groups/1429462591976204/' },
                  { label: 'LinkedIn', val: 'Los Angeles Math Tournament', href: 'https://www.linkedin.com/company/la-math-tournament/' },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '0.875rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.12)',
                      textDecoration: 'none',
                      transition: 'opacity 0.15s',
                    }}
                    className="hover:opacity-75"
                  >
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.04em',
                      minWidth: '5rem',
                    }}>
                      {c.label}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(255,255,255,0.85)',
                      fontWeight: 500,
                      flex: 1,
                      textAlign: 'right',
                    }}>
                      {c.val}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
