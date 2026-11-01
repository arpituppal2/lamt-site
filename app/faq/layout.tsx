import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Eligibility, teams, format, and registration questions for LAMT.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
