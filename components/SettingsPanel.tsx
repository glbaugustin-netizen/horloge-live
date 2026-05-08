'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X, ChevronDown, ChevronUp, Upload,
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
    language: 'Langue',
    solidColors: 'Couleurs unies',
    landscapes: 'Paysages',
    aesthetic: 'Aesthetic',
    uploadBg: 'Importer une image',
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
    language: 'Language',
    solidColors: 'Solid colors',
    landscapes: 'Landscapes',
    aesthetic: 'Aesthetic',
    uploadBg: 'Upload an image',
  },
} as const;

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
        width: '40px',
        height: '22px',
        borderRadius: '50px',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 200ms ease, border-color 200ms ease',
        background: value ? 'rgba(79,195,247,0.45)' : 'rgba(255,255,255,0.15)',
        border: `1px solid ${value ? 'rgba(79,195,247,0.60)' : 'rgba(255,255,255,0.20)'}`,
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: value ? '20px' : '2px',
          transition: 'left 200ms ease',
          background: value ? '#4FC3F7' : '#ffffff',
        }}
      />
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
          color: 'rgba(255,255,255,0.70)',
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
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '8px',
        marginTop: '4px',
      }}
    >
      {children}
    </div>
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
    <button
      onClick={onClick}
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
        color: 'rgba(255,255,255,0.85)',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
      }}
    >
      {label}
      {expanded ? (
        <ChevronUp size={14} strokeWidth={1.5} />
      ) : (
        <ChevronDown size={14} strokeWidth={1.5} />
      )}
    </button>
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
                      ? 'rgba(79,195,247,0.15)'
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isSelected ? 'rgba(79,195,247,0.40)' : 'rgba(255,255,255,0.10)'}`,
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
                    ? '2px solid #4fc3f7'
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
                    ? '2px solid #4fc3f7'
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
                    ? '2px solid #4fc3f7'
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
                ? '2px solid #4FC3F7'
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
  updateLanguage: (v: 'fr' | 'en') => void;
}

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
  updateLanguage,
}: SettingsPanelProps) {
  const [fontExpanded, setFontExpanded] = useState(false);
  const [bgExpanded, setBgExpanded] = useState(false);

  const t = LABELS[settings.language];

  /* Charger toutes les polices à l'ouverture du panneau */
  useEffect(() => {
    if (isOpen) loadAllFonts();
  }, [isOpen]);

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
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 24px',
          zIndex: 40,
          overflowY: 'auto',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: isOpen
            ? 'transform 350ms ease-out'
            : 'transform 250ms ease-in',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
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
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
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

            {/* Police */}
            <div>
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
            <div>
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
                    color: 'rgba(255,255,255,0.70)',
                  }}
                >
                  {t.fontSize}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-accent)',
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
          </div>

          {/* ════ COLONNE DROITE ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Arrière-plan */}
            <div>
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
            </div>

            {divider}

            {/* Couleur du texte */}
            <div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.70)',
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
            <ParamRow label={t.format}>
              <Toggle
                value={settings.format === '12h'}
                onChange={(v) => updateFormat(v ? '12h' : '24h')}
              />
            </ParamRow>

            {/* Mode miroir */}
            <ParamRow label={t.mirror}>
              <Toggle value={settings.mirror} onChange={updateMirror} />
            </ParamRow>

            {/* Afficher la date */}
            <ParamRow label={t.showDate}>
              <Toggle value={settings.showDate} onChange={updateShowDate} />
            </ParamRow>

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
                          ? 'rgba(255,255,255,0.15)'
                          : 'transparent',
                      color:
                        settings.language === lang
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </ParamRow>
          </div>
        </div>
      </section>
    </>
  );
}
