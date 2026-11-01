import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LAMT 2026',
  description: 'Recap of LAMT 2026 at UCLA — schedule, eligibility, and archive links.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
