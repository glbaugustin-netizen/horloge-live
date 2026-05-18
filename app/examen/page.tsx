import type { Metadata } from 'next';
import ExamenPageClient from '@/components/ExamenPageClient';

export const metadata: Metadata = {
  title: 'Horloge mode examen — Plein écran pour la classe | horloge-live.com',
  description:
    'Horloge plein écran pour les examens et salles de classe. Affichez l'heure en grand, la matière et la durée de l'épreuve. Gratuit, sans installation.',
  alternates: { canonical: 'https://horloge-live.com/examen' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge mode examen — Plein écran pour la classe | horloge-live.com',
    description:
      'Horloge plein écran pour les examens et salles de classe. Affichez l'heure en grand, la matière et la durée de l'épreuve. Gratuit, sans installation.',
    url: 'https://horloge-live.com/examen',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge mode examen plein écran — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge mode examen — Plein écran pour la classe | horloge-live.com',
    description:
      'Horloge plein écran pour les examens et salles de classe. Affichez l'heure en grand, la matière et la durée de l'épreuve. Gratuit, sans installation.',
  },
};

export default function ExamenPage() {
  return <ExamenPageClient />;
}
