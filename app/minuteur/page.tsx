import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Script from 'next/script';
import MinuteurPageClient from '@/components/MinuteurPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: 'Minuteur en ligne gratuit | horloge-live.com' },
  description:
    "Minuteur en ligne gratuit avec alarme sonore, plein écran et style aesthetic. Compte à rebours précis, sans pub, sans inscription. Sur mobile et ordinateur.",
  alternates: { canonical: 'https://horloge-live.com/minuteur' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Minuteur en ligne gratuit | horloge-live.com',
    description:
      "Minuteur en ligne gratuit avec alarme sonore, plein écran et style aesthetic. Compte à rebours précis, sans pub, sans inscription. Sur mobile et ordinateur.",
    url: 'https://horloge-live.com/minuteur',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Minuteur en ligne gratuit — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minuteur en ligne gratuit | horloge-live.com',
    description:
      "Minuteur en ligne gratuit avec alarme sonore, plein écran et style aesthetic. Compte à rebours précis, sans pub, sans inscription. Sur mobile et ordinateur.",
  },
};

/* ─── JSON-LD HowTo ──────────────────────────────────────── */
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment utiliser le minuteur en ligne ?',
  dateModified: '2026-06-10',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Saisir la durée',
      text: 'Entrez les heures, minutes et secondes dans les champs de saisie.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Fixer la durée',
      text: 'Cliquez sur Fixer pour valider la durée saisie.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Démarrer le compte à rebours',
      text: 'Cliquez sur Démarrer pour lancer le minuteur. À zéro, une alarme sonore retentit automatiquement.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Mettre en pause ou réinitialiser',
      text: 'Utilisez Pause pour suspendre et Réinitialiser pour remettre à la durée initiale.',
    },
  ],
};

/* ─── JSON-LD FAQPage ─────────────────────────────────────── */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  dateModified: '2026-06-10',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Comment utiliser le minuteur en ligne ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Saisissez les heures, minutes et secondes, cliquez sur Fixer puis sur Démarrer. À zéro, une alarme sonore retentit. Utilisez Pause pour suspendre et Réinitialiser pour remettre à la durée initiale.",
      },
    },
    {
      '@type': 'Question',
      name: "Le minuteur en ligne est-il gratuit ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Le minuteur de horloge-live.com est entièrement gratuit, sans publicité et sans inscription. Toutes les fonctionnalités sont accessibles immédiatement.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on afficher le minuteur en plein écran ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Cliquez sur l'icône plein écran ou appuyez sur F. Le compte à rebours occupe tout l'écran. Appuyez sur Échap pour quitter.",
      },
    },
    {
      '@type': 'Question',
      name: "Le minuteur sonne-t-il quand le temps est écoulé ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Une alarme sonore se déclenche automatiquement à zéro. Sur mobile, une vibration accompagne le signal. L'affichage clignote pour signaler visuellement la fin du temps.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on utiliser le minuteur en ligne pour 1 minute ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Saisissez 00h 01m 00s et cliquez sur Démarrer. Le minuteur accepte toutes les durées, de quelques secondes à plusieurs heures.",
      },
    },
  ],
};

/* ─── Styles liquid glass ─────────────────────────────────── */
const seoSection: CSSProperties = { padding: '56px 24px 72px' };

const glassCard: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '12px',
};

const h1Style: CSSProperties = {
  fontSize: '28px',
  fontWeight: 500,
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: '32px',
  lineHeight: 1.3,
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

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function MinuteurPage() {
  return (
    <>
      {/* JSON-LD HowTo */}
      <Script
        id="ld-json-minuteur-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {/* JSON-LD FAQPage */}
      <Script
        id="ld-json-minuteur-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <MinuteurPageClient />

      {/* ── Section SEO — rendu serveur ── */}
      <section style={seoSection} aria-label="À propos du minuteur en ligne">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* H1 */}
          <h1 style={h1Style}>
            Minuteur en ligne gratuit — Compte à rebours aesthetic et plein écran
          </h1>

          {/* H2 #1 — Présentation */}
          <div style={glassCard}>
            <h2 style={h2Style}>Un minuteur en ligne gratuit et simple d&apos;utilisation</h2>
            <p style={bodyText}>
              Notre minuteur en ligne lance un compte à rebours précis à la seconde, avec une alarme
              sonore à la fin. Gratuit, sans installation et sans inscription, il fonctionne
              directement dans votre navigateur sur ordinateur, tablette et mobile. Saisissez les
              heures, minutes et secondes, cliquez sur Démarrer — le timer se lance immédiatement.
            </p>
          </div>

          {/* H2 #2 — Classe et enfants */}
          <div style={glassCard}>
            <h2 style={h2Style}>Minuteur en ligne pour la classe et les enfants</h2>
            <p style={bodyText}>
              Projetez le minuteur en plein écran sur votre tableau blanc interactif pour gérer le
              temps des activités en classe. L&apos;affichage épuré et les grands chiffres garantissent
              une lisibilité maximale pour les élèves depuis tous les rangs. Idéal aussi comme
              minuteur pour enfants à la maison — pour les devoirs, les activités créatives ou les
              pauses écran. L&apos;alarme sonore signale clairement la fin du temps imparti.
            </p>
          </div>

          {/* H2 #3 — Plein écran */}
          <div style={glassCard}>
            <h2 style={h2Style}>Minuteur en ligne plein écran — Pour les réunions et le télétravail</h2>
            <p style={bodyText}>
              Passez en mode plein écran d&apos;un clic pour afficher le compte à rebours en grand sur
              tout votre écran. Parfait pour minuter des présentations, des ateliers, des réunions
              ou des sessions de travail en télétravail. Le minuteur reste visible depuis n&apos;importe
              quelle distance. Appuyez sur F ou cliquez sur l&apos;icône dédiée — appuyez sur Échap pour
              quitter le plein écran à tout moment.
            </p>
          </div>

          {/* H2 #4 — Aesthetic */}
          <div style={glassCard}>
            <h2 style={h2Style}>Minuteur aesthetic — Timer en ligne pour vos sessions study</h2>
            <p style={bodyText}>
              Le minuteur de horloge-live.com s&apos;inscrit dans le même univers visuel aesthetic que le
              reste du site : fond d&apos;écran personnalisable, typographie soignée et interface liquid
              glass. Parfait pour vos sessions de travail study, de révision ou de deep work — un
              timer en ligne qui s&apos;intègre à votre setup aesthetic sans briser l&apos;ambiance. Définissez
              votre durée de travail, lancez le compte à rebours et concentrez-vous. Vos préférences
              de style sont sauvegardées automatiquement.
            </p>
          </div>

          {/* H2 #5 — FAQ */}
          <div style={glassCard}>
            <h2 style={h2Style}>Questions fréquentes sur le minuteur en ligne</h2>

            <h3 style={h3Style}>Comment utiliser le minuteur en ligne ?</h3>
            <p style={bodyText}>
              Saisissez les heures, minutes et secondes souhaitées dans les champs de saisie.
              Cliquez sur Fixer pour valider la durée, puis sur Démarrer pour lancer le compte à
              rebours. À zéro, une alarme sonore retentit automatiquement. Utilisez Pause pour
              suspendre et Réinitialiser pour remettre à la durée initiale.
            </p>

            <h3 style={h3Style}>Le minuteur en ligne est-il gratuit ?</h3>
            <p style={bodyText}>
              Oui. Le minuteur de horloge-live.com est entièrement gratuit, sans publicité et sans
              inscription. Toutes les fonctionnalités — alarme sonore, plein écran, personnalisation
              aesthetic — sont accessibles immédiatement.
            </p>

            <h3 style={h3Style}>Peut-on afficher le minuteur en plein écran ?</h3>
            <p style={bodyText}>
              Oui. Cliquez sur l&apos;icône plein écran en bas de la page ou appuyez sur la touche F.
              Le compte à rebours occupe alors tout l&apos;écran — idéal pour la classe, les réunions ou
              le sport. Appuyez sur Échap pour quitter le plein écran.
            </p>

            <h3 style={h3Style}>Le minuteur sonne-t-il quand le temps est écoulé ?</h3>
            <p style={bodyText}>
              Oui. Une alarme sonore se déclenche automatiquement quand le compte à rebours atteint
              zéro. Sur mobile, une vibration accompagne le signal sonore. L&apos;affichage clignote
              également pour signaler visuellement la fin du temps imparti.
            </p>

            <h3 style={h3Style}>Peut-on utiliser le minuteur en ligne pour 1 minute ou des durées courtes ?</h3>
            <p style={bodyText}>
              Oui. Le minuteur accepte toutes les durées, de quelques secondes à plusieurs heures.
              Pour un minuteur 1 minute, saisissez simplement 00h 01m 00s et cliquez sur Démarrer.
              Idéal pour les activités rapides, les tours de jeu ou les exercices de respiration.
            </p>
          </div>

          {/* Maillage interne */}
          <div style={glassCard}>
            <p style={bodyText}>
              Découvrez aussi notre{' '}
              <a href="/" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>horloge en ligne aesthetic</a>,
              notre{' '}
              <a href="/chrono" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>chronomètre en ligne</a>,
              notre{' '}
              <a href="/horloge-aiguille" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>horloge à aiguilles en ligne</a>,
              l&apos;
              <a href="/monde" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>heure dans le monde</a>{' '}
              et l&apos;
              <a href="/examen" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>horloge mode examen</a>.
            </p>
          </div>

          {/* Footer microcopy */}
          <p style={{
            ...bodyText,
            textAlign: 'center',
            fontSize: '13px',
            opacity: 0.5,
            marginTop: '8px',
          }}>
            horloge-live.com — minuteur en ligne gratuit et aesthetic. Compte à rebours, alarme
            sonore, plein écran. Sans pub, sans inscription.
          </p>

        </div>
      </section>
    </>
  );
}
