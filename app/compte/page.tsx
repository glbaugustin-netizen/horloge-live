import type { Metadata } from 'next';
import ComptePageClient from '@/components/ComptePageClient';

export const metadata: Metadata = {
  title: 'Mon compte | horloge-live.com',
  robots: { index: false, follow: false },
};

export default function ComptePage() {
  return <ComptePageClient />;
}
