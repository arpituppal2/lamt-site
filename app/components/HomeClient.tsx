'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import MathFieldScene from './MathFieldScene';

function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setDiff(target - Date.now());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return diff;
}

function useRevealBlocks() {
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.reveal-block'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);
}

function Countdown({ diff }: { diff: number | null }) {
  if (diff !== null && diff <= 0) return null;

  const days = diff === null ? '--' : String(Math.floor(diff / 86400000));
  const hours = diff === null ? '--' : String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  const minutes = diff === null ? '--' : String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const seconds = diff === null ? '--' : String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

  return (
    <div className="cinema-countdown" aria-label="Event countdown">
      {[
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' },
      ].map((item) => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const proofChapters = [
  {
    label: 'Arrival',
    title: 'Teams enter a campus-scale math environment.',
    body: 'LAMT brings middle and high school students to UCLA for a free in-person tournament with a full tournament day operating layer.',
  },
  {
    label: 'Rounds',
    title: 'Individual, team, and collaborative problem solving.',
    body: 'The competition is structured for precision: clear rounds, published rules, room assignments, lunch, awards, and disputes.',
  },
  {
    label: 'Operations',
    title: 'Live updates keep the day coherent.',
    body: 'The live page centralizes schedule status, staff announcements, campus directions, help requests, and tournament logistics.',
  },
];

const scheduleMoments = [
  ['8:00 AM', 'Check-in and campus arrival'],
  ['9:00 AM', 'Opening session'],
  ['9:30 AM', 'Individual round'],
  ['11:00 AM', 'Team round'],
  ['1:30 PM', 'Disputes and activities'],
  ['4:00 PM', 'Awards ceremony'],
];

export default function HomeClient({
  registerUrl,
  discordUrl,
}: {
  registerUrl: string;
  discordUrl: string;
}) {
  useRevealBlocks();
  const tournamentDiff = useCountdown('2026-05-17T08:00:00-07:00');
  const regDiff = useCountdown('2026-05-10T23:59:59-07:00');
  const regClosed = regDiff === null || regDiff <= 0;
  const tournamentLive = tournamentDiff !== null && tournamentDiff <= 0;

  return (
    <div className="home-experience">
      <section className="cinema-hero">
        <MathFieldScene mode="hero" />
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="cinema-wordmark" aria-hidden="true">LAMT</div>

        <div className="cinema-hero__content reveal-block is-visible">
          <div className="hero-lamt-lockup">
            <Image src="/LAMTBear.png" alt="LAMT bear logo" width={132} height={132} className="hero-lamt-lockup__bear" priority />
            <div>
              <span>LAMT 2026</span>
              <strong>LAMT</strong>
            </div>
          </div>
          <p className="eyebrow">Los Angeles Math Tournament / UCLA Campus / May 17, 2026</p>
          <h1>
            <span>LAMT</span>
            {' '}
            <small>Los Angeles Math Tournament</small>
          </h1>
          <p className="cinema-lede">
            A free in-person mathematics tournament for middle and high school students, hosted at UCLA by the Los Angeles Math Tournament Group.
          </p>
          <div className="cinema-actions">
            {tournamentLive ? (
              <Link href="/live" className="btn-premium btn-premium--gold">
                Open Live Site
              </Link>
            ) : !regClosed ? (
              <Link href={registerUrl} target="_blank" rel="noreferrer" className="btn-premium btn-premium--gold">
                Register on ContestDojo
              </Link>
            ) : (
              <Link href="/live" className="btn-premium btn-premium--gold">
                Tournament Day Site
              </Link>
            )}
            <Link href="/tournament" className="btn-premium">
              Tournament Details
            </Link>
            <Link href={discordUrl} target="_blank" rel="noreferrer" className="btn-premium">
              Join Discord
            </Link>
          </div>
        </div>

        <aside className="hero-console reveal-block is-visible" aria-label="Tournament status">
          <div className="console-topline">
            <span>{tournamentLive ? 'Tournament Day' : 'Countdown'}</span>
            <span>Live Ops Ready</span>
          </div>
          {tournamentLive ? (
            <div className="console-live">
              <strong>LAMT 2026 is live.</strong>
              <p>Use the live site for schedule status, staff updates, campus directions, and help requests.</p>
            </div>
          ) : (
            <Countdown diff={tournamentDiff} />
          )}
        </aside>
      </section>

      <section className="manifest-section site-pad">
        <div className="manifest-copy reveal-block">
          <p className="eyebrow">Competition Portal</p>
          <h2>Built like a proof: precise, legible, and impossible to mistake for a template.</h2>
        </div>
        <div className="manifest-metrics reveal-block">
          {[
            ['Free', 'No registration fee'],
            ['UCLA', 'In-person campus venue'],
            ['MS/HS', 'Middle and high school students'],
            ['Live', 'Schedule and staff updates'],
          ].map(([value, label]) => (
            <div key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="proof-scroll">
        <div className="proof-stage">
          <div className="proof-stage__media" aria-hidden="true">
            <MathFieldScene mode="compact" />
            <Image src="/LAMTBear.png" alt="" width={360} height={360} className="proof-bear" />
          </div>
          <div className="proof-stage__rail">
            {proofChapters.map((chapter, index) => (
              <article className="proof-chapter reveal-block" key={chapter.label}>
                <span>{String(index + 1).padStart(2, '0')} / {chapter.label}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dayflow-section site-pad">
        <div className="dayflow-header reveal-block">
          <p className="eyebrow">Tournament Day</p>
          <h2>One continuous flow from arrival to awards.</h2>
          <p>
            The site now treats the tournament as a live experience: schedule, room movement, announcements, maps, and help requests all point to the same operational layer.
          </p>
        </div>
        <div className="timeline-rail reveal-block">
          {scheduleMoments.map(([time, label]) => (
            <div key={time} className="timeline-node">
              <span>{time}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
        <div className="dayflow-actions reveal-block">
          <Link href="/live" className="btn-premium btn-premium--blue">
            Open Live Operations
          </Link>
          <Link href="/rules" className="btn-premium">
            Read Competition Rules
          </Link>
        </div>
      </section>

      <section id="register" className="registration-slab site-pad">
        <div className="registration-slab__status reveal-block">
          <p className="eyebrow">Registration</p>
          <h2>{regClosed ? 'Registration is closed.' : 'Registration is open.'}</h2>
          <p>
            LAMT 2026 takes place Sunday, May 17, 2026 at UCLA. Registration is through ContestDojo and there is no registration fee.
          </p>
        </div>
        <div className="registration-slab__grid reveal-block">
          <div>
            <span>Date</span>
            <strong>Sunday, May 17, 2026</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>UCLA Campus, Los Angeles</strong>
          </div>
          <div>
            <span>Fee</span>
            <strong>Free to register and compete</strong>
          </div>
        </div>
        <div className="cinema-actions reveal-block">
          {!regClosed && (
            <Link href={registerUrl} target="_blank" rel="noreferrer" className="btn-premium btn-premium--gold">
              Register on ContestDojo
            </Link>
          )}
          <Link href={discordUrl} target="_blank" rel="noreferrer" className="btn-premium">
            Join Discord
          </Link>
          <Link href="/faq" className="btn-premium">
            View FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}
