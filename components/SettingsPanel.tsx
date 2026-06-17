'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, ChevronDown, ChevronUp, Upload, Code2,
} from 'lucide-react';
import { FONT_CATEGORIES, loadAllFonts } from '@/lib/googleFonts';
import type { Settings } from '@/lib/useSettings';

/* ═══════════════════════════════════════════════════════════════
   Données statiques
═══════════════════════════════════════════════════════════════ */

const SOLID_COLORS = [
  { label: 'Noir profond', value: '#0A0A0A' },
  { label: 'Nuit marine', value: '#0D1B2A' },
  { label: 'Forêt sombre', value: '#0D2416' },
  { label: 'Bordeaux', value: '#2A0D0D' },
  { label: 'Violet nuit', value: '#1A0D2A' },
  { label: 'Anthracite', value: '#1A1A1A' },
  { label: 'Blanc cassé', value: '#F5F0E8' },
  { label: 'Beige', value: '#E8DCC8' },
  { label: 'Rose kawaii', value: '#FFB7C5' },
] as const;

const LANDSCAPE_IMAGES = [
  { label: 'Nature 1', file: 'bg-nature1.webp' },
  { label: 'Nature 2', file: 'bg-nature2.webp' },
  { label: 'Nature 3', file: 'bg-nature3.webp' },
  { label: 'Nature 4', file: 'bg-nature4.webp' },
  { label: 'Nature 5', file: 'bg-nature5.webp' },
  { label: 'Nature 6', file: 'bg-nature6.webp' },
  { label: 'Nature 7', file: 'bg-nature7.webp' },
  { label: 'Nature 8', file: 'bg-nature8.webp' },
] as const;

const AESTHETIC_IMAGES = [
  { label: 'Moderne 1', file: 'bg-moderne1.webp' },
  { label: 'Moderne 2', file: 'bg-moderne2.webp' },
  { label: 'Moderne 3', file: 'bg-moderne3.webp' },
  { label: 'Moderne 4', file: 'bg-moderne4.webp' },
  { label: 'Moderne 5', file: 'bg-moderne5.webp' },
  { label: 'Moderne 6', file: 'bg-moderne6.webp' },
  { label: 'Moderne 7', file: 'bg-moderne7.webp' },
  { label: 'Moderne 8', file: 'bg-moderne8.webp' },
] as const;

const TEXT_COLORS = [
  '#FFFFFF',
  'rgba(255,255,255,0.70)',
  '#4FC3F7',
  '#81D4FA',
  '#A5D6A7',
  '#FFD54F',
  '#F48FB1',
  '#80DEEA',
  '#CE93D8',
  '#FFAB91',
] as const;

const FOCUS_KEY = 'horloge-live-focus-mode' as const;

const LABELS = {
  fr: {
    title: 'PARAMÈTRES',
    font: 'Choisir une police',
    fontSize: 'Taille du texte',
    background: 'Choisir un arrière-plan',
    textColor: 'Couleur du texte',
    format: 'Format 12h / 24h',
    mirror: 'Mode miroir',
    showDate: 'Afficher la date',
    showSeconds: 'Afficher les secondes',
    language: 'Langue',
    solidColors: 'Couleurs unies',
    landscapes: 'Paysages',
    aesthetic: 'Aesthetic',
    uploadBg: 'Importer une image',
    embedBtn: 'Intégrer sur votre site',
    focusMode: 'Mode Focus',
    focusEnable: 'Activer',
    focusDisable: 'Désactiver',
    flipStyle: 'Style Flip',
    flipThemeSec: 'THÈME FLIP',
    flipDark: 'Fond noir',
    flipLight: 'Fond blanc',
    flipFontDisabled: 'Non disponible en mode flip',
  },
  en: {
    title: 'SETTINGS',
    font: 'Choose a font',
    fontSize: 'Text size',
    background: 'Choose a background',
    textColor: 'Text color',
    format: '12h / 24h format',
    mirror: 'Mirror mode',
    showDate: 'Show date',
    showSeconds: 'Show seconds',
    language: 'Language',
    solidColors: 'Solid colors',
    landscapes: 'Landscapes',
    aesthetic: 'Aesthetic',
    uploadBg: 'Upload an image',
    embedBtn: 'Embed on your website',
    focusMode: 'Focus Mode',
    focusEnable: 'Enable',
    focusDisable: 'Disable',
    flipStyle: 'Flip Style',
    flipThemeSec: 'FLIP THEME',
    flipDark: 'Dark background',
    flipLight: 'Light background',
    flipFontDisabled: 'Not available in flip mode',
  },
} as const;

/* ── Styles boutons pill sélecteur thème flip — v2 neutre ───── */
const flipPillStyle: React.CSSProperties = {
  background: 'var(--glass2-bg)',
  border: '1px solid var(--glass2-border-card)',
  borderRadius: '50px',
  padding: '8px 20px',
  fontSize: '13px',
  color: 'var(--glass2-text-secondary)',
  cursor: 'pointer',
};

const flipPillActiveStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.22)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  borderRadius: '50px',
  padding: '8px 20px',
  fontSize: '13px',
  color: 'var(--glass2-text-primary)',
  cursor: 'pointer',
};

type PanelLabels = typeof LABELS[keyof typeof LABELS];

/* ═══════════════════════════════════════════════════════════════
   Sous-composants UI
═══════════════════════════════════════════════════════════════ */

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onClick={() => onChange(!value)}
      onKeyDown={(e) => e.key === 'Enter' && onChange(!value)}
      style={{
        width: '56px',
        height: '32px',
        borderRadius: '20px',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
        background: value ? 'rgba(255,255,255,0.22)' : 'var(--glass2-bg-recessed)',
        border: `1px solid ${value ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.16)'}`,
        boxShadow: value
          ? 'inset 0 1px 1px rgba(255,255,255,0.25), 0 16px 40px rgba(0,0,0,0.35), 0 6px 20px rgba(255,255,255,0.12)'
          : 'var(--glass2-shadow-recessed)',
      }}
    >
      {/* Voile radial — s'allume en ON */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '20px',
          background: 'radial-gradient(circle at 72% 50%, rgba(255,255,255,0.30), transparent 60%)',
          opacity: value ? 1 : 0,
          transition: 'opacity 0.38s var(--glass2-ease-bounce)',
          pointerEvents: 'none',
        }}
      />
      {/* Knob */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          position: 'absolute',
          top: '4px',
          left: '4px',
          transform: value ? 'translateX(24px)' : 'translateX(0)',
          transition: 'transform 0.38s var(--glass2-ease-bounce)',
          background: 'var(--glass2-knob-gradient)',
          boxShadow: 'var(--glass2-shadow-knob)',
          overflow: 'hidden',
        }}
      >
        {/* Gloss moitié haute du knob */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            borderRadius: '12px 12px 0 0',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.90), transparent)',
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

function ParamRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--glass2-text-secondary)',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--glass2-label)',
        marginBottom: '8px',
        marginTop: '4px',
      }}
    >
      {children}
    </div>
  );
}

/* ─── Bouton Glass v2 avec ripple ───────────────────────────── */
function GlassButton({
  onClick,
  children,
  fullWidth = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 600);
    }
    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.36)',
        height: '44px',
        padding: '0 24px',
        borderRadius: '24px',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: 600,
        background: 'rgba(255,255,255,0.14)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -8px 18px rgba(255,255,255,0.06), 0 8px 26px rgba(0,0,0,0.3)',
        transition: 'transform 0.22s cubic-bezier(.2,.9,.3,1.4), box-shadow 0.22s ease, background 0.22s ease',
        width: fullWidth ? '100%' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.20)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.75), 0 16px 38px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -8px 18px rgba(255,255,255,0.06), 0 8px 26px rgba(0,0,0,0.3)';
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px) scale(0.96)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: '8px',
            height: '8px',
            marginLeft: '-4px',
            marginTop: '-4px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.50)',
            transform: 'scale(0)',
            animation: 'glass-ripple 0.55s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
      {children}
    </button>
  );
}

function ExpandButton({
  label,
  expanded,
  onClick,
}: {
  label: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <GlassButton onClick={onClick} fullWidth>
      {label}
      {expanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
    </GlassButton>
  );
}

/* ─── Grille de polices ─────────────────────────────────────── */
function FontGrid({
  currentFont,
  onSelect,
}: {
  currentFont: string;
  onSelect: (font: string) => void;
}) {
  return (
    <div
      style={{
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '8px',
      }}
    >
      {FONT_CATEGORIES.map((category) => (
        <div key={category.label}>
          <SectionTitle>{category.label}</SectionTitle>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '8px',
            }}
          >
            {category.fonts.map((font) => {
              const isSelected = font === currentFont;
              return (
                <button
                  key={font}
                  onClick={() => onSelect(font)}
                  title={font}
                  style={{
                    borderRadius: '12px',
                    padding: '12px 8px',
                    background: isSelected
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isSelected ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.10)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div
                    style={{
                      fontFamily: `'${font}', sans-serif`,
                      fontSize: '18px',
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.2,
                    }}
                  >
                    12:45
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.40)',
                      marginTop: '4px',
                      fontFamily: '-apple-system, sans-serif',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {font}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Galerie d'arrière-plans ───────────────────────────────── */
function BgGallery({
  currentBg,
  onSelect,
  labels,
}: {
  currentBg: string;
  onSelect: (value: string) => void;
  labels: PanelLabels;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const bgValue = (file: string) => `url('/backgrounds/${file}')`;
  const isActive = (value: string) => currentBg === value;

  const vignettBase: React.CSSProperties = {
    height: '60px',
    borderRadius: '12px',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'border-color 150ms ease, transform 150ms ease',
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelect(`url('${url}')`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '8px',
      }}
    >
      {/* Couleurs unies */}
      <div>
        <SectionTitle>{labels.solidColors}</SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            gap: '8px',
          }}
        >
          {SOLID_COLORS.map(({ label, value }) => {
            const active = isActive(value);
            return (
              <button
                key={value}
                title={label}
                onClick={() => onSelect(value)}
                style={{
                  ...vignettBase,
                  background: value,
                  border: active
                    ? '2px solid rgba(255,255,255,0.70)'
                    : '1px solid rgba(255,255,255,0.10)',
                  transform: active ? 'scale(0.96)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Paysages */}
      <div>
        <SectionTitle>{labels.landscapes}</SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '8px',
          }}
        >
          {LANDSCAPE_IMAGES.map(({ label, file }) => {
            const value = bgValue(file);
            const active = isActive(value);
            return (
              <button
                key={file}
                title={label}
                onClick={() => onSelect(value)}
                style={{
                  ...vignettBase,
                  backgroundImage: value,
                  border: active
                    ? '2px solid rgba(255,255,255,0.70)'
                    : '1px solid rgba(255,255,255,0.10)',
                  transform: active ? 'scale(0.96)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Aesthetic */}
      <div>
        <SectionTitle>{labels.aesthetic}</SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '8px',
          }}
        >
          {AESTHETIC_IMAGES.map(({ label, file }) => {
            const value = bgValue(file);
            const active = isActive(value);
            return (
              <button
                key={file}
                title={label}
                onClick={() => onSelect(value)}
                style={{
                  ...vignettBase,
                  backgroundImage: value,
                  border: active
                    ? '2px solid rgba(255,255,255,0.70)'
                    : '1px solid rgba(255,255,255,0.10)',
                  transform: active ? 'scale(0.96)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Upload image personnalisée */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%',
            borderRadius: '50px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.70)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
        >
          <Upload size={16} strokeWidth={1.5} />
          {labels.uploadBg}
        </button>
      </div>
    </div>
  );
}

/* ─── Palette couleurs texte ────────────────────────────────── */
function ColorPalette({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
      {TEXT_COLORS.map((color) => {
        const isActive = current === color;
        return (
          <button
            key={color}
            title={color}
            onClick={() => onSelect(color)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: color,
              border: isActive
                ? '2px solid rgba(255,255,255,0.80)'
                : '2px solid rgba(255,255,255,0.20)',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, transform 150ms ease',
              transform: isActive ? 'scale(0.88)' : 'scale(1)',
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SettingsPanel principal
═══════════════════════════════════════════════════════════════ */

interface AnalogOptions {
  showNumbers: boolean;
  onShowNumbersChange: (val: boolean) => void;
  analogStyle: 'classic' | 'minimal';
  onAnalogStyleChange: (val: 'classic' | 'minimal') => void;
  analogFormat: '12h' | '24h';
  onAnalogFormatChange: (val: '12h' | '24h') => void;
  clockTheme: 'glass' | 'white';
  onClockThemeChange: (val: 'glass' | 'white') => void;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  updateFont: (v: string) => void;
  updateFontSize: (v: number) => void;
  updateTextColor: (v: string) => void;
  updateBackground: (v: string) => void;
  updateFormat: (v: '12h' | '24h') => void;
  updateMirror: (v: boolean) => void;
  updateShowDate: (v: boolean) => void;
  updateShowSeconds: (v: boolean) => void;
  updateLanguage: (v: 'fr' | 'en') => void;
  flipMode?: boolean;
  setFlipMode?: (v: boolean) => void;
  flipTheme?: 'dark' | 'light';
  setFlipTheme?: (v: 'dark' | 'light') => void;
  onEmbedOpen?: () => void;
  /** Props optionnelles — page /horloge-aiguille uniquement */
  analogOptions?: AnalogOptions;
  /** Options grisées et non cliquables (ex: /horloge-aiguille, /chrono, /minuteur) */
  disabledOptions?: {
    seconds?: boolean;
    mirror?: boolean;
    format?: boolean;
    fontSize?: boolean;
    flipStyle?: boolean;
    fontChoice?: boolean;
    showDate?: boolean;
    textColor?: boolean;
  };
}

const disabledStyle: React.CSSProperties = {
  opacity: 0.35,
  pointerEvents: 'none',
  cursor: 'not-allowed',
  userSelect: 'none',
};

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  updateFont,
  updateFontSize,
  updateTextColor,
  updateBackground,
  updateFormat,
  updateMirror,
  updateShowDate,
  updateShowSeconds,
  updateLanguage,
  flipMode = false,
  setFlipMode,
  flipTheme = 'dark',
  setFlipTheme,
  onEmbedOpen,
  analogOptions,
  disabledOptions,
}: SettingsPanelProps) {
  const [fontExpanded, setFontExpanded] = useState(false);
  const [bgExpanded, setBgExpanded] = useState(false);
  const [focusMode, setFocusModeLocal] = useState(false);

  const t = LABELS[settings.language];

  /* Charger toutes les polices à l'ouverture du panneau */
  useEffect(() => {
    if (isOpen) loadAllFonts();
  }, [isOpen]);

  /* Lire le mode focus depuis localStorage au montage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FOCUS_KEY) === 'true';
      setFocusModeLocal(stored);
    } catch { /* noop */ }
  }, []);

  /* Écouter la sortie plein écran via Échap */
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && focusMode) {
        setFocusModeLocal(false);
        try { localStorage.setItem(FOCUS_KEY, 'false'); } catch { /* noop */ }
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';
        document.body.style.color = '';
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [focusMode]);

  /* Activer / désactiver le mode focus */
  const handleFocusMode = useCallback(() => {
    if (!focusMode) {
      setFocusModeLocal(true);
      try { localStorage.setItem(FOCUS_KEY, 'true'); } catch { /* noop */ }
      onClose();
      document.body.style.backgroundColor = '#0A0A0A';
      document.body.style.backgroundImage = 'none';
      document.body.style.color = '#FFFFFF';
      try { document.documentElement.requestFullscreen(); } catch { /* refus navigateur */ }
    } else {
      setFocusModeLocal(false);
      try { localStorage.setItem(FOCUS_KEY, 'false'); } catch { /* noop */ }
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.color = '';
      if (document.fullscreenElement) document.exitFullscreen();
    }
  }, [focusMode, onClose]);

  const divider = (
    <div
      style={{
        height: '1px',
        background: 'rgba(255,255,255,0.10)',
        margin: '8px 0',
      }}
    />
  );

  return (
    <>
      {/* ── Overlay — clic extérieur ferme le panneau ── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.20)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 35,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 200ms ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* ── Panneau (slide depuis le bas) ── */}
      <section
        aria-label={t.title}
        className="max-h-[85vh] sm:max-h-[70vh]"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.045)',
          backdropFilter: 'var(--glass2-blur)',
          WebkitBackdropFilter: 'var(--glass2-blur)',
          border: '1px solid var(--glass2-border-card)',
          borderRadius: '28px 28px 0 0',
          padding: '20px 24px',
          zIndex: 40,
          overflowY: 'auto',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: isOpen
            ? 'transform 380ms var(--glass2-ease-bounce)'
            : 'transform 250ms ease-in',
          pointerEvents: isOpen ? 'auto' : 'none',
          boxShadow: 'var(--glass2-shadow-card)',
        }}
      >
        {/* Gloss haut du panneau (reflet bombé iOS 26) */}
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            borderRadius: '28px 28px 0 0',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.10), transparent)',
            opacity: 0.55,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* En-tête */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--glass2-label)',
            }}
          >
            {t.title}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer les paramètres"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.50)',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.80)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.50)';
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {divider}

        {/* ── 2 colonnes (1 sur mobile) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">

          {/* ════ COLONNE GAUCHE ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Section horloge analogique (page /horloge-aiguille uniquement) ── */}
            {analogOptions && (
              <>
                <div>
                  <SectionTitle>
                    {settings.language === 'fr' ? 'Horloge analogique' : 'Analog clock'}
                  </SectionTitle>

                  <ParamRow label={settings.language === 'fr' ? 'Afficher les chiffres' : 'Show numbers'}>
                    <Toggle
                      value={analogOptions.showNumbers}
                      onChange={analogOptions.onShowNumbersChange}
                    />
                  </ParamRow>

                  <ParamRow label={settings.language === 'fr' ? 'Aiguilles classiques' : 'Classic hands'}>
                    <Toggle
                      value={analogOptions.analogStyle === 'classic'}
                      onChange={(val) => analogOptions.onAnalogStyleChange(val ? 'classic' : 'minimal')}
                    />
                  </ParamRow>

                  <ParamRow label={settings.language === 'fr' ? 'Mode 24h' : '24h mode'}>
                    <Toggle
                      value={analogOptions.analogFormat === '24h'}
                      onChange={(val) => analogOptions.onAnalogFormatChange(val ? '24h' : '12h')}
                    />
                  </ParamRow>

                  <ParamRow label={settings.language === 'fr' ? 'Cadran blanc' : 'White dial'}>
                    <Toggle
                      value={analogOptions.clockTheme === 'white'}
                      onChange={(val) => analogOptions.onClockThemeChange(val ? 'white' : 'glass')}
                    />
                  </ParamRow>
                </div>

                {divider}
              </>
            )}

            {/* Police — désactivée en mode flip ou sur /horloge-aiguille */}
            <div
              title={flipMode ? t.flipFontDisabled : undefined}
              style={flipMode
                ? { opacity: 0.35, pointerEvents: 'none', cursor: 'not-allowed' }
                : disabledOptions?.fontChoice ? disabledStyle : undefined}
            >
              <ExpandButton
                label={t.font}
                expanded={fontExpanded}
                onClick={() => setFontExpanded((v) => !v)}
              />
              {fontExpanded && (
                <FontGrid
                  currentFont={settings.font}
                  onSelect={(font) => {
                    updateFont(font);
                  }}
                />
              )}
            </div>

            {divider}

            {/* Taille du texte */}
            <div style={disabledOptions?.fontSize ? disabledStyle : undefined}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: 'var(--glass2-text-secondary)',
                  }}
                >
                  {t.fontSize}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--glass2-text-secondary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {settings.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={200}
                value={settings.fontSize}
                onChange={(e) => updateFontSize(Number(e.target.value))}
                className="settings-slider"
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.30)',
                  marginTop: '4px',
                }}
              >
                <span>50px</span>
                <span>200px</span>
              </div>
            </div>

            {divider}

            {/* Style Flip */}
            <div style={disabledOptions?.flipStyle ? disabledStyle : undefined}>
              <ParamRow label={t.flipStyle}>
                <Toggle value={flipMode} onChange={(v) => setFlipMode?.(v)} />
              </ParamRow>
            </div>
          </div>

          {/* ════ COLONNE DROITE ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Arrière-plan / Thème Flip */}
            <div>
              {flipMode ? (
                /* ── Sélecteur thème flip ── */
                <div>
                  <SectionTitle>{t.flipThemeSec}</SectionTitle>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => setFlipTheme?.('dark')}
                      style={flipTheme === 'dark' ? flipPillActiveStyle : flipPillStyle}
                    >
                      ● {t.flipDark}
                    </button>
                    <button
                      onClick={() => setFlipTheme?.('light')}
                      style={flipTheme === 'light' ? flipPillActiveStyle : flipPillStyle}
                    >
                      ● {t.flipLight}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Sélecteur arrière-plan normal ── */
                <>
                  <ExpandButton
                    label={t.background}
                    expanded={bgExpanded}
                    onClick={() => setBgExpanded((v) => !v)}
                  />
                  {bgExpanded && (
                    <BgGallery
                      currentBg={settings.background}
                      onSelect={updateBackground}
                      labels={t}
                    />
                  )}
                </>
              )}
            </div>

            {divider}

            {/* Couleur du texte */}
            <div style={disabledOptions?.textColor ? disabledStyle : undefined}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'var(--glass2-text-secondary)',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                {t.textColor}
              </span>
              <ColorPalette
                current={settings.textColor}
                onSelect={updateTextColor}
              />
            </div>

            {divider}

            {/* Format 12h / 24h */}
            <div style={disabledOptions?.format ? disabledStyle : undefined}>
              <ParamRow label={t.format}>
                <Toggle
                  value={settings.format === '12h'}
                  onChange={(v) => updateFormat(v ? '12h' : '24h')}
                />
              </ParamRow>
            </div>

            {/* Mode miroir */}
            <div style={disabledOptions?.mirror ? disabledStyle : undefined}>
              <ParamRow label={t.mirror}>
                <Toggle value={settings.mirror} onChange={updateMirror} />
              </ParamRow>
            </div>

            {/* Afficher la date */}
            <div style={disabledOptions?.showDate ? disabledStyle : undefined}>
              <ParamRow label={t.showDate}>
                <Toggle value={settings.showDate} onChange={updateShowDate} />
              </ParamRow>
            </div>

            {/* Afficher les secondes */}
            <div style={disabledOptions?.seconds ? disabledStyle : undefined}>
              <ParamRow label={t.showSeconds}>
                <Toggle value={settings.showSeconds} onChange={updateShowSeconds} />
              </ParamRow>
            </div>

            {/* Langue */}
            <ParamRow label={t.language}>
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '50px',
                  padding: '4px',
                }}
              >
                {(['fr', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => updateLanguage(lang)}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      borderRadius: '50px',
                      fontSize: '13px',
                      fontWeight: 400,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 150ms ease, color 150ms ease',
                      background:
                        settings.language === lang
                          ? 'rgba(255,255,255,0.22)'
                          : 'transparent',
                      color:
                        settings.language === lang
                          ? 'var(--glass2-text-primary)'
                          : 'var(--glass2-text-inactive)',
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </ParamRow>

            {/* Séparateur Mode Focus */}
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.10)', margin: '4px 0' }} />

            {/* Mode Focus */}
            <ParamRow label={t.focusMode}>
              <GlassButton onClick={handleFocusMode}>
                {focusMode ? t.focusDisable : t.focusEnable}
              </GlassButton>
            </ParamRow>
          </div>
        </div>

        {/* ── Séparateur + bouton Intégrer ── */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.10)', margin: '12px 0' }} />
        <GlassButton onClick={onEmbedOpen ?? undefined} fullWidth>
          <Code2 size={16} strokeWidth={1.5} />
          {t.embedBtn}
        </GlassButton>
      </section>
    </>
  );
}
