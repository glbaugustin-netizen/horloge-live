import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { articles } from '@/lib/conseils';

/* ─── Markdown-lite renderer ─────────────────────────────────── */
const linkStyle: CSSProperties = { color: 'rgba(255,255,255,0.80)', textDecoration: 'underline', textUnderlineOffset: '3px' };

function parseInline(text: string, key: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(<strong key={`${key}-b${i}`}>{match[1]}</strong>);
    } else {
      parts.push(<Link key={`${key}-l${i}`} href={match[3]} style={linkStyle}>{match[2]}</Link>);
    }
    last = regex.lastIndex;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function ContentBody({ content }: { content: string }) {
  if (!content) return <p style={bodyText}>Contenu à venir.</p>;

  // Split into H2 sections
  const rawSections = content.split(/\n## /);
  const sections: { heading: string | null; body: string }[] = [];

  const first = rawSections[0];
  if (first.startsWith('## ')) {
    const nl = first.indexOf('\n');
    sections.push({ heading: first.slice(3, nl === -1 ? undefined : nl), body: nl === -1 ? '' : first.slice(nl + 1) });
  } else {
    sections.push({ heading: null, body: first });
  }
  for (let s = 1; s < rawSections.length; s++) {
    const nl = rawSections[s].indexOf('\n');
    sections.push({ heading: rawSections[s].slice(0, nl === -1 ? undefined : nl), body: nl === -1 ? '' : rawSections[s].slice(nl + 1) });
  }

  return (
    <>
      {sections.map((section, si) => {
        if (!section.heading && !section.body.trim()) return null;
        const paragraphs = section.body.split(/\n\n+/).filter(Boolean);
        return (
          <div key={si} style={glassCard}>
            {section.heading && <h2 style={h2Style}>{section.heading}</h2>}
            {paragraphs.map((para, pi) => {
              const trimmed = para.trim();
              // Bold-only paragraph → sub-heading
              if (/^\*\*.+\*\*$/.test(trimmed)) {
                return <h3 key={pi} style={h3Style}>{trimmed.slice(2, -2)}</h3>;
              }
              return (
                <p key={pi} style={{ ...bodyText, marginBottom: pi < paragraphs.length - 1 ? '12px' : 0 }}>
                  {parseInline(trimmed, `${si}-${pi}`)}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

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
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.20)',
  borderRadius: '20px',
  padding: '20px 22px',
  marginBottom: '12px',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.40), 0 8px 24px rgba(0,0,0,0.22)',
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

const toolButtonStyle: CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.36)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.50)',
  color: 'rgba(255,255,255,0.92)',
  borderRadius: '50px',
  padding: '10px 22px',
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
          <ContentBody content={article.content} />

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
