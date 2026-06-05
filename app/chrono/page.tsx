import type { Metadata } from 'next';
import ChronoPageClient from '@/components/ChronoPageClient';

export const metadata: Metadata = {
  /* Le template du layout ajoute automatiquement " | horloge-live.com" */
  title: 'Chronomètre en ligne gratuit',
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
const pStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.75',
  color: 'rgba(255,255,255,0.65)',
  margin: '0 0 36px',
};
const pLastStyle: React.CSSProperties = {
  ...pStyle,
  margin: '0',
};

export default function ChronoPage() {
  return (
    <>
      <ChronoPageClient />

      <section style={sectionStyle} aria-label="À propos du chronomètre">
        <div style={wrapStyle}>
          <h1 style={h1Style}>Chronomètre en ligne gratuit</h1>

          <h2 style={h2Style}>Comment utiliser le chronomètre en ligne&nbsp;?</h2>
          <p style={pStyle}>
            Notre chronomètre en ligne est gratuit et fonctionne directement dans votre
            navigateur, sans installation. Cliquez sur Démarrer pour lancer le compteur,
            Pause pour le mettre en attente, et Réinitialiser pour remettre à zéro.
            Utilisez le bouton Tour pour enregistrer vos temps intermédiaires —
            ils s&apos;affichent dans le tableau en dessous.
          </p>

          <h2 style={h2Style}>Un chronomètre précis pour tous vos besoins</h2>
          <p style={pLastStyle}>
            Idéal pour le sport, les révisions en mode Pomodoro, les présentations
            minutées ou les activités en classe. Le chronomètre affiche les heures,
            minutes, secondes et millisecondes en temps réel. Vos sessions ne sont pas
            sauvegardées — chaque visite repart de zéro.
          </p>
        </div>
      </section>
    </>
  );
}
