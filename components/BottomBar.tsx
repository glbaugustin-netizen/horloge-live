'use client';

import { Settings2, Maximize2, Minimize2, User, UserCheck } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Interface
   Le container (position, bottom, left, gap, z-index) est géré
   par le composant appelant :
   — mobile  : div sm:hidden flex + BAR_BASE dans MobileNav
   — desktop : div hidden sm:flex position:absolute bottom:32px
               left:50% transform:translateX(-50%) gap:12px
───────────────────────────────────────────────────────────── */
export interface BottomBarProps {
  onSettingsClick: () => void;
  onAccountClick: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  isAuthenticated: boolean;
  language?: 'fr' | 'en';
}

/* ─────────────────────────────────────────────────────────────
   Style bouton icône rond — Liquid Glass v2
───────────────────────────────────────────────────────────── */
const iconBtnBase: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.13)',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.34)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -8px 16px rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.32)',
  color: 'rgba(255,255,255,0.90)',
  transition: 'transform 0.28s cubic-bezier(.2,.9,.3,1.5)',
  flexShrink: 0,
};

/* ─────────────────────────────────────────────────────────────
   Composant — 3 boutons rendus en fragment (pas de wrapper)
───────────────────────────────────────────────────────────── */
export default function BottomBar({
  onSettingsClick,
  onAccountClick,
  isFullscreen,
  onFullscreenToggle,
  isAuthenticated,
  language = 'fr',
}: BottomBarProps) {
  const hoverOn  = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; };
  const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; };
  const press    = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(0.9)'; };
  const release  = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; };

  return (
    <>
      {/* ── Settings ── */}
      <button
        onClick={onSettingsClick}
        style={iconBtnBase}
        title={language === 'fr' ? 'Paramètres' : 'Settings'}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onMouseDown={press}
        onMouseUp={release}
      >
        <Settings2 size={20} strokeWidth={1.5} />
      </button>

      {/* ── Plein écran ── */}
      <button
        onClick={onFullscreenToggle}
        style={iconBtnBase}
        title={language === 'fr' ? 'Plein écran' : 'Fullscreen'}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onMouseDown={press}
        onMouseUp={release}
      >
        {isFullscreen
          ? <Minimize2 size={20} strokeWidth={1.5} />
          : <Maximize2 size={20} strokeWidth={1.5} />}
      </button>

      {/* ── Compte — User si non connecté, UserCheck si connecté ── */}
      <button
        onClick={onAccountClick}
        style={iconBtnBase}
        title={language === 'fr' ? 'Mon compte' : 'My account'}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onMouseDown={press}
        onMouseUp={release}
      >
        {isAuthenticated
          ? <UserCheck size={20} strokeWidth={1.5} />
          : <User     size={20} strokeWidth={1.5} />}
      </button>
    </>
  );
}
