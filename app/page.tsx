import type { Metadata } from 'next';
import ClockPageClient from '@/components/ClockPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Horloge en ligne — Heure exacte, aesthetic, live et personnalisable | horloge-live.com',
  description:
    "Horloge en ligne live et aesthetic — affiche l'heure exacte en temps réel, gratuite et personnalisable. Plus de 60 polices, fonds aesthetic, paysages. Plein écran en un clic. Sur mobile et PC.",
  alternates: { canonical: 'https://www.horloge-live.com/' },
  openGraph: {
    title: 'Horloge en ligne — Heure exacte, aesthetic, live et personnalisable | horloge-live.com',
    description:
      "Horloge en ligne live et aesthetic — affiche l'heure exacte en temps réel, gratuite et personnalisable. Plus de 60 polices, fonds aesthetic, paysages. Plein écran en un clic.",
    url: 'https://www.horloge-live.com/',
    images: [
      {
        url: 'https://www.horloge-live.com/og-image.webp',
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
      name: "Quelle heure est-il maintenant ? Est-ce une horloge en ligne live ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. L'horloge affiche l'heure exacte en temps réel, synchronisée en direct avec votre navigateur — c'est bien une horloge live. Aucun réglage nécessaire : l'heure s'affiche dès l'ouverture de la page.",
      },
    },
    {
      '@type': 'Question',
      name: "Comment afficher l'horloge en plein écran ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. L'horloge occupe tout l'écran. Pour quitter le mode plein écran, appuyez sur la touche Échap.",
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
      name: "Peut-on avoir une horloge en ligne personnalisable et modifiable ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. horloge-live.com est une horloge en ligne entièrement personnalisable et modifiable : police, taille, couleur du texte, fond aesthetic ou paysage, format 12h/24h et mode miroir. Toutes vos préférences sont sauvegardées automatiquement.",
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
