/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface NavLink {
  href:  string;
  label: string;
}

interface LegalPageLayoutProps {
  title:    string;
  navLinks: NavLink[];
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  navLinks,
  children,
}: LegalPageLayoutProps) {
  return (
    <div
      style={{
        backgroundColor: '#0d1b2a',
        minHeight:       '100vh',
        padding:         '48px 24px',
        color:           'rgba(255,255,255,0.70)',
        fontFamily:      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* ── Bouton retour ── */}
        <Link
          href="/"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '8px',
            fontSize:       '14px',
            color:          'rgba(255,255,255,0.60)',
            textDecoration: 'none',
            marginBottom:   '40px',
            width:          'fit-content',
            transition:     'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.90)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span>Retour à l'horloge</span>
        </Link>

        {/* ── H1 ── */}
        <h1
          style={{
            fontSize:   '28px',
            fontWeight: 500,
            color:      '#ffffff',
            textAlign:  'center',
            margin:     0,
          }}
        >
          {title}
        </h1>

        {/* ── Séparateur ── */}
        <div
          style={{
            height:     '1px',
            background: 'rgba(255,255,255,0.15)',
            margin:     '16px 0 40px',
          }}
        />

        {/* ── Contenu ── */}
        {children}

        {/* ── Navigation bas ── */}
        <nav
          style={{
            display:        'flex',
            justifyContent: 'center',
            gap:            '24px',
            flexWrap:       'wrap',
            marginTop:      '64px',
            paddingTop:     '24px',
            borderTop:      '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize:       '13px',
                color:          'rgba(255,255,255,0.40)',
                textDecoration: 'none',
                transition:     'color 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </div>
  );
}
