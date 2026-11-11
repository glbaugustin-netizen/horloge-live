'use client';

/**
 * Bulle de BD liquid glass affichée au-dessus du panneau Paramètres
 * quand un visiteur non connecté modifie un réglage.
 * Invite à se connecter pour enregistrer ses modifications.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

const T = {
  fr: { message: 'Connectez-vous pour enregistrer vos modifications.', link: 'Se connecter' },
  en: { message: 'Sign in to save your changes.', link: 'Sign in' },
} as const;

const GLASS_BG = 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))';
const GLASS_BORDER = '1px solid rgba(255,255,255,0.24)';

export default function SaveSettingsHint({
  visible,
  language,
  bottom,
}: {
  visible: boolean;
  language: 'fr' | 'en';
  /** Distance (px) depuis le bas de l'écran — juste au-dessus du panneau */
  bottom: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!mounted) return null;

  const t = T[language];

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        right: '16px',
        bottom: `${bottom}px`,
        zIndex: 51, // au-dessus du bouton menu mobile (z 50)
        maxWidth: 'calc(100% - 32px)',
        width: '320px',
        transformOrigin: 'calc(100% - 44px) 100%',
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.85)',
        transition: shown
          ? 'opacity 0.24s ease, transform 0.42s var(--glass2-ease-bounce)'
          : 'opacity 0.2s ease, transform 0.22s ease-in',
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: GLASS_BG,
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: GLASS_BORDER,
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.32), 0 18px 44px rgba(0,0,0,0.40)',
          borderRadius: '20px',
          padding: '14px 16px',
        }}
      >
        {/* Gloss bombé haut */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            borderRadius: '20px 20px 0 0',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.14), transparent)',
            pointerEvents: 'none',
          }}
        />

        <p
          style={{
            position: 'relative',
            margin: 0,
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          {t.message}{' '}
          <Link
            href="/connexion"
            style={{
              color: 'rgba(255,255,255,0.97)',
              fontWeight: 600,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(255,255,255,0.40)',
              textUnderlineOffset: '3px',
              whiteSpace: 'nowrap',
            }}
          >
            {t.link}
          </Link>
        </p>

        {/* Queue de la bulle — pointe vers le panneau */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-8px',
            right: '36px',
            width: '16px',
            height: '16px',
            transform: 'rotate(45deg)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.10))',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            borderRight: GLASS_BORDER,
            borderBottom: GLASS_BORDER,
            borderBottomRightRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}
