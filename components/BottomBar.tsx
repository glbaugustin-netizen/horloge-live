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
   Style bouton icône rond
   — repos   : rgba(255,255,255,0.08) / border rgba(…,0.15)
   — actif   : rgba(79,195,247,0.22) / border rgba(…,0.50) [spec]
───────────────────────────────────────────────────────────── */
function iconBtnStyle(active: boolean): React.CSSProperties {
  return {
    width: '44px',
    height: '44px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: active
      ? 'rgba(79, 195, 247, 0.22)'
      : 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${active
      ? 'rgba(79, 195, 247, 0.50)'
      : 'rgba(255, 255, 255, 0.15)'}`,
    color: active ? '#B3E5FC' : 'rgba(255,255,255,0.80)',
    transition: 'background 150ms ease, border-color 150ms ease',
    flexShrink: 0,
  };
}

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
  return (
    <>
      {/* ── Settings ── */}
      <button
        onClick={onSettingsClick}
        style={iconBtnStyle(false)}
        title={language === 'fr' ? 'Paramètres' : 'Settings'}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = 'rgba(255, 255, 255, 0.14)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        <Settings2 size={20} strokeWidth={1.5} />
      </button>

      {/* ── Plein écran ── */}
      <button
        onClick={onFullscreenToggle}
        style={iconBtnStyle(isFullscreen)}
        title={language === 'fr' ? 'Plein écran' : 'Fullscreen'}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = isFullscreen
            ? 'rgba(79, 195, 247, 0.32)'
            : 'rgba(255, 255, 255, 0.14)';
          e.currentTarget.style.borderColor = isFullscreen
            ? 'rgba(79, 195, 247, 0.70)'
            : 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = isFullscreen
            ? 'rgba(79, 195, 247, 0.22)'
            : 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = isFullscreen
            ? 'rgba(79, 195, 247, 0.50)'
            : 'rgba(255, 255, 255, 0.15)';
        }}
      >
        {isFullscreen
          ? <Minimize2 size={20} strokeWidth={1.5} />
          : <Maximize2 size={20} strokeWidth={1.5} />}
      </button>

      {/* ── Compte — User si non connecté, UserCheck si connecté ── */}
      <button
        onClick={onAccountClick}
        style={iconBtnStyle(false)}
        title={language === 'fr' ? 'Mon compte' : 'My account'}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = 'rgba(255, 255, 255, 0.14)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        {isAuthenticated
          ? <UserCheck size={20} strokeWidth={1.5} />
          : <User     size={20} strokeWidth={1.5} />}
      </button>
    </>
  );
}
