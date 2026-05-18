import type { Metadata } from 'next';
import ExamenPageClient from '@/components/ExamenPageClient';

const DESCRIPTION =
  "Horloge plein écran pour les examens et salles de classe. Affichez l'heure en grand, la matière et la durée de l'épreuve. Gratuit, sans installation.";

export const metadata: Metadata = {
  title: 'Horloge mode examen — Plein écran pour la classe | horloge-live.com',
  description: DESCRIPTION,
  alternates: { canonical: 'https://horloge-live.com/examen' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge mode examen — Plein écran pour la classe | horloge-live.com',
    description: DESCRIPTION,
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
    description: DESCRIPTION,
  },
};

export default function ExamenPage() {
  return <ExamenPageClient />;
}
