'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import AnalogClock from '@/components/AnalogClock';
import BottomBar from '@/components/BottomBar';
import MobileNav from '@/components/MobileNav';
import { useSettings } from '@/lib/useSettings';

/* Chargés en différé */
const Sidebar       = dynamic(() => import('@/components/Sidebar'),       { ssr: false, loading: () => null });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });

/* ── localStorage keys propres à cette page ── */
const LS_NUMBERS = 'horloge-live-analog-numbers';
const LS_STYLE   = 'horloge-live-analog-style';
const LS_FORMAT  = 'horloge-live-analog-format';
const LS_THEME   = 'horloge-live-analog-theme';

/* ── Traductions date ── */
const DATE_LABELS = {
  fr: {
    days:   ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    months: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
  },
  en: {
    days:   ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  },
} as const;

/* ─────────────────────────────────────────────────────────────
   Hint plein écran
───────────────────────────────────────────────────────────── */
function FullscreenHint({ language, onExit }: { language: 'fr'|'en'; onExit: () => void }) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3000);
  }, []);

  useEffect(() => {
    show();
    window.addEventListener('mousemove', show);
    return () => {
      window.removeEventListener('mousemove', show);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show]);

  return (
    <div
      onClick={onExit}
      style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 60,
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)', borderRadius: '50px',
        padding: '8px 16px', fontSize: '12px', fontWeight: 400,
        color: 'rgba(255,255,255,0.40)',
        opacity: visible ? 0.35 : 0,
        transition: visible ? 'opacity 300ms ease' : 'opacity 800ms ease',
        pointerEvents: visible ? 'auto' : 'none',
        cursor: 'pointer',
      }}
    >
      {language === 'fr' ? 'Appuyez sur Échap pour quitter' : 'Press Esc to exit'}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page principale horloge à aiguilles — composant client
───────────────────────────────────────────────────────────── */
export default function AnalogClockPageClient() {
  const {
    settings,
    updateFont, updateFontSize, updateTextColor, updateBackground,
    updateFormat, updateMirror, updateShowDate, updateShowSeconds, updateLanguage,
  } = useSettings();

  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [accountHref,  setAccountHref]  = useState('/connexion');

  /* ── Paramètres spécifiques à cette page (lazy init depuis localStorage) ── */
  const [showNumbers,  setShowNumbersState]  = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(LS_NUMBERS) !== 'false';
  });
  const [analogStyle,  setAnalogStyleState]  = useState<'classic' | 'minimal'>(() => {
    if (typeof window === 'undefined') return 'classic';
    return (localStorage.getItem(LS_STYLE) as 'classic' | 'minimal') || 'classic';
  });
  const [analogFormat, setAnalogFormatState] = useState<'12h' | '24h'>(() => {
    if (typeof window === 'undefined') return '12h';
    return (localStorage.getItem(LS_FORMAT) as '12h' | '24h') || '12h';
  });
  const [clockTheme, setClockThemeState] = useState<'glass' | 'white'>(() => {
    if (typeof window === 'undefined') return 'glass';
    return (localStorage.getItem(LS_THEME) as 'glass' | 'white') || 'glass';
  });

  /* ── Taille responsive du cadran ── */
  const [clockSize, setClockSize] = useState(300);

  /* ── Date courante ── */
  const [now, setNow] = useState<Date | null>(null);

  /* ── Date tick ── */
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Taille cadran selon viewport ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setClockSize(w < 640 ? 240 : w < 1024 ? 280 : 360);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ── Auth Firebase ── */
  useEffect(() => {
    let unsub: (() => void) | null = null;
    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => {
        setAccountHref(user ? '/compte' : '/connexion');
      });
    }).catch(() => {});
    return () => { unsub?.(); };
  }, []);

  /* ── Suivi plein écran ── */
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  /* ── Touche F → plein écran ── */
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

  /* ── Setters avec persistance localStorage ── */
  const setShowNumbers = useCallback((v: boolean) => {
    setShowNumbersState(v);
    try { localStorage.setItem(LS_NUMBERS, String(v)); } catch { /* noop */ }
  }, []);

  const setAnalogStyle = useCallback((v: 'classic' | 'minimal') => {
    setAnalogStyleState(v);
    try { localStorage.setItem(LS_STYLE, v); } catch { /* noop */ }
  }, []);

  const setAnalogFormat = useCallback((v: '12h' | '24h') => {
    setAnalogFormatState(v);
    try { localStorage.setItem(LS_FORMAT, v); } catch { /* noop */ }
  }, []);

  const handleClockTheme = useCallback((v: 'glass' | 'white') => {
    setClockThemeState(v);
    try { localStorage.setItem(LS_THEME, v); } catch { /* noop */ }
  }, []);

  /* ── Date formatée ── */
  const lang = settings.language;
  const tDate = DATE_LABELS[lang];
  const formattedDate = now
    ? lang === 'fr'
      ? `${tDate.days[now.getDay()]} ${now.getDate()} ${tDate.months[now.getMonth()]} ${now.getFullYear()}`
      : `${tDate.days[now.getDay()]}, ${tDate.months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
    : '';

  return (
    <>
      <div className="relative overflow-hidden" style={{ height: '100svh', minHeight: '100vh' }}>

        {/* ── Bouton hamburger (desktop/tablet) ── */}
        {!isFullscreen && (
          <button
            className="hidden sm:flex"
            onClick={() => setSidebarOpen(true)}
            style={{
              position: 'absolute', top: '24px', left: '24px', zIndex: 50,
              width: '40px', height: '40px', borderRadius: '50px',
              background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              border: '1px solid var(--glass-border)',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.80)',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; }}
            title="Menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        )}

        {/* ── Horloge centrée ── */}
        <div
          className="clock-centered"
          style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <AnalogClock
            size={clockSize}
            showNumbers={showNumbers}
            style={analogStyle}
            format={analogFormat}
            language={lang}
            clockTheme={clockTheme}
          />

          {/* Date */}
          {settings.showDate && formattedDate && (
            <p suppressHydrationWarning style={{
              fontSize: '18px', fontWeight: 400,
              color: 'rgba(255,255,255,0.50)',
              marginTop: '24px',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              textAlign: 'center',
            }}>
              {formattedDate}
            </p>
          )}
        </div>

        {/* ── Barre d'icônes bas centre — desktop/tablet ── */}
        {!isFullscreen && (
          <div
            className="hidden sm:flex"
            style={{
              position: 'absolute', bottom: '32px', left: '50%',
              transform: 'translateX(-50%)', gap: '12px', zIndex: 30,
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

        {/* ── Liens footer bas gauche — desktop/tablet ── */}
        {!isFullscreen && (
          <div
            className="hidden sm:flex"
            style={{
              position: 'absolute', bottom: '28px', left: '24px',
              zIndex: 30, gap: '16px',
            }}
          >
            {(lang === 'en'
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
                  fontSize: '12px', fontWeight: 400,
                  color: 'rgba(255,255,255,0.40)', textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.70)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)'; }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Navigation mobile ── */}
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

        {/* ── Sidebar ── */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          language={settings.language}
        />

        {/* ── Panneau paramètres (fond, police, langue…) ── */}
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
          analogOptions={{
            showNumbers,
            onShowNumbersChange: setShowNumbers,
            analogStyle,
            onAnalogStyleChange: setAnalogStyle,
            analogFormat,
            onAnalogFormatChange: setAnalogFormat,
            clockTheme,
            onClockThemeChange: handleClockTheme,
          }}
          disabledOptions={{
            seconds: true,
            mirror: true,
            format: true,
            fontSize: true,
            flipStyle: true,
            fontChoice: true,
            textColor: true,
          }}
        />
      </div>
    </>
  );
}
