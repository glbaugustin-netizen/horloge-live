import type { Metadata } from 'next';
import ExamenPageClient from '@/components/ExamenPageClient';

const DESCRIPTION =
  "Horloge plein écran pour les examens et salles de classe. Affichez l'heure en grand, la matière et la durée de l'épreuve. Gratuit, sans installation.";

export const metadata: Metadata = {
  /* Le template du layout ajoute automatiquement " | horloge-live.com" */
  title: 'Horloge plein écran pour la classe',
  description: DESCRIPTION,
  alternates: { canonical: 'https://horloge-live.com/examen' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge plein écran pour la classe | horloge-live.com',
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
    title: 'Horloge plein écran pour la classe | horloge-live.com',
    description: DESCRIPTION,
  },
};

export default function ExamenPage() {
  return (
    <>
      <ExamenPageClient />
      {/* Maillage interne — indexable, visible en bas de page */}
      <p style={{
        background: '#f8fafc',
        color: '#6b7280',
        fontSize: '13px',
        textAlign: 'center',
        padding: '12px 24px',
        borderTop: '1px solid #e5e7eb',
        lineHeight: 1.6,
      }}>
        Découvrez aussi notre{' '}
        <a href="/horloge-aiguille" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>
          horloge à aiguilles en ligne
        </a>
        , notre <a href="/" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>horloge numérique</a>,
        l&apos;<a href="/monde" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>heure dans le monde</a>{' '}
        et notre <a href="/chrono" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>chronomètre en ligne</a>.
      </p>
    </>
  );
}
