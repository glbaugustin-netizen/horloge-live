import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import ExamenPageClient from '@/components/ExamenPageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: 'Horloge examen en ligne — Plein écran, fond blanc & gratuite | horloge-live.com' },
  description:
    "Horloge pour examen en ligne gratuite. Affichez l'heure en grand, fond blanc, nom de matière et durée. Plein écran pour la classe, le bac et les concours. Sans pub.",
  alternates: { canonical: 'https://horloge-live.com/examen' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge examen en ligne — Plein écran, fond blanc & gratuite | horloge-live.com',
    description:
      "Horloge pour examen en ligne gratuite. Affichez l'heure en grand, fond blanc, nom de matière et durée. Plein écran pour la classe, le bac et les concours. Sans pub.",
    url: 'https://horloge-live.com/examen',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge examen plein écran — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge examen en ligne — Plein écran, fond blanc & gratuite | horloge-live.com',
    description:
      "Horloge pour examen en ligne gratuite. Affichez l'heure en grand, fond blanc, nom de matière et durée. Plein écran pour la classe, le bac et les concours. Sans pub.",
  },
};

/* ─── JSON-LD FAQPage ─────────────────────────────────────── */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  dateModified: '2026-06-10',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Comment utiliser l'horloge en mode examen ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Entrez le nom de la matière et la durée (optionnels), puis cliquez sur Démarrer. L'horloge s'affiche sur fond blanc. Appuyez sur F pour le plein écran, Échap pour quitter.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge pour examen est-elle gratuite ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Le mode examen est entièrement gratuit, sans publicité et sans inscription. Toutes les fonctionnalités sont accessibles immédiatement.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on afficher le nom de la matière sur l'horloge d'examen ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Saisissez le nom de la matière et la durée avant de démarrer. Ces informations s'affichent au-dessus de l'horloge pendant toute la durée de l'examen.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge pour examen fonctionne-t-elle sur tableau blanc interactif ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. horloge-live.com fonctionne dans tous les navigateurs modernes, sur ordinateur, tablette et tableau blanc interactif. Aucune installation requise.",
      },
    },
    {
      '@type': 'Question',
      name: "Quelle différence entre l'horloge examen et un minuteur d'examen ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un minuteur compte à rebours. L'horloge examen affiche l'heure réelle en cours, comme une horloge murale mais en grand sur l'écran de la classe.",
      },
    },
  ],
};

/* ─── Styles (thème clair — cohérent avec la page examen) ─── */
const section: CSSProperties = {
  background: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
  padding: '48px 24px 64px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const wrap: CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
};

const card: CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  padding: '20px 24px',
  marginBottom: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const h2Sty: CSSProperties = {
  fontSize: '17px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '10px',
  marginTop: 0,
};

const h3Sty: CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
  marginTop: '18px',
};

const pSty: CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: '#6b7280',
  lineHeight: 1.7,
  margin: 0,
};

const linkSty: CSSProperties = {
  color: '#1a1a2e',
  textDecoration: 'underline',
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function ExamenPage() {
  return (
    <>
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ExamenPageClient />

      {/* ── Section SEO — rendu serveur, sous le panneau config ── */}
      <section id="examen-seo" style={section} aria-label="À propos de l'horloge pour examen">
        <div style={wrap}>

          {/* H1 */}
          <h1 style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
            marginBottom: '28px',
            lineHeight: 1.3,
          }}>
            Horloge examen en ligne — Affichage plein écran pour la classe
          </h1>

          {/* H2 #1 */}
          <div style={card}>
            <h2 style={h2Sty}>Une horloge pour examen gratuite et sans distraction</h2>
            <p style={pSty}>
              Le mode examen de horloge-live.com affiche l&apos;heure exacte en grand sur fond blanc,
              sans aucun élément superflu. Idéal pour la projection en salle de classe, les examens,
              le bac et les concours. Entrez le nom de la matière et la durée optionnels, passez en
              plein écran — l&apos;heure s&apos;affiche immédiatement, synchronisée en temps réel avec votre
              appareil.
            </p>
          </div>

          {/* H2 #2 */}
          <div style={card}>
            <h2 style={h2Sty}>Horloge pour salle de classe — Afficher l&apos;heure en grand sur le tableau</h2>
            <p style={pSty}>
              Projetez l&apos;horloge sur votre tableau blanc interactif ou votre écran de classe en un
              clic. Le fond blanc et la typographie épurée garantissent une lisibilité maximale depuis
              tous les rangs de la salle. Compatible avec tous les ordinateurs, tablettes et projecteurs
              — aucune installation, aucun compte requis. Affichez le nom de la matière et la durée de
              l&apos;épreuve directement sur l&apos;écran pour que les élèves gardent le contexte de l&apos;examen
              en vue.
            </p>
          </div>

          {/* H2 #3 */}
          <div style={card}>
            <h2 style={h2Sty}>Horloge plein écran pour le bac, les concours et les examens officiels</h2>
            <p style={pSty}>
              Que ce soit pour le baccalauréat, un concours d&apos;entrée, un examen de certification ou
              une évaluation en classe, le mode examen s&apos;adapte à tous les contextes. Saisissez
              l&apos;intitulé de l&apos;épreuve — par exemple &quot;Mathématiques — 3h00&quot; — et affichez
              l&apos;heure en plein écran sur fond blanc. Aucune distraction, aucune publicité, aucune
              notification. Appuyez sur Échap pour quitter le plein écran à tout moment.
            </p>
          </div>

          {/* H2 #4 */}
          <div style={card}>
            <h2 style={h2Sty}>Horloge examen fond blanc — Simple, lisible et aesthetic</h2>
            <p style={pSty}>
              Contrairement aux minuteurs d&apos;examen classiques, horloge-live.com propose un affichage
              horloge — l&apos;heure réelle, pas un compte à rebours. Le fond blanc épuré et la grande
              typographie créent un rendu aesthetic et professionnel, adapté aussi bien aux salles
              d&apos;examen qu&apos;aux espaces de travail modernes. Les secondes sont optionnelles pour un
              affichage encore plus minimaliste.
            </p>
          </div>

          {/* H2 #5 — FAQ */}
          <div style={card}>
            <h2 style={h2Sty}>Questions fréquentes sur l&apos;horloge pour examen</h2>

            <h3 style={h3Sty}>Comment utiliser l&apos;horloge en mode examen ?</h3>
            <p style={pSty}>
              Entrez le nom de la matière et la durée de l&apos;épreuve (optionnels), choisissez
              d&apos;afficher ou non les secondes, puis cliquez sur Démarrer. L&apos;horloge s&apos;affiche sur
              fond blanc en grand. Cliquez sur l&apos;icône plein écran ou appuyez sur F pour projeter
              sur tout l&apos;écran. Appuyez sur Échap pour quitter.
            </p>

            <h3 style={h3Sty}>L&apos;horloge pour examen est-elle gratuite ?</h3>
            <p style={pSty}>
              Oui. Le mode examen de horloge-live.com est entièrement gratuit, sans publicité et
              sans inscription. Toutes les fonctionnalités — fond blanc, nom de matière, durée,
              plein écran — sont accessibles immédiatement.
            </p>

            <h3 style={h3Sty}>Peut-on afficher le nom de la matière sur l&apos;horloge d&apos;examen ?</h3>
            <p style={pSty}>
              Oui. Avant de démarrer, saisissez le nom de la matière (ex : &quot;Mathématiques&quot;) et
              la durée de l&apos;épreuve (ex : &quot;3h00&quot;). Ces informations s&apos;affichent au-dessus de
              l&apos;horloge pendant toute la durée de l&apos;examen.
            </p>

            <h3 style={h3Sty}>L&apos;horloge pour examen fonctionne-t-elle sur tableau blanc interactif ?</h3>
            <p style={pSty}>
              Oui. horloge-live.com fonctionne dans tous les navigateurs modernes, sur ordinateur,
              tablette et tableau blanc interactif. Aucune installation ni application requise —
              ouvrez simplement la page et passez en plein écran.
            </p>

            <h3 style={h3Sty}>Quelle différence entre l&apos;horloge examen et un minuteur d&apos;examen ?</h3>
            <p style={pSty}>
              Un minuteur d&apos;examen compte à rebours jusqu&apos;à zéro. L&apos;horloge examen de
              horloge-live.com affiche l&apos;heure réelle en cours — les élèves voient l&apos;heure
              qu&apos;il est, comme sur une horloge murale, mais en grand sur l&apos;écran de la classe.
              Les deux approches sont complémentaires selon les préférences de l&apos;enseignant.
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
              <a href="/chrono" style={linkSty}>chronomètre en ligne</a>,
              le{' '}
              <a href="/minuteur" style={linkSty}>minuteur en ligne</a>{' '}
              et l&apos;
              <a href="/monde" style={linkSty}>heure dans le monde</a>.
            </p>
          </div>

          {/* Footer microcopy */}
          <p style={{
            ...pSty,
            textAlign: 'center',
            fontSize: '13px',
            opacity: 0.6,
            marginTop: '8px',
          }}>
            horloge-live.com — horloge pour examen en ligne, gratuite et sans pub. Fond blanc,
            plein écran, nom de matière. Pour la classe, le bac et les concours.
          </p>

        </div>
      </section>
    </>
  );
}
