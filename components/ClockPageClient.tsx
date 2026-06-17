'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Clock from '@/components/Clock';
import BottomBar from '@/components/BottomBar';
import MobileNav from '@/components/MobileNav';
import { useSettings } from '@/lib/useSettings';

/* Chargés en différé — absents du bundle initial (économise ~80 KB) */
const Sidebar       = dynamic(() => import('@/components/Sidebar'),       { ssr: false, loading: () => null });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });
const EmbedModal    = dynamic(() => import('@/components/EmbedModal'),    { ssr: false, loading: () => null });
const FlipClock     = dynamic(() => import('@/components/FlipClock'),     { ssr: false, loading: () => null });

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
    flipMode,
    setFlipMode,
    flipTheme,
    setFlipTheme,
  } = useSettings();
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [embedOpen,   setEmbedOpen]   = useState(false);
  const [accountHref, setAccountHref] = useState('/connexion');

  /* Suivi état de connexion Firebase */
  useEffect(() => {
    let unsub: (() => void) | null = null;
    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => {
        setAccountHref(user ? '/compte' : '/connexion');
      });
    }).catch(() => {});
    return () => { unsub?.(); };
  }, []);

  /* Suivi état plein écran (Échap natif du navigateur) */
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  /* Fond body selon mode flip */
  useEffect(() => {
    if (flipMode) {
      document.body.style.backgroundColor = flipTheme === 'dark' ? '#0A0A0A' : '#FFFFFF';
      document.body.style.backgroundImage = 'none';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    }
  }, [flipMode, flipTheme]);

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
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.13)',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.30)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.28)',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.85)',
            transition: 'transform 0.28s cubic-bezier(.2,.9,.3,1.5), background 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.20)';
            e.currentTarget.style.transform  = 'translateY(-2px) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
            e.currentTarget.style.transform  = 'scale(1)';
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
          onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
          aria-label="Ouvrir le menu de navigation"
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
        {flipMode ? (
          <FlipClock
            theme={flipTheme}
            showSeconds={settings.showSeconds}
            format={settings.format}
            language={settings.language}
          />
        ) : (
          <div style={settings.mirror ? { transform: 'scaleX(-1)' } : undefined}>
            <Clock
              format={settings.format}
              showDate={settings.showDate}
              showSeconds={settings.showSeconds}
              language={settings.language}
            />
          </div>
        )}
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
          <BottomBar
            onSettingsClick={() => setSettingsOpen(true)}
            onAccountClick={() => router.push(accountHref)}
            isFullscreen={isFullscreen}
            onFullscreenToggle={toggleFullscreen}
            isAuthenticated={accountHref === '/compte'}
            language={settings.language}
          />
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

          {/* Lien Intégrer */}
          <button
            onClick={() => setEmbedOpen(true)}
            style={{
              fontSize: '12px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.40)',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; }}
          >
            {settings.language === 'en' ? 'Embed' : 'Intégrer'}
          </button>
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
        flipMode={flipMode}
        setFlipMode={setFlipMode}
        flipTheme={flipTheme}
        setFlipTheme={setFlipTheme}
        onEmbedOpen={() => { setSettingsOpen(false); setEmbedOpen(true); }}
      />

      {/* ── Modale Embed ── */}
      <EmbedModal
        isOpen={embedOpen}
        onClose={() => setEmbedOpen(false)}
        language={settings.language}
      />
    </div>

    </>
  );
}
