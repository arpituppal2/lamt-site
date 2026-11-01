# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Students in grade 12 or below and their parents** — deciding whether to compete, preparing, and getting help on tournament day. They are often on a phone, at a venue, or on a campus network.
- **School coaches, teachers, and organization leaders** — evaluating LAMT for a team and looking for dates, eligibility, format, and a reason to bring students.
- **Past 2026 attendees, parents, and archive readers** — looking for results, problems, solutions, and the team's note after the event.

All three matter equally over the next year; there is no single primary audience.

## Product Purpose

LAMT is a free, UCLA-hosted math tournament for students in grade 12 or below. The site is both its public face and its operating surface: it captures interest between events, publishes the information teams need, runs tournament-day communications, and preserves the 2026 archive as proof of the event.

Success over the next 12 months means: the email list keeps growing, the next tournament can be announced and supported as soon as UCLA approval lands, the 2026 archive stays useful, and the live operations tooling can run another tournament day.

## Positioning

A free, national-stage, UCLA-hosted team math tournament open to any student in grade 12 or below, with no geographic restriction, combining individual rounds with collaborative team rounds. It is organized by a student group acting independently of the University of California, and it gives students beyond a single school's local circuit a reason to travel and compete.

## Operating Context

- The tournament is an annual, in-person event at UCLA. The 2026 edition ran on May 17, 2026, with 180+ students from 8 counties.
- Registration happens on ContestDojo, an external platform. LAMT does not store registration data directly.
- On tournament day, staff run the admin panel from laptops while attendees use phones on the campus network. Announcements and the schedule are polled; help requests go through a live chat queue.
- The archive is served as static PDFs and an HTML results page under `public/lamt2026/`.
- Admins sign in with a shared password and stay signed in for 12 hours.
- The public site is a Next.js static export served by Vercel; API traffic is proxied to an Express + PostgreSQL service on Railway.
- The email list is the bridge between events. Automated sending is a confirmed direction but is not built yet.
- Any future event announcement is gated on UCLA approval.

## Capabilities and Constraints

**Confirmed capabilities**

- Public pages: home, archive, rules, FAQ, about/privacy, tournament recap, and the tournament-day live page.
- Email capture from the homepage section and a timed popup; a tokenized unsubscribe endpoint exists server-side.
- Live announcements with create/edit/delete from the admin panel.
- Schedule management with original times and adjustment reasons surfaced to attendees.
- Contact inbox with replies and resolved status.
- Live chat queue with staff claiming, transcripts, and close.
- Subscriber list with copy-all and per-row delete for spam.
- Tournament settings for date, name, and registration deadline; the homepage countdown and registration state follow them.
- Server-side admin authentication with rate limiting and origin checks.
- 2026 archive of problems, solutions, results, and the team's note.

**Constraints**

- The frontend is a static export (`output: 'export'`), so there are no Next.js API routes. Server behavior lives in the Express backend.
- Data lives in a shared PostgreSQL database on Railway; the schema auto-migrates on startup.
- Public API paths are rewritten through Vercel to Railway; the frontend uses relative, same-origin requests.
- No email provider is wired yet. "Build automated sending" is a confirmed direction, not a shipped capability.
- Do not claim difficulty levels, score statistics, or benchmarks beyond the allowed facts: 180+ attendees, 8 counties, national stage, free, grade 12 or below, UCLA, May 2026.
- Do not announce future events, dates, or venues until UCLA approval exists.
- Registration remains external on ContestDojo; the site links out rather than collecting team data.
- No testimonials, case studies, press coverage, or sponsor commitments may be invented.

**Open decisions**

- The exact date, venue, and format of the next tournament.
- Whether and how to message the organization's nonprofit and international-expansion direction publicly; the approved refresh doc describes it as the founder's direction, not yet a public claim.
- Email provider, send cadence, and how unsubscribe links get generated and included.
- A formal accessibility standard has not been set; the site still needs to work for students and parents on phones at the venue.

## Brand Commitments

- Name: **Los Angeles Math Tournament (LAMT)**; the first event is referred to as **LAMT 2026**.
- UCLA identity: UCLA blue `#2774AE`, UCLA gold `#FFD100`, and the bear logo at `public/LAMTBear.png`.
- The founder's binding description of the existing feel: *"effortlessly UCLA; refined, academic, but still welcoming."*
- Keep the existing nav structure and the student-group disclaimer: LAMT acts independently of the University of California and takes responsibility for its organization and site.
- Voice: direct, academic, and welcoming. No hype and no unverifiable claims.
- Real sponsor assets exist in `public/sponsors/{gold,silver,bronze,friends}` and use the Gold / Silver / Bronze / Friends of LAMT tier labels.
- Public contact: `uclamathtournament@gmail.com`; social links are in the footer.

## Evidence on Hand

- `public/lamt2026/` — Shopping, Algebra & Number Theory, Combinatorics, Geometry, and Guts problems and solutions; Integration Bee problems/solutions; `lamt2026results.html`; and "Note from the LAMT Team" (`Apology Letter.pdf`).
- Sponsor logos under `public/sponsors/` by tier.
- Staff roster and group names in `app/about/page.tsx`.
- Allowed proof points: 180+ attendees, 8 counties, national stage, free entry, grade 12 or below, UCLA, May 2026.
- Absent: testimonials, case studies, press mentions, benchmark numbers, and confirmed future-event details. Do not fabricate them.

## Product Principles

1. **Capture demand before it decays.** The email list is the durable asset between tournaments; every surface should make joining it easy without turning the site into a funnel.
2. **Only claim what is true today.** No speculative dates, difficulty claims, or statistics. Silence is better than a guess.
3. **Tournament day is an operating surface, not a brochure.** Announcements, schedule, directions, and help must be fast, clear, and reliable on a phone at the venue.
4. **Preserve the UCLA identity; refine rather than reinvent.** The existing blue/gold/bear world is an asset, not a starting point to replace.
5. **The archive is the proof.** 2026 results, problems, and solutions should stay easy to find and use.

## Accessibility & Inclusion

No formal standard has been set. The practical requirement is that students and parents can use the site on a phone, at the venue, on a campus network, including during a timed tournament day.
