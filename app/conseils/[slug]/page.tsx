import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { articles } from '@/lib/conseils';

/* ─── Génération statique des pages ──────────────────────── */
export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

/* ─── Métadonnées SEO ─────────────────────────────────────── */
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};

  return {
    title: { absolute: article.metaTitle },
    description: article.metaDescription,
    alternates: { canonical: `https://horloge-live.com/conseils/${article.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://horloge-live.com/conseils/${article.slug}`,
      images: [
        {
          url: 'https://horloge-live.com/og-image.webp',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

/* ─── Styles — liquid glass identiques aux autres pages ─── */
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

const h1Style: CSSProperties = {
  fontSize: '28px',
  fontWeight: 500,
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: '32px',
  lineHeight: 1.3,
};

const glassCard: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '12px',
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

const toolButtonStyle: CSSProperties = {
  background: 'rgba(79, 195, 247, 0.22)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(79, 195, 247, 0.50)',
  color: '#B3E5FC',
  borderRadius: '50px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function ConseilArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const faqJsonLd =
    article.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <Script
          id={`ld-json-conseil-${article.slug}-faq`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <section>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>

          {/* Flèche retour */}
          <Link
            href="/conseils"
            style={backLinkStyle}
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span>Retour aux conseils</span>
          </Link>

          {/* H1 */}
          <h1 style={h1Style}>{article.title}</h1>

          {/* Contenu */}
          <div style={glassCard}>
            {article.content ? (
              <p style={bodyText}>{article.content}</p>
            ) : (
              <p style={bodyText}>Contenu à venir.</p>
            )}
          </div>

          {/* Outil recommandé */}
          <div style={glassCard}>
            <h3 style={h3Style}>Outil recommandé</h3>
            <Link href={article.relatedTool} style={toolButtonStyle}>
              {article.relatedToolLabel}
            </Link>
          </div>

          {/* FAQ */}
          {article.faq.length > 0 && (
            <div style={glassCard}>
              <h3 style={h3Style}>Questions fréquentes</h3>
              {article.faq.map((item) => (
                <div key={item.question}>
                  <h3 style={h3Style}>{item.question}</h3>
                  <p style={bodyText}>{item.answer}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
