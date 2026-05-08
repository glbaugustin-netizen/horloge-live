import type { Metadata } from 'next';
import ClockPageClient from '@/components/ClockPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Horloge en ligne — Plein écran & personnalisable | horloge-live.com',
  description:
    "Affichez l'heure exacte en ligne avec une horloge gratuite, personnalisable et en plein écran. Choisissez votre style et utilisez-la sur mobile ou PC en un clic.",
  alternates: { canonical: 'https://horloge-live.com/' },
  openGraph: {
    title: 'Horloge en ligne — Plein écran & personnalisable | horloge-live.com',
    description:
      "Affichez l'heure exacte en ligne avec une horloge gratuite, personnalisable et en plein écran.",
    url: 'https://horloge-live.com/',
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
      name: "Peut-on personnaliser l'horloge en ligne ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Depuis les paramètres, vous pouvez choisir parmi plus de 60 polices, changer la couleur du texte, définir un fond aesthetic ou une photo de paysage, et régler le format 12h/24h. Toutes vos préférences sont sauvegardées automatiquement dans votre navigateur.",
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
    {
      '@type': 'Question',
      name: "Faut-il créer un compte pour utiliser l'horloge ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non. L'horloge en ligne est totalement gratuite et fonctionne sans inscription. Aucun compte n'est nécessaire pour utiliser toutes les fonctionnalités du site.",
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
          Horloge en ligne — Heure exacte, plein écran et personnalisable
        </h1>

        {/* H2 #1 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Quelle heure est-il en ce moment ?</h2>
          <p style={pStyle}>
            Notre horloge en ligne affiche l&apos;heure exacte en heures, minutes et secondes,
            synchronisée automatiquement avec l&apos;heure de votre navigateur. Gratuite et sans
            installation, elle fonctionne sur ordinateur, tablette et mobile. Consultez l&apos;heure
            précise à tout moment, où que vous soyez.
          </p>
        </div>

        {/* H2 #2 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Personnalisez votre horloge en ligne</h2>
          <p style={pStyle}>
            Adaptez votre horloge à votre style : choisissez parmi plus de 60 polices de
            caractères, modifiez la couleur du texte, et définissez une image de fond aesthetic ou
            une couleur unie. Le format 12h/24h, le mode miroir et l&apos;affichage de la date sont
            aussi paramétrables. Vos préférences sont sauvegardées automatiquement pour votre
            prochaine visite.
          </p>
        </div>

        {/* H2 #3 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Affichez l&apos;horloge en plein écran</h2>
          <p style={pStyle}>
            Passez en mode plein écran d&apos;un simple clic pour afficher votre horloge sur tout
            l&apos;écran. Idéal pour les salles de réunion, la gestion du temps en classe ou comme
            horloge de bureau sur un second moniteur. Appuyez sur la touche F ou cliquez sur
            l&apos;icône dédiée — appuyez sur Échap pour quitter.
          </p>
        </div>

        {/* H2 #4 — FAQ */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Questions fréquentes sur l&apos;horloge en ligne</h2>
          <div style={{ marginTop: '16px' }}>
            <FaqItem
              question="Quelle heure est-il maintenant ?"
              answer="L'horloge affiche l'heure exacte en temps réel, synchronisée automatiquement avec l'heure de votre navigateur. Aucun réglage n'est nécessaire : l'heure s'affiche dès l'ouverture de la page."
            />
            <FaqItem
              question="Comment afficher l'horloge en plein écran ?"
              answer="Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. L'horloge occupe alors tout l'écran. Pour quitter le mode plein écran, appuyez sur la touche Échap."
            />
            <FaqItem
              question="Peut-on personnaliser l'horloge en ligne ?"
              answer="Oui. Depuis les paramètres, vous pouvez choisir parmi plus de 60 polices, changer la couleur du texte, définir un fond aesthetic ou une photo de paysage, et régler le format 12h/24h. Toutes vos préférences sont sauvegardées automatiquement dans votre navigateur."
            />
            <FaqItem
              question="L'horloge en ligne est-elle précise ?"
              answer="Oui. L'horloge est synchronisée avec l'heure de votre système, elle-même mise à jour automatiquement via les serveurs de temps NTP. Elle affiche l'heure exacte à la seconde près."
            />
            <FaqItem
              question="Faut-il créer un compte pour utiliser l'horloge ?"
              answer="Non. L'horloge en ligne est totalement gratuite et fonctionne sans inscription. Aucun compte n'est nécessaire pour utiliser toutes les fonctionnalités du site."
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
          horloge-live.com est un site gratuit qui vous permet d&apos;afficher l&apos;heure exacte
          en ligne, directement dans votre navigateur. Conçu pour être rapide, épuré et entièrement
          personnalisable, il s&apos;adresse à tous ceux qui cherchent une horloge numérique fiable
          — que ce soit pour un usage personnel, en classe ou en réunion. Aucune publicité, aucune
          installation, aucun abonnement.
        </p>
      </section>
    </>
  );
}
