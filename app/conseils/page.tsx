import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { articles } from '@/lib/conseils';

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: 'Conseils révisions, concentration et gestion du temps | horloge-live.com' },
  description:
    "Conseils pratiques pour réviser efficacement, rester concentré et bien gérer son temps : Pomodoro, examens, planning, décalage horaire et plus.",
  alternates: { canonical: 'https://horloge-live.com/conseils' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Conseils révisions, concentration et gestion du temps | horloge-live.com',
    description:
      "Conseils pratiques pour réviser efficacement, rester concentré et bien gérer son temps.",
    url: 'https://horloge-live.com/conseils',
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Conseils révisions et concentration — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conseils révisions, concentration et gestion du temps | horloge-live.com',
    description:
      "Conseils pratiques pour réviser efficacement, rester concentré et bien gérer son temps.",
  },
};

/* ─── Styles ──────────────────────────────────────────────── */
const h1Style: CSSProperties = {
  fontSize: '28px',
  fontWeight: 500,
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: '32px',
  lineHeight: 1.3,
};

const cardStyle: CSSProperties = {
  borderRadius: '16px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  textDecoration: 'none',
};

const cardTitleStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.90)',
  margin: 0,
};

const cardExcerptStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.65)',
  lineHeight: 1.5,
  margin: 0,
};

const cardLinkStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(79, 195, 247, 0.90)',
  marginTop: '4px',
};

const backLinkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.60)',
  textDecoration: 'none',
  marginBottom: '32px',
  width: 'fit-content',
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function ConseilsPage() {
  return (
    <section>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px 72px' }}>

        {/* Flèche retour vers l'horloge */}
        <Link href="/" style={backLinkStyle}>
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span>Retour à l&apos;horloge</span>
        </Link>

        {/* H1 */}
        <h1 style={h1Style}>
          Conseils pour réviser, se concentrer et gérer son temps
        </h1>

        {/* Grille de cartes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/conseils/${article.slug}`}
              className="glass"
              style={cardStyle}
            >
              <h2 style={cardTitleStyle}>{article.title}</h2>
              <p style={cardExcerptStyle}>{article.excerpt}</p>
              <span style={cardLinkStyle}>Lire l&apos;article →</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
