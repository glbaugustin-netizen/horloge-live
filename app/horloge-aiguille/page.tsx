import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import AnalogClockPageClient from '@/components/AnalogClockPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Horloge à aiguilles en ligne — Heure France analogique | horloge-live.com',
  description:
    'Horloge à aiguilles en ligne gratuite, en temps réel. Affichage analogique avec heures, minutes et secondes. Mode 12h/24h, plein écran, heure Paris.',
  alternates: { canonical: 'https://horloge-live.com/horloge-aiguille' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge à aiguilles en ligne — Heure France analogique | horloge-live.com',
    description:
      'Horloge à aiguilles en ligne gratuite, en temps réel. Affichage analogique avec heures, minutes et secondes. Mode 12h/24h, plein écran, heure Paris.',
    url: 'https://horloge-live.com/horloge-aiguille',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge à aiguilles en ligne — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge à aiguilles en ligne — Heure France analogique | horloge-live.com',
    description:
      'Horloge à aiguilles en ligne gratuite, en temps réel. Affichage analogique avec heures, minutes et secondes. Mode 12h/24h, plein écran, heure Paris.',
  },
};

/* ─── JSON-LD FAQPage ─────────────────────────────────────── */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Qu'est-ce qu'une horloge à aiguilles en ligne ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Une horloge à aiguilles en ligne est une horloge analogique qui fonctionne directement dans votre navigateur web. Elle reproduit le fonctionnement d'une horloge traditionnelle avec ses aiguilles des heures, des minutes et des secondes, sans nécessiter d'application ni de téléchargement.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge à aiguilles affiche-t-elle l'heure exacte de France ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. L'horloge est synchronisée avec l'heure locale de votre appareil et affiche automatiquement l'heure de Paris et l'heure de France en temps réel, en tenant compte des changements d'heure été/hiver.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on afficher l'horloge à aiguilles en plein écran ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Cliquez sur l'icône plein écran ou appuyez sur la touche F pour afficher l'horloge à aiguilles sur tout votre écran. Idéal pour une utilisation en classe, en salle de réunion ou sur un second moniteur.",
      },
    },
    {
      '@type': 'Question',
      name: "Quelle est la différence entre l'horloge 12h et l'horloge aiguille 24h ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "En mode 12 heures, les aiguilles effectuent deux tours complets par jour. En mode 24 heures, elles n'en font qu'un seul, ce qui permet de lire l'heure sans jamais confondre matin et après-midi.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge à aiguilles est-elle gratuite ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, horloge-live.com est entièrement gratuit, sans publicité et sans inscription. L'horloge analogique en ligne est accessible à tous, à tout moment.",
      },
    },
  ],
};

/* ─── Styles SEO — liquid glass identiques à app/page.tsx ─── */
const glassCard: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '12px',
};

const h2Style: CSSProperties = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.90)',
  marginBottom: '12px',
  marginTop: 0,
};

const h3Style: CSSProperties = {
  fontSize: '15px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.80)',
  marginBottom: '8px',
  marginTop: '20px',
};

const bodyText: CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.70)',
  lineHeight: 1.7,
  margin: 0,
};

const linkStyle: CSSProperties = {
  color: 'rgba(79, 195, 247, 0.85)',
  textDecoration: 'underline',
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function HorlogeAiguillePage() {
  return (
    <>
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <AnalogClockPageClient />

      {/* ── Section SEO — rendu serveur, scrollable sous l'horloge ── */}
      <section
        style={{
          background: 'rgba(0, 0, 0, 0.20)',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>

          {/* H1 — centré, au-dessus des cartes */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 500,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: 1.3,
          }}>
            Horloge à aiguilles en ligne — Heure France en temps réel
          </h1>

          {/* Intro */}
          <div style={glassCard}>
            <p style={bodyText}>
              Notre horloge à aiguilles en ligne affiche l&apos;heure exacte en temps réel, directement
              dans votre navigateur. Gratuite, sans installation et sans inscription, elle fonctionne
              sur ordinateur, tablette et mobile. Les aiguilles des heures, des minutes et des secondes
              se déplacent en continu pour indiquer l&apos;heure précise à tout moment.
            </p>
          </div>

          {/* Horloge analogique avec heures et minutes */}
          <div style={glassCard}>
            <h2 style={h2Style}>Horloge analogique avec heures et minutes</h2>
            <p style={bodyText}>
              Cette horloge à aiguilles affiche les heures et les minutes sur un cadran analogique
              classique. L&apos;aiguille des heures, l&apos;aiguille des minutes et la trotteuse des secondes
              tournent en temps réel, synchronisées avec l&apos;heure de votre appareil. Idéale pour
              retrouver les repères d&apos;une horloge traditionnelle directement sur votre écran.
            </p>
          </div>

          {/* Heure de Paris */}
          <div style={glassCard}>
            <h2 style={h2Style}>Heure de Paris et heure de France en ce moment</h2>
            <p style={bodyText}>
              L&apos;horloge affiche automatiquement l&apos;heure de France, soit l&apos;heure de Paris
              (fuseau Europe/Paris, UTC+1 en hiver et UTC+2 en été). Vous consultez donc en permanence
              l&apos;heure exacte en France, sans avoir à régler quoi que ce soit. Pratique pour vérifier
              rapidement l&apos;heure locale depuis n&apos;importe quel appareil.
            </p>
          </div>

          {/* Mode 24h */}
          <div style={glassCard}>
            <h2 style={h2Style}>Mode 24 heures — horloge à aiguilles 24h</h2>
            <p style={bodyText}>
              Le mode 24 heures permet d&apos;afficher un cadran analogique complet sur 24 heures plutôt
              que sur 12 heures. Les aiguilles effectuent un tour complet en 24 heures, ce qui permet
              de distinguer instantanément le matin de l&apos;après-midi sans ambiguïté. Activez ce mode
              via les paramètres de la page.
            </p>
          </div>

          {/* FAQ — une seule carte */}
          <div style={glassCard}>
            <h2 style={h2Style}>Questions fréquentes sur l&apos;horloge à aiguilles en ligne</h2>

            <h3 style={h3Style}>Qu&apos;est-ce qu&apos;une horloge à aiguilles en ligne ?</h3>
            <p style={bodyText}>
              Une horloge à aiguilles en ligne est une horloge analogique qui fonctionne directement
              dans votre navigateur web. Elle reproduit le fonctionnement d&apos;une horloge traditionnelle
              avec ses aiguilles des heures, des minutes et des secondes, sans nécessiter d&apos;application
              ni de téléchargement.
            </p>

            <h3 style={h3Style}>L&apos;horloge à aiguilles affiche-t-elle l&apos;heure exacte de France ?</h3>
            <p style={bodyText}>
              Oui. L&apos;horloge est synchronisée avec l&apos;heure locale de votre appareil et affiche
              automatiquement l&apos;heure de Paris et l&apos;heure de France en temps réel, en tenant compte
              des changements d&apos;heure été/hiver.
            </p>

            <h3 style={h3Style}>Peut-on afficher l&apos;horloge à aiguilles en plein écran ?</h3>
            <p style={bodyText}>
              Oui. Cliquez sur l&apos;icône plein écran ou appuyez sur la touche F pour afficher l&apos;horloge
              à aiguilles sur tout votre écran. Idéal pour une utilisation en classe, en salle de réunion
              ou sur un second moniteur.
            </p>

            <h3 style={h3Style}>
              Quelle est la différence entre l&apos;horloge 12h et l&apos;horloge aiguille 24h ?
            </h3>
            <p style={bodyText}>
              En mode 12 heures, les aiguilles effectuent deux tours complets par jour. En mode 24 heures,
              elles n&apos;en font qu&apos;un seul, ce qui permet de lire l&apos;heure sans jamais confondre matin
              et après-midi.
            </p>

            <h3 style={h3Style}>L&apos;horloge à aiguilles est-elle gratuite ?</h3>
            <p style={bodyText}>
              Oui, horloge-live.com est entièrement gratuit, sans publicité et sans inscription.
              L&apos;horloge analogique en ligne est accessible à tous, à tout moment.
            </p>
          </div>

          {/* Maillage interne */}
          <div style={glassCard}>
            <p style={bodyText}>
              Découvrez aussi notre{' '}
              <a href="/" style={linkStyle}>horloge numérique en ligne</a>,
              notre{' '}
              <a href="/examen" style={linkStyle}>horloge pour examen</a>,
              l&apos;<a href="/monde" style={linkStyle}>heure dans le monde</a>{' '}
              et notre{' '}
              <a href="/chrono" style={linkStyle}>chronomètre en ligne</a>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
