'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */
type Size = 'small' | 'medium' | 'large';
type Lang = 'fr' | 'en';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Lang;
}

/* ─── Données tailles ────────────────────────────────────── */
const SIZE_DATA: Record<Size, { width: number; height: number; previewHeight: number }> = {
  small:  { width: 320, height: 120, previewHeight: 80  },
  medium: { width: 480, height: 160, previewHeight: 110 },
  large:  { width: 640, height: 200, previewHeight: 140 },
};

/* ─── Traductions ────────────────────────────────────────── */
const LABELS = {
  fr: {
    title:        "Intégrer l'horloge",
    sizeLabel:    'Taille',
    small:        'Petite',
    medium:       'Moyenne',
    large:        'Grande',
    previewLabel: 'Aperçu',
    codeLabel:    "Code à intégrer",
    copyBtn:      'Copier le code',
    copied:       'Copié !',
  },
  en: {
    title:        'Embed the clock',
    sizeLabel:    'Size',
    small:        'Small',
    medium:       'Medium',
    large:        'Large',
    previewLabel: 'Preview',
    codeLabel:    'Embed code',
    copyBtn:      'Copy code',
    copied:       'Copied!',
  },
} as const;

/* ─── Helper — génère le code iframe ─────────────────────── */
function buildCode(size: Size): string {
  const { width, height } = SIZE_DATA[size];
  return `<iframe src="https://horloge-live.com/widget?size=${size}"
        width="${width}" height="${height}"
        frameborder="0"
        title="Horloge en ligne">
</iframe>`;
}

/* ─── Styles partagés ────────────────────────────────────── */
const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
};

/* ─── Composant ──────────────────────────────────────────── */
export default function EmbedModal({ isOpen, onClose, language = 'fr' }: EmbedModalProps) {
  const [size, setSize]       = useState<Size>('medium');
  const [copied, setCopied]   = useState(false);

  const t    = LABELS[language];
  const code = buildCode(size);
  const { previewHeight } = SIZE_DATA[size];

  /* Fermeture via Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [code]);

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      aria-modal="true"
      role="dialog"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.50)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Panneau */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >

        {/* ── A) En-tête ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#ffffff' }}>
            {t.title}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.50)',
              padding: '4px',
              borderRadius: '50%',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.80)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── B) Sélecteur de taille ── */}
        <div>
          <div style={{ ...LABEL_STYLE, marginBottom: '10px' }}>{t.sizeLabel}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['small', 'medium', 'large'] as Size[]).map((s) => {
              const isActive = size === s;
              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 400,
                    cursor: 'pointer',
                    border: `1px solid ${isActive ? 'rgba(79,195,247,0.50)' : 'rgba(255,255,255,0.15)'}`,
                    background: isActive ? 'rgba(79,195,247,0.22)' : 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    color: isActive ? '#B3E5FC' : 'rgba(255,255,255,0.70)',
                    transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }
                  }}
                >
                  {t[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── C) Aperçu iframe ── */}
        <div>
          <div style={{ ...LABEL_STYLE, marginBottom: '10px' }}>{t.previewLabel}</div>
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.10)',
              overflow: 'hidden',
              height: `${previewHeight}px`,
              background: '#0A0A0A',
            }}
          >
            <iframe
              src={`/widget?size=${size}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
              title="Aperçu horloge"
            />
          </div>
        </div>

        {/* ── D) Code à copier ── */}
        <div>
          <div style={{ ...LABEL_STYLE, marginBottom: '10px' }}>{t.codeLabel}</div>
          <div
            style={{
              background: 'rgba(0,0,0,0.30)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '12px',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              color: 'rgba(255,255,255,0.70)',
              whiteSpace: 'pre',
              overflowX: 'auto',
              userSelect: 'all',
              lineHeight: 1.6,
            }}
          >
            {code}
          </div>
        </div>

        {/* ── E) Bouton Copier ── */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            border: `1px solid ${copied ? 'rgba(79,195,247,0.50)' : 'rgba(79,195,247,0.50)'}`,
            background: 'rgba(79,195,247,0.22)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#B3E5FC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(79,195,247,0.32)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(79,195,247,0.22)'; }}
        >
          {copied
            ? <><Check size={16} strokeWidth={1.5} /> {t.copied}</>
            : <><Copy size={16} strokeWidth={1.5} /> {t.copyBtn}</>}
        </button>

      </div>
    </div>
  );
}
