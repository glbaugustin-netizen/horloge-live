import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import MondePageClient from '@/components/MondePageClient';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: 'Horloge mondiale en ligne — Heure exacte & gratuite | horloge-live.com' },
  description:
    "Affichez l'heure exacte dans le monde entier avec notre horloge mondiale en ligne. Fuseaux horaires, heure Paris, aesthetic et gratuit. Sans pub, sans inscription.",
  alternates: { canonical: 'https://horloge-live.com/monde' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Horloge mondiale en ligne — Heure exacte & gratuite | horloge-live.com',
    description:
      "Affichez l'heure exacte dans le monde entier avec notre horloge mondiale en ligne. Fuseaux horaires, heure Paris, aesthetic et gratuit. Sans pub, sans inscription.",
    url: 'https://horloge-live.com/monde',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge mondiale en ligne — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge mondiale en ligne — Heure exacte & gratuite | horloge-live.com',
    description:
      "Affichez l'heure exacte dans le monde entier avec notre horloge mondiale en ligne. Fuseaux horaires, heure Paris, aesthetic et gratuit. Sans pub, sans inscription.",
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
      name: "Qu'est-ce qu'une horloge mondiale en ligne ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Une horloge mondiale en ligne affiche l'heure actuelle dans plusieurs villes et pays simultanément, en tenant compte des fuseaux horaires. horloge-live.com affiche l'heure en temps réel dans les principales villes mondiales, sans installation.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge mondiale affiche-t-elle l'heure de Paris ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. L'heure de Paris (fuseau Europe/Paris) est affichée en référence : UTC+1 en hiver et UTC+2 en été, avec ajustement automatique lors des changements d'heure.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge mondiale est-elle gratuite ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. horloge-live.com est entièrement gratuit, sans publicité et sans inscription. L'horloge mondiale est accessible à tous sur mobile et ordinateur.",
      },
    },
    {
      '@type': 'Question',
      name: "L'horloge mondiale tient-elle compte de l'heure d'été ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Les changements d'heure sont appliqués automatiquement pour chaque pays — vous consultez toujours l'heure locale exacte, quelle que soit la période de l'année.",
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
export default function MondePage() {
  return (
    <>
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <MondePageClient />

      {/* ── Section SEO — rendu serveur ── */}
      <section style={seoSection} aria-label="À propos de l'horloge mondiale">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* H1 */}
          <h1 style={h1Style}>
            Horloge mondiale en ligne — Heure exacte dans tous les pays
          </h1>

          {/* Intro */}
          <div style={glassCard}>
            <p style={bodyText}>
              Notre horloge mondiale en ligne affiche l&apos;heure exacte en temps réel dans les
              principales villes du monde. Synchronisée automatiquement avec votre navigateur,
              elle tient compte des fuseaux horaires et des changements d&apos;heure été/hiver pour
              chaque pays. Gratuite, sans installation et sans inscription, elle fonctionne sur
              ordinateur, tablette et mobile.
            </p>
          </div>

          {/* H2 #1 — Fuseaux horaires */}
          <div style={glassCard}>
            <h2 style={h2Style}>Fuseaux horaires en ligne — Heure dans chaque pays</h2>
            <p style={bodyText}>
              Consultez instantanément l&apos;heure locale dans les grandes capitales et villes du
              monde : heure de New York, heure de Tokyo, heure de Londres, heure de Dubaï et
              bien d&apos;autres. Chaque horloge est synchronisée en temps réel avec le fuseau
              horaire officiel de la ville, en tenant compte des règles d&apos;heure d&apos;été locales.
              Idéal pour coordonner des réunions internationales, planifier des appels avec des
              proches à l&apos;étranger ou suivre plusieurs fuseaux horaires simultanément.
            </p>
          </div>

          {/* H2 #2 — Heure de Paris */}
          <div style={glassCard}>
            <h2 style={h2Style}>Heure de Paris et heure de France dans le monde</h2>
            <p style={bodyText}>
              L&apos;horloge mondiale affiche en priorité l&apos;heure de Paris (fuseau Europe/Paris,
              UTC+1 en hiver et UTC+2 en été), référence officielle de l&apos;heure de France.
              Comparez facilement l&apos;heure de Paris avec celle de n&apos;importe quelle ville du
              monde — pratique pour les expatriés, les voyageurs et les professionnels en
              télétravail international.
            </p>
          </div>

          {/* H2 #3 — Aesthetic */}
          <div style={glassCard}>
            <h2 style={h2Style}>Une horloge mondiale aesthetic et personnalisable</h2>
            <p style={bodyText}>
              Comme toutes les pages de horloge-live.com, la page horloge mondiale respecte
              votre univers visuel : fond d&apos;écran aesthetic, paysage ou couleur unie, le tout
              dans le style liquid glass unique du site. Une horloge mondiale qui combine
              précision horaire et personnalisation aesthetic — une première dans les outils de
              fuseaux horaires en ligne.
            </p>
          </div>

          {/* H2 #4 — FAQ */}
          <div style={glassCard}>
            <h2 style={h2Style}>Questions fréquentes sur l&apos;horloge mondiale en ligne</h2>

            <h3 style={h3Style}>Qu&apos;est-ce qu&apos;une horloge mondiale en ligne ?</h3>
            <p style={bodyText}>
              Une horloge mondiale en ligne est un outil qui affiche l&apos;heure actuelle dans
              plusieurs villes et pays du monde simultanément, en tenant compte des fuseaux
              horaires et des changements d&apos;heure. horloge-live.com affiche l&apos;heure en temps
              réel dans les principales villes mondiales, directement dans votre navigateur,
              sans installation.
            </p>

            <h3 style={h3Style}>L&apos;horloge mondiale affiche-t-elle l&apos;heure de Paris ?</h3>
            <p style={bodyText}>
              Oui. L&apos;heure de Paris (fuseau Europe/Paris) est affichée en référence. Elle
              correspond à l&apos;heure officielle de France : UTC+1 en hiver et UTC+2 en été, avec
              ajustement automatique lors des changements d&apos;heure.
            </p>

            <h3 style={h3Style}>Comment voir l&apos;heure dans plusieurs pays en même temps ?</h3>
            <p style={bodyText}>
              La page horloge mondiale de horloge-live.com affiche simultanément l&apos;heure dans
              les principales villes du monde. Chaque horloge est synchronisée en temps réel
              avec son fuseau horaire officiel — aucun réglage nécessaire.
            </p>

            <h3 style={h3Style}>L&apos;horloge mondiale est-elle gratuite ?</h3>
            <p style={bodyText}>
              Oui. horloge-live.com est entièrement gratuit, sans publicité et sans inscription.
              L&apos;horloge mondiale en ligne est accessible à tous, à tout moment, sur mobile et
              ordinateur.
            </p>

            <h3 style={h3Style}>L&apos;horloge mondiale tient-elle compte de l&apos;heure d&apos;été ?</h3>
            <p style={bodyText}>
              Oui. Chaque horloge est synchronisée avec les règles officielles d&apos;heure d&apos;été
              de son pays. Les changements d&apos;heure sont appliqués automatiquement — vous
              consultez toujours l&apos;heure locale exacte, quelle que soit la période de l&apos;année.
            </p>
          </div>

          {/* Maillage interne */}
          <div style={glassCard}>
            <p style={bodyText}>
              Découvrez aussi notre{' '}
              <a href="/" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>horloge en ligne aesthetic</a>,
              notre{' '}
              <a href="/horloge-aiguille" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>horloge à aiguilles en ligne</a>,
              le{' '}
              <a href="/chrono" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>chronomètre en ligne</a>,
              le{' '}
              <a href="/minuteur" style={{ color: '#4FC3F7', textDecoration: 'underline' }}>minuteur en ligne</a>{' '}
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
            horloge-live.com — horloge mondiale en ligne, gratuite et aesthetic. Heure exacte
            dans tous les pays, sans pub, sans inscription.
          </p>

        </div>
      </section>
    </>
  );
}
