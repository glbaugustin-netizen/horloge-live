'use client';

/**
 * Bouton discret « mode incrusté » (Picture-in-Picture).
 * — variant 'glass' : petit bouton rond liquid glass, fixé en haut à droite
 * — variant 'light' : bouton clair intégré à une barre existante (mode examen)
 * Rien n'est rendu si le navigateur ne gère pas le PiP (ex. Firefox).
 */

import { PictureInPicture2 } from 'lucide-react';

interface Props {
  supported: boolean;
  active: boolean;
  onToggle: () => void;
  language: 'fr' | 'en';
  variant?: 'glass' | 'light';
}

export default function PipButton({ supported, active, onToggle, language, variant = 'glass' }: Props) {
  if (!supported) return null;

  const label = active
    ? (language === 'fr' ? 'Fermer le mode incrusté' : 'Close picture-in-picture')
    : (language === 'fr' ? 'Mode incrusté (fenêtre flottante)' : 'Picture-in-picture (floating window)');

  if (variant === 'light') {
    return (
      <button
        onClick={onToggle}
        title={label}
        aria-label={label}
        aria-pressed={active}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50px',
          background: active ? '#e5e7eb' : '#f3f4f6',
          color: '#374151',
          border: '1px solid #e5e7eb',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 150ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = active ? '#e5e7eb' : '#f3f4f6'; }}
      >
        <PictureInPicture2 size={16} strokeWidth={1.5} />
      </button>
    );
  }

  const rest = active ? 0.95 : 0.55;

  return (
    <button
      onClick={onToggle}
      title={label}
      aria-label={label}
      aria-pressed={active}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 30,
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: `1px solid ${active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}`,
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.35), 0 6px 18px rgba(0,0,0,0.22)',
        color: 'rgba(255,255,255,0.90)',
        opacity: rest,
        transition: 'opacity 200ms ease, transform 0.28s cubic-bezier(.2,.9,.3,1.5), background 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = String(rest);
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <PictureInPicture2 size={17} strokeWidth={1.5} />
    </button>
  );
}
