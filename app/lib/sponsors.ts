import fs from 'fs';
import path from 'path';

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
export const TIERS = ['gold', 'silver', 'bronze', 'friends'] as const;
export type Tier = (typeof TIERS)[number];

export function getSponsorsByTier(): Record<Tier, string[]> {
  const base = path.join(process.cwd(), 'public', 'sponsors');
  const result = {} as Record<Tier, string[]>;
  for (const tier of TIERS) {
    const dir = path.join(base, tier);
    try {
      result[tier] = fs
        .readdirSync(dir)
        .filter((file) => SUPPORTED_EXTS.includes(path.extname(file).toLowerCase()))
        .map((file) => `/sponsors/${tier}/${file}`);
    } catch {
      result[tier] = [];
    }
  }
  return result;
}
