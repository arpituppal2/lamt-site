import SponsorsSection from './components/SponsorsSection';
import HomeClient from './components/HomeClient';
import fs from 'fs';
import path from 'path';

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';
const DISCORD_URL  = 'https://discord.gg/cV6EHtfcD';

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
        .filter(f => SUPPORTED_EXTS.includes(path.extname(f).toLowerCase()))
        .map(f => `/sponsors/${tier}/${f}`);
    } catch {
      result[tier] = [];
    }
  }
  return result;
}

export default function HomePage() {
  const sponsorsByTier = getSponsorsByTier();

  return (
    <div>
      <HomeClient registerUrl={REGISTER_URL} discordUrl={DISCORD_URL} />
      <SponsorsSection sponsorsByTier={sponsorsByTier} />
    </div>
  );
}
