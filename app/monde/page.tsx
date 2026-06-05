import type { Metadata } from 'next';
import MondePageClient from '@/components/MondePageClient';

export const metadata: Metadata = {
  /* Le template du layout ajoute automatiquement " | horloge-live.com" */
  title: 'Horloge mondiale en ligne',
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
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge en ligne gratuite et personnalisable — horloge-live.com',
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

/* Styles partagés pour la section SEO */
const sectionStyle: React.CSSProperties = {
  background: '#0D1B2A',
  padding: '56px 24px 72px',
};
const wrapStyle: React.CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
};
const h1Style: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 600,
  color: '#ffffff',
  lineHeight: 1.25,
  margin: '0 0 40px',
};
const h2Style: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#ffffff',
  margin: '0 0 12px',
};
const pLastStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.75',
  color: 'rgba(255,255,255,0.65)',
  margin: '0',
};

export default function MondePage() {
  return (
    <>
      <MondePageClient />

      <section style={sectionStyle} aria-label="À propos de l'horloge mondiale">
        <div style={wrapStyle}>
          <h1 style={h1Style}>Horloge mondiale en ligne</h1>

          <h2 style={h2Style}>Comparez l&apos;heure dans plusieurs villes du monde</h2>
          <p style={pLastStyle}>
            Notre horloge mondiale affiche l&apos;heure en temps réel dans plusieurs
            villes et fuseaux horaires simultanément. Idéale pour les équipes
            distribuées, les appels internationaux ou les voyages. Toutes les heures
            sont synchronisées automatiquement avec votre navigateur. Gratuit, sans
            installation et sans inscription.
          </p>
        </div>
      </section>
    </>
  );
}
