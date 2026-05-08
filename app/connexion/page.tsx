import type { Metadata } from 'next';
import ConnexionPageClient from '@/components/ConnexionPageClient';

export const metadata: Metadata = {
  title: 'Mon compte | horloge-live.com',
  robots: { index: false, follow: false },
};

export default function ConnexionPage() {
  return <ConnexionPageClient />;
}
