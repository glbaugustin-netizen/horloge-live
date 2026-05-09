import type { Metadata } from 'next';
import MondePageClient from '@/components/MondePageClient';

export const metadata: Metadata = {
  title: 'Horloge mondiale en ligne | horloge-live.com',
  description:
    "Affichez l'heure en temps réel dans plusieurs villes du monde. Comparez les fuseaux horaires gratuitement.",
};

export default function MondePage() {
  return <MondePageClient />;
}
