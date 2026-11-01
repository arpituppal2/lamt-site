import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Mission, staff, and privacy policy for the Los Angeles Math Tournament.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
