import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live',
  description: 'Tournament-day schedule, announcements, map, and live help desk.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
