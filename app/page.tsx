import type { Metadata } from 'next';
import ClockPageClient from '@/components/ClockPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  // TODO: dynamiser selon langue (EN: 'Aesthetic online clock — Full screen & customizable | horloge-live.com')
  title: 'Horloge en ligne aesthetic — Plein écran & personnalisable | horloge-live.com',
  description:
    "Horloge numérique en ligne aesthetic — affiche l'heure exacte, gratuite, personnalisable et en plein écran. Plus de 60 polices, fonds aesthetic et paysages. Sur mobile et PC en un clic.",
  alternates: { canonical: 'https://horloge-live.com/' },
  openGraph: {
    title: 'Horloge en ligne aesthetic — Plein écran & personnalisable | horloge-live.com',
    description:
      "Horloge numérique en ligne aesthetic — affiche l'heure exacte, gratuite, personnalisable et en plein écran.",
    url: 'https://horloge-live.com/',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge en ligne gratuite et personnalisable — horloge-live.com',
      },
    ],
  },
  robots: { index: true, follow: true },
};

/* ─── JSON-LD FAQPage (page principale uniquement) ──────────── */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Qu'est-ce qu'une horloge en ligne aesthetic ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Une horloge en ligne aesthetic est une horloge numérique personnalisable visuellement : police, fond d'écran, couleurs et style. horloge-live.com propose plus de 60 polices et des fonds aesthetic, paysages ou couleurs unies pour créer une horloge à votre image.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle heure est-il maintenant ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "L'horloge affiche l'heure exacte en temps réel, synchronisée automatiquement avec l'heure de votre navigateur. Aucun réglage n'est nécessaire : l'heure s'affiche dès l'ouverture de la page.",
      },
    },
    {
      '@type': 'Question',
      name: "Comment afficher l'horloge en plein écran ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. L'horloge occupe alors tout l'écran. Pour quitter le mode plein écran, appuyez sur la touche Échap.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge en ligne est-elle gratuite et sans inscription ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. horloge-live.com est totalement gratuit, sans publicité et sans inscription. Aucun compte n'est nécessaire pour utiliser toutes les fonctionnalités du site.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge en ligne est-elle précise ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. L'horloge est synchronisée avec l'heure de votre système, elle-même mise à jour automatiquement via les serveurs de temps NTP. Elle affiche l'heure exacte à la seconde près.",
      },
    },
  ],
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Zone interactive plein écran ── */}
      <ClockPageClient />

    </>
  );
}
