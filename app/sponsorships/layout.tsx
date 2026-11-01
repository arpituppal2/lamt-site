import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsorships',
  description: 'Sponsor LAMT. Download the 2026–27 sponsorship packet.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
