'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */
type Size       = 'small' | 'medium' | 'large';
type WidgetType = 'clock' | 'chrono';
type Lang       = 'fr' | 'en';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Lang;
}

/* ─── Données tailles ────────────────────────────────────── */
const SIZE_DATA: Record<Size, { width: number; height: number; previewHeight: number; chronoHeight: number }> = {
  small:  { width: 320, height: 120, previewHeight: 80,  chronoHeight: 120 },
  medium: { width: 480, height: 160, previewHeight: 110, chronoHeight: 160 },
  large:  { width: 640, height: 200, previewHeight: 140, chronoHeight: 200 },
};

/* ─── Traductions ────────────────────────────────────────── */
const LABELS = {
  fr: {
    title:        "Intégrer sur votre site",
    typeLabel:    'Widget',
    typeClock:    'Horloge',
    typeChrono:   'Chrono',
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
    title:        'Embed on your website',
    typeLabel:    'Widget',
    typeClock:    'Clock',
    typeChrono:   'Stopwatch',
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

/* ─── Helper ─────────────────────────────────────────────── */
function buildCode(type: WidgetType, size: Size): string {
  const { width, height } = SIZE_DATA[size];
  const src = type === 'clock'
    ? `https://horloge-live.com/widget?size=${size}`
    : `https://horloge-live.com/widget/chrono?size=${size}`;
  const titleAttr = type === 'clock' ? 'Horloge en ligne' : 'Chronomètre en ligne';
  return `<iframe src="${src}"
        width="${width}" height="${height}"
        frameborder="0"
        title="${titleAttr}">
</iframe>`;
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize:      '11px',
  fontWeight:    500,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color:         'rgba(255,255,255,0.38)',
  marginBottom:  '10px',
};

/* ─── Composant ──────────────────────────────────────────── */
export default function EmbedModal({ isOpen, onClose, language = 'fr' }: EmbedModalProps) {
  const [widgetType, setWidgetType] = useState<WidgetType>('clock');
  const [size,       setSize]       = useState<Size>('medium');
  const [copied,     setCopied]     = useState(false);

  const t  = LABELS[language];
  const code = buildCode(widgetType, size);
  const { previewHeight, chronoHeight } = SIZE_DATA[size];
  const ph = widgetType === 'chrono' ? chronoHeight : previewHeight;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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

  const iframeSrc = widgetType === 'clock'
    ? `/widget?size=${size}`
    : `/widget/chrono?size=${size}`;

  return (
    <div
      aria-modal="true"
      role="dialog"
      onClick={onClose}
      style={{
        position:             'fixed',
        inset:                0,
        background:           'rgba(0,0,0,0.50)',
        backdropFilter:       'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex:               70,
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        padding:              '16px',
      }}
    >
      {/* Panneau glass v2 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:           'linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))',
          backdropFilter:       'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border:               '1px solid rgba(255,255,255,0.20)',
          boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.28), 0 20px 50px rgba(0,0,0,0.45)',
          borderRadius:         '24px',
          padding:              '24px',
          width:                '100%',
          maxWidth:             '480px',
          display:              'flex',
          flexDirection:        'column',
          gap:                  '18px',
        }}
      >

        {/* ── En-tête ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.92)' }}>
            {t.title}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              width:      '28px',
              height:     '28px',
              borderRadius: '50%',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              border:     '1px solid rgba(255,255,255,0.15)',
              cursor:     'pointer',
              color:      'rgba(255,255,255,0.55)',
              transition: 'background 150ms ease, color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.16)';
              e.currentTarget.style.color      = 'rgba(255,255,255,0.90)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color      = 'rgba(255,255,255,0.55)';
            }}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Sélecteur type — bulle coulissante glass v2 ── */}
        <div>
          <div style={LABEL_STYLE}>{t.typeLabel}</div>
          <div style={{
            position:     'relative',
            display:      'flex',
            padding:      '4px',
            borderRadius: '50px',
            background:   'var(--glass2-bg-recessed)',
            border:       '1px solid rgba(255,255,255,0.10)',
            boxShadow:    'var(--glass2-shadow-recessed)',
          }}>
            <div aria-hidden="true" style={{
              position:      'absolute',
              top:           '4px',
              left:          '4px',
              width:         'calc(50% - 4px)',
              height:        'calc(100% - 8px)',
              transform:     widgetType === 'clock' ? 'translateX(0)' : 'translateX(100%)',
              transition:    'transform 0.42s cubic-bezier(.34,1.56,.5,1)',
              pointerEvents: 'none',
              zIndex:        0,
            }}>
              <div style={{
                width:        '100%',
                height:       '100%',
                borderRadius: '50px',
                background:   'linear-gradient(160deg, rgba(255,255,255,0.26), rgba(255,255,255,0.10))',
                border:       '1px solid rgba(255,255,255,0.38)',
                boxShadow:    'inset 0 1px 1px rgba(255,255,255,0.55), 0 4px 14px rgba(0,0,0,0.22)',
              }} />
            </div>
            {(['clock', 'chrono'] as WidgetType[]).map((wt) => {
              const isActive = widgetType === wt;
              return (
                <button
                  key={wt}
                  onClick={() => setWidgetType(wt)}
                  style={{
                    position:     'relative',
                    zIndex:       1,
                    flex:         1,
                    textAlign:    'center',
                    padding:      '8px 12px',
                    borderRadius: '50px',
                    fontSize:     '13px',
                    fontWeight:   isActive ? 500 : 400,
                    cursor:       'pointer',
                    border:       'none',
                    background:   'transparent',
                    color:        isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                    transition:   'color 200ms ease',
                  }}
                >
                  {wt === 'clock' ? t.typeClock : t.typeChrono}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Sélecteur taille ── */}
        <div>
          <div style={LABEL_STYLE}>{t.sizeLabel}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['small', 'medium', 'large'] as Size[]).map((s) => {
              const isActive = size === s;
              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    flex:                 1,
                    padding:              '8px 0',
                    borderRadius:         '50px',
                    fontSize:             '13px',
                    fontWeight:           isActive ? 500 : 400,
                    cursor:               'pointer',
                    backdropFilter:       'blur(14px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                    border:               `1px solid ${isActive ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.14)'}`,
                    background:           isActive
                      ? 'linear-gradient(160deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))'
                      : 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                    boxShadow:            isActive ? 'inset 0 1px 1px rgba(255,255,255,0.50)' : 'none',
                    color:                isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                    transition:           'background 180ms ease, border-color 180ms ease, color 180ms ease, transform 0.22s cubic-bezier(.2,.9,.3,1.4)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)';
                      e.currentTarget.style.color       = 'rgba(255,255,255,0.80)';
                    }
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                      e.currentTarget.style.color       = 'rgba(255,255,255,0.55)';
                    }
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
                  onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                >
                  {t[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Aperçu ── */}
        <div>
          <div style={LABEL_STYLE}>{t.previewLabel}</div>
          <div style={{
            borderRadius: '14px',
            border:       '1px solid rgba(255,255,255,0.12)',
            overflow:     'hidden',
            height:       `${ph}px`,
            background:   '#0A0A0A',
            transition:   'height 300ms ease',
          }}>
            <iframe
              key={`${widgetType}-${size}`}
              src={iframeSrc}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              title="Aperçu widget"
            />
          </div>
        </div>

        {/* ── Code ── */}
        <div>
          <div style={LABEL_STYLE}>{t.codeLabel}</div>
          <div style={{
            background:   'rgba(0,0,0,0.35)',
            border:       '1px solid rgba(255,255,255,0.10)',
            borderRadius: '14px',
            padding:      '12px 14px',
            fontSize:     '12px',
            fontFamily:   '"JetBrains Mono", "Fira Code", monospace',
            color:        'rgba(255,255,255,0.65)',
            whiteSpace:   'pre',
            overflowX:    'auto',
            userSelect:   'all',
            lineHeight:   1.6,
          }}>
            {code}
          </div>
        </div>

        {/* ── Bouton Copier — glass v2 ── */}
        <button
          onClick={handleCopy}
          style={{
            width:                '100%',
            padding:              '12px 20px',
            borderRadius:         '50px',
            fontSize:             '14px',
            fontWeight:           500,
            cursor:               'pointer',
            backdropFilter:       'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border:               `1px solid ${copied ? 'rgba(134,239,172,0.55)' : 'rgba(255,255,255,0.36)'}`,
            background:           copied
              ? 'linear-gradient(160deg, rgba(34,197,94,0.22), rgba(34,197,94,0.08))'
              : 'linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))',
            color:                copied ? '#86efac' : 'rgba(255,255,255,0.92)',
            boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.40), 0 6px 18px rgba(0,0,0,0.22)',
            display:              'flex',
            alignItems:           'center',
            justifyContent:       'center',
            gap:                  '8px',
            transition:           'background 250ms ease, border-color 250ms ease, color 250ms ease, transform 0.26s cubic-bezier(.2,.9,.3,1.4)',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.30), rgba(255,255,255,0.12))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)';
            }
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.36)';
            }
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        >
          {copied
            ? <><Check size={16} strokeWidth={1.5} /> {t.copied}</>
            : <><Copy  size={16} strokeWidth={1.5} /> {t.copyBtn}</>}
        </button>

      </div>
    </div>
  );
}
