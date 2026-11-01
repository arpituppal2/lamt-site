import SponsorsSection from './components/SponsorsSection';
import HomeClient from './components/HomeClient';
import EmailSection from './components/EmailSection';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

const DISCORD_URL = 'https://discord.gg/tqR3bGjVke';

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const TIERS = ['gold', 'silver', 'bronze', 'friends'] as const;
export type Tier = typeof TIERS[number];

function getSponsorsByTier(): Record<Tier, string[]> {
  const base = path.join(process.cwd(), 'public', 'sponsors');
  const result = {} as Record<Tier, string[]>;
  for (const tier of TIERS) {
    const dir = path.join(base, tier);
    try {
      result[tier] = fs.readdirSync(dir)
        .filter((file) => SUPPORTED_EXTS.includes(path.extname(file).toLowerCase()))
        .map((file) => `/sponsors/${tier}/${file}`);
    } catch {
      result[tier] = [];
    }
  }
  return result;
}

function ProofBand() {
  const facts = [
    { value: '180+', label: 'Students in 2026' },
    { value: '8', label: 'Counties represented' },
    { value: 'Free', label: 'No registration fee' },
  ];

  const shots = [
    { src: '/photos/venue-mosaic.jpg', alt: 'Students gathering under the UCLA math mosaic facade' },
    { src: '/photos/hero-hall.jpg', alt: 'Students filling the UCLA lecture hall at LAMT' },
    { src: '/photos/desk.jpg', alt: 'Organizers running registration at UCLA' },
  ];

  return (
    <section className="border-t-4 border-[var(--ucla-gold)] bg-[var(--ucla-blue-deep)] text-white">
      <div className="page-shell !py-12 md:!py-16">
        <div className="stagger-parent grid gap-8 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="border-t-2 border-white/20 pt-4 sm:border-l-2 sm:border-t-0 sm:px-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
              <p className="text-3xl font-extrabold tabular-nums text-white md:text-4xl">{fact.value}</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ucla-gold)]">{fact.label}</p>
            </div>
          ))}
        </div>
        <div className="stagger-parent mt-10 grid gap-3 md:grid-cols-3">
          {shots.map((shot) => (
            <div key={shot.src} className="relative aspect-[3/2] overflow-hidden bg-black/30">
              <Image src={shot.src} alt={shot.alt} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/90">
          Figures from LAMT 2026 (May 17). Browse problems and results in the{' '}
          <Link href="/archive" className="font-extrabold text-white underline underline-offset-4 decoration-[var(--ucla-gold)]">
            archive
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  const sponsorsByTier = getSponsorsByTier();

  return (
    <div>
      <HomeClient discordUrl={DISCORD_URL} />
      <ProofBand />
      <EmailSection />
      <SponsorsSection sponsorsByTier={sponsorsByTier} />
    </div>
  );
}
