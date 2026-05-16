'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, Settings2, Maximize2, Minimize2, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import Clock from '@/components/Clock';
import MobileNav from '@/components/MobileNav';
import SeoContent from '@/components/SeoContent';
import { useSettings } from '@/lib/useSettings';

/* Chargés en différé — absents du bundle initial (économise ~80 KB) */
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false, loading: () => null });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });

/* ─────────────────────────────────────────────────────────────
   Bouton icône rond — barre du bas desktop
───────────────────────────────────────────────────────────── */
function IconButton({
  children,
  onClick,
  active = false,
  href,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  href?: string;
  title?: string;
}) {
  const style: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: `1px solid ${active ? 'var(--glass-border-accent)' : 'var(--glass-border)'}`,
    background: active ? 'var(--glass-bg-accent)' : 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    color: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.80)',
    transition: 'background 150ms ease, border-color 150ms ease',
    textDecoration: 'none',
    flexShrink: 0,
  };

  if (href) {
    return (
      <Link href={href} style={style} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={style}
      title={title}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = active ? 'rgba(79,195,247,0.30)' : 'var(--glass-bg-hover)';
        el.style.borderColor = active ? 'rgba(79,195,247,0.65)' : 'var(--glass-border-active)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = active ? 'var(--glass-bg-accent)' : 'var(--glass-bg)';
        el.style.borderColor = active ? 'var(--glass-border-accent)' : 'var(--glass-border)';
      }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hint plein écran
───────────────────────────────────────────────────────────── */
function FullscreenHint({
  language,
  onExit,
}: {
  language: 'fr' | 'en';
  onExit: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 3000);
  }, []);

  useEffect(() => {
    show();
    window.addEventListener('mousemove', show);
    return () => {
      window.removeEventListener('mousemove', show);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [show]);

  const label =
    language === 'fr' ? 'Appuyez sur Échap pour quitter' : 'Press Esc to exit';

  return (
    <div
      onClick={onExit}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 60,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: '50px',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 400,
        color: 'rgba(255,255,255,0.40)',
        opacity: visible ? 0.35 : 0,
        transition: visible ? 'opacity 300ms ease' : 'opacity 800ms ease',
        pointerEvents: visible ? 'auto' : 'none',
        cursor: 'pointer',
      }}
    >
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page principale horloge — composant client
───────────────────────────────────────────────────────────── */
export default function ClockPageClient() {
  const {
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
  } = useSettings();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Suivi état plein écran (Échap natif du navigateur) */
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  /* Touche F → bascule plein écran (sauf si focus input) */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
    <div
      className="relative overflow-hidden"
      style={{ height: '100svh', minHeight: '100vh' }}
    >
      {/* ── Bouton hamburger (desktop/tablet, masqué sur mobile) ── */}
      {!isFullscreen && (
        <button
          className="hidden sm:flex"
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            zIndex: 50,
            width: '40px',
            height: '40px',
            borderRadius: '50px',
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--glass-border)',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.80)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--glass-bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--glass-bg)';
          }}
          title="Menu"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      )}

      {/* ── Horloge centrée ──
          Desktop/tablet : top 50%
          Mobile : top calc(50% - 56px) — compensé par les 2 barres (112px)
          → géré par la classe CSS .clock-centered dans globals.css
      ── */}
      <div className="clock-centered" style={{ zIndex: 10 }}>
        <div style={settings.mirror ? { transform: 'scaleX(-1)' } : undefined}>
          <Clock
            format={settings.format}
            showDate={settings.showDate}
            showSeconds={settings.showSeconds}
            language={settings.language}
          />
        </div>
      </div>

      {/* ── 3 icônes bas centre — desktop/tablet uniquement ── */}
      {!isFullscreen && (
        <div
          className="hidden sm:flex"
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            gap: '12px',
            zIndex: 30,
          }}
        >
          <IconButton
            onClick={() => setSettingsOpen(true)}
            title={settings.language === 'fr' ? 'Paramètres' : 'Settings'}
          >
            <Settings2 size={20} strokeWidth={1.5} />
          </IconButton>

          <IconButton
            onClick={toggleFullscreen}
            active={isFullscreen}
            title={settings.language === 'fr' ? 'Plein écran' : 'Fullscreen'}
          >
            {isFullscreen
              ? <Minimize2 size={20} strokeWidth={1.5} />
              : <Maximize2 size={20} strokeWidth={1.5} />}
          </IconButton>

          <IconButton
            href="/connexion"
            title={settings.language === 'fr' ? 'Mon compte' : 'My account'}
          >
            <User size={20} strokeWidth={1.5} />
          </IconButton>
        </div>
      )}

      {/* ── Liens footer bas gauche — desktop/tablet uniquement ── */}
      {!isFullscreen && (
        <div
          className="hidden sm:flex"
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '24px',
            zIndex: 30,
            gap: '16px',
          }}
        >
          {(settings.language === 'en'
            ? [
                { href: '/cgu',              label: 'Terms of use'   },
                { href: '/mentions-legales', label: 'Legal notice'   },
                { href: '/confidentialite',  label: 'Privacy policy' },
              ]
            : [
                { href: '/cgu',              label: 'CGU'              },
                { href: '/mentions-legales', label: 'Mentions légales' },
                { href: '/confidentialite',  label: 'Confidentialité'  },
              ]
          ).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.40)',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  'rgba(255,255,255,0.70)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  'rgba(255,255,255,0.40)';
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* ── Navigation mobile — 2 barres fixes (masquées sur sm+) ── */}
      {!isFullscreen && (
        <MobileNav
          language={settings.language}
          isFullscreen={isFullscreen}
          onSettingsOpen={() => setSettingsOpen(true)}
          onFullscreenToggle={toggleFullscreen}
        />
      )}

      {/* ── Hint plein écran ── */}
      {isFullscreen && (
        <FullscreenHint language={settings.language} onExit={toggleFullscreen} />
      )}

      {/* ── Sidebar navigation (desktop/tablet) ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        language={settings.language}
      />

      {/* ── Panneau paramètres ── */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        updateFont={updateFont}
        updateFontSize={updateFontSize}
        updateTextColor={updateTextColor}
        updateBackground={updateBackground}
        updateFormat={updateFormat}
        updateMirror={updateMirror}
        updateShowDate={updateShowDate}
        updateShowSeconds={updateShowSeconds}
        updateLanguage={updateLanguage}
      />
    </div>

    <SeoContent language={settings.language} />
    </>
  );
}
