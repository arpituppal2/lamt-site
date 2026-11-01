import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rules',
  description: 'Test format, honor code, and acceptable answers for LAMT.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
