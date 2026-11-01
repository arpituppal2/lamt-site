import SponsorsSection from './components/SponsorsSection';
import HomeClient from './components/HomeClient';
import EmailSection from './components/EmailSection';
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
    { value: 'UCLA', label: 'Campus host' },
  ];

  return (
    <section className="border-t-4 border-[var(--ucla-gold)] bg-[var(--ucla-blue-deep)] text-white">
      <div className="page-shell !py-12 md:!py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="reveal border-t-2 border-white/20 pt-4 lg:border-l-2 lg:border-t-0 lg:px-6 lg:pt-0 lg:first:border-l-0 lg:first:pl-0">
              <p className="text-3xl font-extrabold tabular-nums text-white md:text-4xl">{fact.value}</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ucla-gold)]">{fact.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[var(--ucla-blue-light)]">
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
