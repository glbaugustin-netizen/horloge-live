import type { Metadata } from 'next';
import AnalogClockPageClient from '@/components/AnalogClockPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Horloge à aiguilles en ligne — Analogique, heure France, 12h/24h',
  description:
    'Horloge à aiguilles en ligne gratuite, en temps réel. Affichage analogique avec heures, minutes et secondes. Mode 12h/24h, plein écran, heure Paris.',
  alternates: { canonical: 'https://horloge-live.com/horloge-aiguille' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge à aiguilles en ligne — Analogique, heure France, 12h/24h | horloge-live.com',
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
    title: 'Horloge à aiguilles en ligne — Analogique, heure France, 12h/24h | horloge-live.com',
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
    </>
  );
}
