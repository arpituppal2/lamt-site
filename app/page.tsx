import Link from 'next/link';
import SponsorsSection from './components/SponsorsSection';
import HomeClient from './components/HomeClient';
import fs from 'fs';
import path from 'path';

const REGISTER_URL = 'https://contestdojo.com/public/BoJ8sPuig3IJ4BQeC97u';
const DISCORD_URL  = 'https://discord.gg/cV6EHtfcD';

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];

function getSponsorImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'sponsors');
  try {
    return fs.readdirSync(dir)
      .filter(f => SUPPORTED_EXTS.includes(path.extname(f).toLowerCase()))
      .map(f => `/sponsors/${f}`);
  } catch {
    return [];
  }
}

export default function HomePage() {
  const sponsorImages = getSponsorImages();

  return (
    <div>
      <HomeClient
        registerUrl={REGISTER_URL}
        discordUrl={DISCORD_URL}
      />
      <SponsorsSection images={sponsorImages} />
    </div>
  );
}
