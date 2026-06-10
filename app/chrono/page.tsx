import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import ChronoPageClient from '@/components/ChronoPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: 'Chronomètre en ligne gratuit — Plein écran & aesthetic | horloge-live.com' },
  description:
    "Chronomètre en ligne gratuit avec tours, plein écran et style aesthetic. Précis à la milliseconde, sans pub, sans inscription. Sur mobile et ordinateur.",
  alternates: { canonical: 'https://horloge-live.com/chrono' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Chronomètre en ligne gratuit — Plein écran & aesthetic | horloge-live.com',
    description:
      "Chronomètre en ligne gratuit avec tours, plein écran et style aesthetic. Précis à la milliseconde, sans pub, sans inscription. Sur mobile et ordinateur.",
    url: 'https://horloge-live.com/chrono',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Chronomètre en ligne gratuit — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronomètre en ligne gratuit — Plein écran & aesthetic | horloge-live.com',
    description:
      "Chronomètre en ligne gratuit avec tours, plein écran et style aesthetic. Précis à la milliseconde, sans pub, sans inscription. Sur mobile et ordinateur.",
  },
};

/* ─── JSON-LD HowTo ──────────────────────────────────────── */
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment utiliser le chronomètre en ligne ?',
  dateModified: '2026-06-10',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Démarrer le chronomètre',
      text: 'Cliquez sur le bouton Démarrer pour lancer le chronomètre.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Enregistrer un tour',
      text: 'Cliquez sur Tour pour enregistrer un temps intermédiaire. Le temps du tour et le temps total apparaissent dans le tableau.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Mettre en pause',
      text: 'Cliquez sur Pause pour suspendre le chronomètre, puis sur Reprendre pour continuer.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Réinitialiser',
      text: 'Cliquez sur Réinitialiser pour remettre le compteur à zéro.',
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
      name: "Comment utiliser le chronomètre en ligne ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Cliquez sur Démarrer pour lancer le chronomètre. Utilisez Pause, Reprendre, Tour et Réinitialiser pour contrôler le chronomètre. Le bouton Tour enregistre les temps intermédiaires dans un tableau.",
      },
    },
    {
      '@type': 'Question',
      name: "Le chronomètre en ligne est-il gratuit ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Le chronomètre de horloge-live.com est entièrement gratuit, sans publicité et sans inscription. Toutes les fonctionnalités sont accessibles immédiatement.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on afficher le chronomètre en plein écran ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Cliquez sur l'icône plein écran ou appuyez sur F. Appuyez sur Échap pour quitter. Idéal pour la classe, la salle de sport ou les réunions.",
      },
    },
    {
      '@type': 'Question',
      name: "Le chronomètre enregistre-t-il les tours ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Cliquez sur Tour pendant le chronométrage pour enregistrer un temps intermédiaire. Chaque tour affiche le temps du tour et le temps total. Aucune limite au nombre de tours.",
      },
    },
    {
      '@type': 'Question',
      name: "Le chronomètre fonctionne-t-il sur mobile ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Le chronomètre est entièrement responsive, adapté à tous les écrans — mobile, tablette et ordinateur. Aucune application à installer.",
      },
    },
  ],
};

/* ─── Styles liquid glass ─────────────────────────────────── */
const card: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '12px',
};

const h2Sty: CSSProperties = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.90)',
  marginBottom: '12px',
  marginTop: 0,
};

const h3Sty: CSSProperties = {
  fontSize: '15px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.80)',
  marginBottom: '8px',
  marginTop: '20px',
};

const pSty: CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.70)',
  lineHeight: 1.7,
  margin: 0,
};

const linkSty: CSSProperties = {
  color: 'rgba(79, 195, 247, 0.85)',
  textDecoration: 'underline',
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function ChronoPage() {
  return (
    <>
      {/* JSON-LD HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ChronoPageClient />

      {/* ── Section SEO — rendu serveur ── */}
      <section style={{ padding: '56px 24px 72px' }} aria-label="À propos du chronomètre en ligne">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* H1 */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 500,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: 1.3,
          }}>
            Chronomètre en ligne gratuit — Plein écran, tours et aesthetic
          </h1>

          {/* H2 #1 — Présentation */}
          <div style={card}>
            <h2 style={h2Sty}>Un chronomètre en ligne gratuit et précis à la milliseconde</h2>
            <p style={pSty}>
              Notre chronomètre en ligne affiche le temps écoulé en heures, minutes, secondes et
              millisecondes, avec une précision maximale. Gratuit, sans installation et sans
              inscription, il fonctionne directement dans votre navigateur sur ordinateur, tablette
              et mobile. Démarrez, mettez en pause, enregistrez vos tours — tout en un clic.
            </p>
          </div>

          {/* H2 #2 — Tours */}
          <div style={card}>
            <h2 style={h2Sty}>Chronomètre avec tours — Enregistrez vos temps intermédiaires</h2>
            <p style={pSty}>
              Enregistrez un nombre illimité de tours en cours de chronométrage. Chaque tour affiche
              le temps du tour et le temps total, dans un tableau épuré et lisible. Idéal pour le
              sport, la course à pied, la natation, le cyclisme ou toute activité nécessitant des
              temps intermédiaires. Comparez vos performances tour par tour en un coup d&apos;œil.
            </p>
          </div>

          {/* H2 #3 — Plein écran */}
          <div style={card}>
            <h2 style={h2Sty}>Grand chronomètre en ligne — Mode plein écran pour la classe et les réunions</h2>
            <p style={pSty}>
              Passez en mode plein écran d&apos;un clic pour afficher le chronomètre en grand sur tout
              votre écran. Idéal pour les salles de classe, les activités minutées, les réunions ou
              les sessions de sport collectif. Le chronomètre reste lisible depuis n&apos;importe quelle
              distance. Appuyez sur la touche F ou cliquez sur l&apos;icône dédiée — appuyez sur Échap
              pour quitter.
            </p>
          </div>

          {/* H2 #4 — Aesthetic */}
          <div style={card}>
            <h2 style={h2Sty}>Chronomètre aesthetic — Style épuré pour vos sessions study</h2>
            <p style={pSty}>
              Le chronomètre de horloge-live.com s&apos;inscrit dans le même univers visuel aesthetic que
              le reste du site : fond d&apos;écran personnalisable, typographie soignée et interface liquid
              glass. Parfait pour vos sessions de travail study, de révision ou de deep work — un
              chronomètre digital qui s&apos;intègre à votre setup aesthetic sans briser l&apos;ambiance. Vos
              préférences de fond et de style sont sauvegardées automatiquement.
            </p>
          </div>

          {/* H2 #5 — FAQ */}
          <div style={card}>
            <h2 style={h2Sty}>Questions fréquentes sur le chronomètre en ligne</h2>

            <h3 style={h3Sty}>Comment utiliser le chronomètre en ligne ?</h3>
            <p style={pSty}>
              Cliquez sur Démarrer pour lancer le chronomètre. Cliquez sur Pause pour le suspendre
              et sur Reprendre pour continuer. Utilisez le bouton Tour pour enregistrer un temps
              intermédiaire. Cliquez sur Réinitialiser pour remettre le compteur à zéro. Toutes les
              actions sont également accessibles au clavier.
            </p>

            <h3 style={h3Sty}>Le chronomètre en ligne est-il gratuit ?</h3>
            <p style={pSty}>
              Oui. Le chronomètre de horloge-live.com est entièrement gratuit, sans publicité et
              sans inscription. Toutes les fonctionnalités — tours, plein écran, personnalisation —
              sont accessibles immédiatement.
            </p>

            <h3 style={h3Sty}>Peut-on afficher le chronomètre en plein écran ?</h3>
            <p style={pSty}>
              Oui. Cliquez sur l&apos;icône plein écran en bas de la page ou appuyez sur la touche F.
              Le chronomètre occupe alors tout l&apos;écran — idéal pour une utilisation en classe, en
              salle de sport ou en réunion. Appuyez sur Échap pour quitter le plein écran.
            </p>

            <h3 style={h3Sty}>Le chronomètre enregistre-t-il les tours ?</h3>
            <p style={pSty}>
              Oui. Cliquez sur Tour pendant le chronométrage pour enregistrer un temps
              intermédiaire. Chaque tour affiche le temps du tour et le temps total cumulé dans un
              tableau lisible sous le chronomètre. Il n&apos;y a pas de limite au nombre de tours
              enregistrables.
            </p>

            <h3 style={h3Sty}>Le chronomètre fonctionne-t-il sur mobile ?</h3>
            <p style={pSty}>
              Oui. Le chronomètre en ligne de horloge-live.com est entièrement responsive — il
              s&apos;adapte automatiquement à tous les écrans, mobiles, tablettes et ordinateurs. Aucune
              application à installer.
            </p>
          </div>

          {/* Maillage interne */}
          <div style={card}>
            <p style={pSty}>
              Découvrez aussi notre{' '}
              <a href="/" style={linkSty}>horloge en ligne aesthetic</a>,
              notre{' '}
              <a href="/horloge-aiguille" style={linkSty}>horloge à aiguilles en ligne</a>,
              le{' '}
              <a href="/minuteur" style={linkSty}>minuteur en ligne</a>,
              l&apos;
              <a href="/monde" style={linkSty}>heure dans le monde</a>{' '}
              et l&apos;
              <a href="/examen" style={linkSty}>horloge mode examen</a>.
            </p>
          </div>

          {/* Footer microcopy */}
          <p style={{
            ...pSty,
            textAlign: 'center',
            fontSize: '13px',
            opacity: 0.5,
            marginTop: '8px',
          }}>
            horloge-live.com — chronomètre en ligne gratuit et aesthetic. Plein écran, tours,
            millisecondes. Sans pub, sans inscription.
          </p>

        </div>
      </section>
    </>
  );
}
