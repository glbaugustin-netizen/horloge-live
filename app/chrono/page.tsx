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
        url: '/backgrounds/bg-nature7.webp',
        width: 1920,
        height: 1080,
        alt: 'Chronomètre en ligne — horloge-live.com',
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
