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

/* ── Styles liquid glass — section SEO ───────────────────────── */
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
  fontWeight: 300,
  color: '#FFFFFF',
  letterSpacing: '0.05em',
  margin: '0 0 24px',
};
const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '20px 24px',
  marginBottom: 0,
};
const h2Style: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 400,
  color: '#FFFFFF',
  margin: '0 0 12px',
};
const pStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.70)',
  lineHeight: '1.7',
  margin: 0,
};

export default function MondePage() {
  return (
    <>
      <MondePageClient />

      <section style={sectionStyle} aria-label="À propos de l'horloge mondiale">
        <div style={wrapStyle}>
          <h1 style={h1Style}>Horloge mondiale en ligne</h1>

          <div style={cardStyle}>
            <h2 style={h2Style}>Comparez l&apos;heure dans plusieurs villes du monde</h2>
            <p style={pStyle}>
              Notre horloge mondiale affiche l&apos;heure en temps réel dans plusieurs
              villes et fuseaux horaires simultanément. Idéale pour les équipes
              distribuées, les appels internationaux ou les voyages. Toutes les heures
              sont synchronisées automatiquement avec votre navigateur. Gratuit, sans
              installation et sans inscription.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
