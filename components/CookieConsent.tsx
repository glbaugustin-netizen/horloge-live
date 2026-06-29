'use client';

/**
 * Bandeau de consentement cookies — style liquid glass v2.
 * Charge Microsoft Clarity (mesure d'audience) UNIQUEMENT après acceptation.
 * Les cookies strictement nécessaires (auth) ne sont pas concernés.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const CLARITY_ID  = 'xeolkk3cw3';
const CONSENT_KEY = 'horloge-live.com-cookie-consent'; // 'accepted' | 'refused'

type Lang = 'fr' | 'en';

const T = {
  fr: {
    message: "Nous utilisons un outil de mesure d'audience (Microsoft Clarity) pour améliorer le site. Les cookies nécessaires au fonctionnement restent toujours actifs.",
    accept:  'Accepter',
    refuse:  'Refuser',
    more:    'En savoir plus',
  },
  en: {
    message: 'We use an analytics tool (Microsoft Clarity) to improve the site. Cookies necessary for the site to work remain always active.',
    accept:  'Accept',
    refuse:  'Decline',
    more:    'Learn more',
  },
} as const;

/** Injecte le script Clarity (idempotent). */
function loadClarity(): void {
  if (typeof window === 'undefined') return;
  if ((window as unknown as { clarity?: unknown }).clarity) return; // déjà chargé
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r) as HTMLScriptElement; t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [shown,   setShown]   = useState(false); // pour l'animation d'entrée
  const [lang,    setLang]    = useState<Lang>('fr');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('horloge-live.com-language');
      if (stored === 'en') setLang('en');

      const consent = localStorage.getItem(CONSENT_KEY);
      if (consent === 'accepted') {
        loadClarity();
      } else if (consent !== 'refused') {
        // Pas encore de choix → afficher le bandeau
        setVisible(true);
        // Déclenche l'animation au prochain frame
        requestAnimationFrame(() => setShown(true));
      }
    } catch { /* localStorage indisponible — on n'affiche rien */ }
  }, []);

  const accept = useCallback(() => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* noop */ }
    loadClarity();
    setShown(false);
    setTimeout(() => setVisible(false), 280);
  }, []);

  const refuse = useCallback(() => {
    try { localStorage.setItem(CONSENT_KEY, 'refused'); } catch { /* noop */ }
    setShown(false);
    setTimeout(() => setVisible(false), 280);
  }, []);

  if (!visible) return null;

  const t = T[lang];

  return (
    <div
      role="dialog"
      aria-label={lang === 'fr' ? 'Consentement aux cookies' : 'Cookie consent'}
      style={{
        position:      'fixed',
        bottom:        '16px',
        left:          '16px',
        zIndex:        90,
        width:         'calc(100% - 32px)',
        maxWidth:      '380px',
        // Animation d'entrée
        opacity:       shown ? 1 : 0,
        transform:     shown ? 'translateY(0)' : 'translateY(16px)',
        transition:    'opacity 0.28s ease, transform 0.32s cubic-bezier(.2,.9,.3,1.3)',
      }}
    >
      <div
        style={{
          background:           'linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))',
          backdropFilter:       'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border:               '1px solid rgba(255,255,255,0.20)',
          boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.28), 0 20px 50px rgba(0,0,0,0.45)',
          borderRadius:         '20px',
          padding:              '18px 18px 16px',
          display:              'flex',
          flexDirection:        'column',
          gap:                  '14px',
        }}
      >
        <p style={{
          margin:     0,
          fontSize:   '13px',
          lineHeight: 1.55,
          color:      'rgba(255,255,255,0.78)',
        }}>
          {t.message}{' '}
          <Link
            href="/confidentialite"
            style={{
              color:               'rgba(255,255,255,0.92)',
              textDecoration:      'underline',
              textDecorationColor: 'rgba(255,255,255,0.35)',
              whiteSpace:          'nowrap',
            }}
          >
            {t.more}
          </Link>
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Refuser — glass discret */}
          <button
            onClick={refuse}
            style={{
              flex:                 1,
              borderRadius:         '50px',
              padding:              '9px 16px',
              fontSize:             '13px',
              fontWeight:           400,
              cursor:               'pointer',
              backdropFilter:       'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              border:               '1px solid rgba(255,255,255,0.16)',
              background:           'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
              color:                'rgba(255,255,255,0.65)',
              boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.15)',
              transition:           'background 200ms ease, border-color 200ms ease, transform 0.24s cubic-bezier(.2,.9,.3,1.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)';
              e.currentTarget.style.color       = 'rgba(255,255,255,0.85)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
              e.currentTarget.style.color       = 'rgba(255,255,255,0.65)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {t.refuse}
          </button>

          {/* Accepter — glass primaire */}
          <button
            onClick={accept}
            style={{
              flex:                 1,
              borderRadius:         '50px',
              padding:              '9px 16px',
              fontSize:             '13px',
              fontWeight:           500,
              cursor:               'pointer',
              backdropFilter:       'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              border:               '1px solid rgba(255,255,255,0.38)',
              background:           'linear-gradient(160deg, rgba(255,255,255,0.26), rgba(255,255,255,0.10))',
              color:                'rgba(255,255,255,0.95)',
              boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.22)',
              transition:           'background 200ms ease, border-color 200ms ease, transform 0.24s cubic-bezier(.2,.9,.3,1.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.34), rgba(255,255,255,0.14))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.52)';
              e.currentTarget.style.transform   = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.26), rgba(255,255,255,0.10))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)';
              e.currentTarget.style.transform   = 'scale(1)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
