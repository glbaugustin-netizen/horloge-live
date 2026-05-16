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
   Composants SEO (styles discrets — contenu visible par Google)
───────────────────────────────────────────────────────────── */
const sectionStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  WebkitBackdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '24px',
};

const h2Style: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  marginBottom: '12px',
};

const pStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--color-text-secondary)',
  lineHeight: 1.7,
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        {question}
      </p>
      <p style={pStyle}>{answer}</p>
    </div>
  );
}

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

      {/* ── Contenu SEO (visible pour Google, discret visuellement) ─── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '800px',
          margin: '0 auto',
          padding: '48px 24px 64px',
        }}
      >
        {/* H1 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: 1.3,
          }}
        >
          Horloge en ligne aesthetic — Heure exacte, gratuite et personnalisable
        </h1>

        {/* H2 #1 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Quelle heure est-il en ce moment ?</h2>
          <p style={pStyle}>
            Notre horloge numérique en ligne aesthetic affiche l&apos;heure exacte en heures, minutes et secondes, synchronisée automatiquement avec l&apos;heure de votre navigateur. Gratuite et sans installation, elle fonctionne sur ordinateur, tablette et mobile.
          </p>
        </div>

        {/* H2 #2 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Personnalisez votre horloge en ligne</h2>
          <p style={pStyle}>
            Choisissez parmi plus de 60 polices de caractères, modifiez la couleur du texte, et définissez une image de fond aesthetic, un paysage ou une couleur unie. Format 12h/24h, mode miroir, affichage de la date — tout est paramétrable. Vos préférences sont sauvegardées automatiquement.
          </p>
        </div>

        {/* H2 #3 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Affichez l&apos;horloge en plein écran</h2>
          <p style={pStyle}>
            Cliquez sur l&apos;icône plein écran ou appuyez sur F pour afficher l&apos;horloge sur tout l&apos;écran. Idéal en salle de classe, en réunion ou comme horloge de bureau sur un second moniteur. Appuyez sur Échap pour quitter.
          </p>
        </div>

        {/* H2 #4 — FAQ */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Questions fréquentes sur l&apos;horloge en ligne</h2>
          <div style={{ marginTop: '16px' }}>
            <FaqItem
              question="Qu'est-ce qu'une horloge en ligne aesthetic ?"
              answer="Une horloge en ligne aesthetic est une horloge numérique personnalisable visuellement : police, fond d'écran, couleurs et style. horloge-live.com propose plus de 60 polices et des fonds aesthetic, paysages ou couleurs unies pour créer une horloge à votre image."
            />
            <FaqItem
              question="Quelle heure est-il maintenant ?"
              answer="L'horloge affiche l'heure exacte en temps réel, synchronisée automatiquement avec l'heure de votre navigateur. Aucun réglage n'est nécessaire : l'heure s'affiche dès l'ouverture de la page."
            />
            <FaqItem
              question="Comment afficher l'horloge en plein écran ?"
              answer="Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. L'horloge occupe alors tout l'écran. Pour quitter le mode plein écran, appuyez sur la touche Échap."
            />
            <FaqItem
              question="L'horloge en ligne est-elle gratuite et sans inscription ?"
              answer="Oui. horloge-live.com est totalement gratuit, sans publicité et sans inscription. Aucun compte n'est nécessaire pour utiliser toutes les fonctionnalités du site."
            />
            <FaqItem
              question="L'horloge en ligne est-elle précise ?"
              answer="Oui. L'horloge est synchronisée avec l'heure de votre système, elle-même mise à jour automatiquement via les serveurs de temps NTP. Elle affiche l'heure exacte à la seconde près."
            />
          </div>
        </div>

        {/* À propos */}
        <p
          style={{
            ...pStyle,
            textAlign: 'center',
            fontSize: '13px',
            opacity: 0.5,
            marginTop: '8px',
          }}
        >
          horloge-live.com est une horloge numérique aesthetic, gratuite et sans publicité. Personnalisable avec plus de 60 polices et des fonds aesthetic ou paysages, elle s&apos;adresse à tous — usage personnel, en classe ou en réunion. Aucune installation requise.
        </p>
      </section>
    </>
  );
}
