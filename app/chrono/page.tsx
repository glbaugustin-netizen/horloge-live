import type { Metadata } from 'next';
import ChronoPageClient from '@/components/ChronoPageClient';

export const metadata: Metadata = {
  title: 'Chronomètre en ligne gratuit | horloge-live.com',
  description:
    'Chronomètre en ligne gratuit, sans installation. Démarrez, pausez, enregistrez vos tours. Fonctionne sur mobile et ordinateur en un clic.',
  alternates: { canonical: 'https://horloge-live.com/chrono' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Chronomètre en ligne gratuit | horloge-live.com',
    description:
      'Chronomètre en ligne gratuit, sans installation. Démarrez, pausez, enregistrez vos tours. Fonctionne sur mobile et ordinateur en un clic.',
    url: 'https://horloge-live.com/chrono',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge en ligne gratuite et personnalisable — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronomètre en ligne gratuit | horloge-live.com',
    description:
      'Chronomètre en ligne gratuit, sans installation. Démarrez, pausez, enregistrez vos tours. Fonctionne sur mobile et ordinateur en un clic.',
  },
};

export default function ChronoPage() {
  return <ChronoPageClient />;
}
