import type { Metadata } from 'next';
import ChronoPageClient from '@/components/ChronoPageClient';

export const metadata: Metadata = {
  title: 'Chronomètre en ligne gratuit | horloge-live.com',
  description:
    'Chronomètre en ligne gratuit, sans installation. Démarrez, pausez, enregistrez vos tours. Fonctionne sur mobile et ordinateur en un clic.',
};

export default function ChronoPage() {
  return <ChronoPageClient />;
}
