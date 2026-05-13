import type { Metadata } from 'next';
import MondePageClient from '@/components/MondePageClient';

export const metadata: Metadata = {
  title: 'Horloge mondiale en ligne | horloge-live.com',
  description:
    "Affichez l'heure en temps réel dans plusieurs villes du monde. Comparez les fuseaux horaires gratuitement.",
  alternates: { canonical: 'https://horloge-live.com/monde' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge mondiale en ligne | horloge-live.com',
    description:
      "Affichez l'heure en temps réel dans plusieurs villes du monde. Comparez les fuseaux horaires gratuitement.",
    url: 'https://horloge-live.com/monde',
    images: [
      {
        url: '/backgrounds/bg-nature7.webp',
        width: 1920,
        height: 1080,
        alt: 'Horloge mondiale — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge mondiale en ligne | horloge-live.com',
    description:
      "Affichez l'heure en temps réel dans plusieurs villes du monde. Comparez les fuseaux horaires gratuitement.",
  },
};

export default function MondePage() {
  return <MondePageClient />;
}
