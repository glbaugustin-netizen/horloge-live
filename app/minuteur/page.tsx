import type { Metadata } from 'next';
import MinuteurPageClient from '@/components/MinuteurPageClient';

export const metadata: Metadata = {
  /* Le template du layout ajoute automatiquement " | horloge-live.com" */
  title: 'Minuteur en ligne gratuit',
  description:
    'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
  alternates: { canonical: 'https://horloge-live.com/minuteur' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Minuteur en ligne gratuit | horloge-live.com',
    description:
      'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
    url: 'https://horloge-live.com/minuteur',
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
    title: 'Minuteur en ligne gratuit | horloge-live.com',
    description:
      'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
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
  marginBottom: '16px',
};
const cardLastStyle: React.CSSProperties = {
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

export default function MinuteurPage() {
  return (
    <>
      <MinuteurPageClient />

      <section style={sectionStyle} aria-label="À propos du minuteur">
        <div style={wrapStyle}>
          <h1 style={h1Style}>Minuteur en ligne gratuit</h1>

          <div style={cardStyle}>
            <h2 style={h2Style}>Comment utiliser le minuteur en ligne&nbsp;?</h2>
            <p style={pStyle}>
              Saisissez la durée souhaitée dans les champs heures, minutes et secondes,
              puis cliquez sur Fixer pour initialiser le minuteur. Appuyez sur Démarrer
              pour lancer le compte à rebours. Une alarme sonore se déclenche
              automatiquement à la fin. Vous pouvez mettre en pause à tout moment et
              réinitialiser pour repartir de la durée fixée.
            </p>
          </div>

          <div style={cardLastStyle}>
            <h2 style={h2Style}>Un minuteur en ligne pour toutes les situations</h2>
            <p style={pStyle}>
              Parfait pour la cuisine, les sessions de travail Pomodoro, les examens,
              les activités sportives ou les présentations. Le minuteur fonctionne
              entièrement dans votre navigateur, sans installation ni inscription.
              Gratuit et sans publicité.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
