'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import type { Settings } from '@/lib/useSettings';

/* ═══════════════════════════════════════════════════════════════
   Données arrière-plans (identiques à SettingsPanel)
═══════════════════════════════════════════════════════════════ */
const SOLID_COLORS = [
  { label: 'Deep black',  value: '#0A0A0A' },
  { label: 'Navy night',   value: '#0D1B2A' },
  { label: 'Dark forest',  value: '#0D2416' },
  { label: 'Burgundy',      value: '#2A0D0D' },
  { label: 'Night violet',   value: '#1A0D2A' },
  { label: 'Charcoal',    value: '#1A1A1A' },
  { label: 'Off-white',   value: '#F5F0E8' },
  { label: 'Beige',         value: '#E8DCC8' },
  { label: 'Kawaii pink',   value: '#FFB7C5' },
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
  { label: 'Modern 1', file: 'bg-moderne1.webp' },
  { label: 'Modern 2', file: 'bg-moderne2.webp' },
  { label: 'Modern 3', file: 'bg-moderne3.webp' },
  { label: 'Modern 4', file: 'bg-moderne4.webp' },
  { label: 'Modern 5', file: 'bg-moderne5.webp' },
  { label: 'Modern 6', file: 'bg-moderne6.webp' },
  { label: 'Modern 7', file: 'bg-moderne7.webp' },
  { label: 'Modern 8', file: 'bg-moderne8.webp' },
] as const;

const LABELS = { title: 'SETTINGS',   background: 'Background',   solidColors: 'Solid colors',   landscapes: 'Landscapes', aesthetic: 'Aesthetic', uploadBg: 'Upload an image' } as const;

/* ═══════════════════════════════════════════════════════════════
   Sous-composants
═══════════════════════════════════════════════════════════════ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--glass2-label)', marginBottom: '8px', marginTop: '4px' }}>
      {children}
    </div>
  );
}

/* Dock macOS — largeur totale constante */
function DockStrip({ items }: { items: React.ReactNode[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const growFor = (i: number) => {
    if (hovered === null) return 1;
    const d = Math.abs(i - hovered);
    if (d === 0) return 2.7;
    if (d === 1) return 1.5;
    if (d === 2) return 1.12;
    return 1;
  };
  return (
    <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
      {items.map((item, i) => (
        <div
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
          style={{ flexGrow: growFor(i), flexBasis: 0, minWidth: 0, display: 'flex', transition: 'flex-grow 280ms cubic-bezier(.34,1.56,.5,1)' }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

/* Galerie arrière-plans */
function BgGallery({ currentBg, onSelect, labels }: { currentBg: string; onSelect: (v: string) => void; labels: typeof LABELS }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const bgValue = (file: string) => `url('/backgrounds/${file}')`;
  const isActive = (value: string) => currentBg === value;

  const vignette: React.CSSProperties = {
    width: '100%', height: '56px', borderRadius: '12px', cursor: 'pointer',
    overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center',
    transition: 'border-color 150ms ease, box-shadow 200ms ease',
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(`url('${URL.createObjectURL(file)}')`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
      {/* Couleurs */}
      <div>
        <SectionTitle>{labels.solidColors}</SectionTitle>
        <DockStrip items={SOLID_COLORS.map(({ label, value }) => {
          const active = isActive(value);
          return (
            <button key={value} aria-label={`Choose color ${label}`} aria-pressed={active} onClick={() => onSelect(value)}
              style={{ ...vignette, background: value, border: active ? '2px solid rgba(255,255,255,0.80)' : '1px solid rgba(255,255,255,0.10)', boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.30)' : 'none' }} />
          );
        })} />
      </div>

      {/* Paysages */}
      <div>
        <SectionTitle>{labels.landscapes}</SectionTitle>
        <DockStrip items={LANDSCAPE_IMAGES.map(({ label, file }) => {
          const value = bgValue(file);
          const active = isActive(value);
          return (
            <button key={file} aria-label={`Choose background ${label}`} aria-pressed={active} onClick={() => onSelect(value)}
              style={{ ...vignette, backgroundImage: value, border: active ? '2px solid rgba(255,255,255,0.80)' : '1px solid rgba(255,255,255,0.10)', boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.30)' : 'none' }} />
          );
        })} />
      </div>

      {/* Aesthetic */}
      <div>
        <SectionTitle>{labels.aesthetic}</SectionTitle>
        <DockStrip items={AESTHETIC_IMAGES.map(({ label, file }) => {
          const value = bgValue(file);
          const active = isActive(value);
          return (
            <button key={file} aria-label={`Choose background ${label}`} aria-pressed={active} onClick={() => onSelect(value)}
              style={{ ...vignette, backgroundImage: value, border: active ? '2px solid rgba(255,255,255,0.80)' : '1px solid rgba(255,255,255,0.10)', boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.30)' : 'none' }} />
          );
        })} />
      </div>

      {/* Upload */}
      <div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', borderRadius: '50px', padding: '10px 20px', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.70)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        >
          <Upload size={16} strokeWidth={1.5} />
          {labels.uploadBg}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Panel principal
═══════════════════════════════════════════════════════════════ */
interface Props {
  isOpen:           boolean;
  onClose:          () => void;
  settings:         Settings;
  updateBackground: (v: string) => void;
}

export default function ConseilsSettingsPanel({ isOpen, onClose, settings, updateBackground }: Props) {
  const t = LABELS;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.20)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
          zIndex: 35, opacity: isOpen ? 1 : 0, transition: 'opacity 200ms ease',
          pointerEvents: isOpen ? 'auto' : 'none',
          // iOS Safari ne transmet pas le tap à un div « non cliquable » sans cursor:pointer
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}
      />

      {/* Panneau */}
      <section
        aria-label={t.title}
        className="max-h-[85vh] sm:max-h-[70vh]"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.045)',
          backdropFilter: 'var(--glass2-blur)', WebkitBackdropFilter: 'var(--glass2-blur)',
          border: '1px solid var(--glass2-border-card)',
          borderRadius: '28px 28px 0 0',
          padding: '20px 24px 28px',
          zIndex: 40, overflowY: 'auto',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: isOpen ? 'transform 380ms var(--glass2-ease-bounce)' : 'transform 250ms ease-in',
          pointerEvents: isOpen ? 'auto' : 'none',
          boxShadow: 'var(--glass2-shadow-card)',
        }}
      >
        {/* Gloss haut */}
        <span aria-hidden="true" style={{ display: 'block', position: 'absolute', top: 0, left: 0, right: 0, height: '64px', borderRadius: '28px 28px 0 0', background: 'linear-gradient(to bottom, rgba(255,255,255,0.10), transparent)', opacity: 0.55, pointerEvents: 'none', zIndex: 0 }} />

        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--glass2-label)' }}>
            {t.title}
          </span>
          <button
            onClick={onClose}
            aria-label="Close settings"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.50)', transition: 'color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.80)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.10)', margin: '0 0 16px' }} />

        {/* Arrière-plan */}
        <BgGallery currentBg={settings.background} onSelect={updateBackground} labels={t} />

      </section>
    </>
  );
}
