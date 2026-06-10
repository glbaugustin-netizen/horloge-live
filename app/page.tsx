import type { Metadata } from 'next';
import { headers } from 'next/headers';
import ClockPageClient from '@/components/ClockPageClient';
import SeoContent from '@/components/SeoContent';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: 'Horloge en ligne aesthetic live — Gratuite & personnalisable | horloge-live.com' },
  description:
    'Affichez l\'heure exacte avec notre horloge en ligne aesthetic. 60 polices, fonds aesthetic, plein écran. Gratuite, sans pub, sans inscription.',
  alternates: { canonical: 'https://horloge-live.com/' },
  openGraph: {
    title: 'Horloge en ligne aesthetic & live | horloge-live.com',
    description:
      "Horloge en ligne live et aesthetic — affiche l'heure exacte en temps réel, gratuite et personnalisable. Plus de 60 polices, fonds aesthetic, paysages. Plein écran en un clic.",
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
  dateModified: '2026-06-10',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Qu'est-ce qu'une horloge en ligne aesthetic ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Une horloge en ligne aesthetic est une horloge numérique personnalisable visuellement : police, fond d'écran aesthetic, couleurs et style. horloge-live.com propose plus de 60 polices et des fonds aesthetic, paysages ou couleurs unies.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge affiche-t-elle l'heure exacte en temps réel ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. horloge-live.com est une horloge en ligne live synchronisée via le protocole NTP dans votre navigateur. L'heure s'affiche dès l'ouverture de la page, aucun réglage nécessaire.",
      },
    },
    {
      '@type': 'Question',
      name: "Comment afficher une horloge en ligne gratuite en plein écran ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Cliquez sur l'icône plein écran ou appuyez sur F. Pour un fond noir sans distraction, activez le mode focus depuis les paramètres. Appuyez sur Échap pour quitter.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge en ligne est-elle vraiment gratuite et sans inscription ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. horloge-live.com est totalement gratuit, sans publicité, sans inscription et sans collecte de données.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on personnaliser l'horloge avec un fond aesthetic ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Choisissez parmi plus de 60 polices, modifiez la couleur du texte et définissez un fond aesthetic, paysage ou couleur unie. Toutes vos préférences sont sauvegardées automatiquement.",
      },
    },
  ],
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function Home() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') ?? '';
  const lang = acceptLanguage.toLowerCase().startsWith('fr') ? 'fr' : 'en';

  return (
    <>
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Zone interactive plein écran ── */}
      <ClockPageClient />

      {/* ── Section SEO — rendu serveur, crawlable par les IA ── */}
      <SeoContent language={lang} />
    </>
  );
}
