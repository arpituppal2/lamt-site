import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Past LAMT exams, solutions, and results.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
