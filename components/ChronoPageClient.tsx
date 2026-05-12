'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Menu, Settings2, Maximize2, Minimize2, User,
  Play, Pause, RotateCcw, Flag,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import MobileNav from '@/components/MobileNav';
import { useSettings } from '@/lib/useSettings';
import { saveSession } from '@/lib/useHistory';

/* Chargés en différé — absents du bundle initial */
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false, loading: () => null });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });

/* ═══════════════════════════════════════════════════════════════
   Traductions
═══════════════════════════════════════════════════════════════ */
const LABELS = {
  fr: {
    hours: 'HEURES', minutes: 'MINUTES', seconds: 'SECONDES', millis: 'MILLIÈMES',
    start: 'Démarrer', pause: 'Pause', resume: 'Reprendre',
    reset: 'Réinitialiser', lap: 'Tour',
    lapCol: 'Tour', lapTime: 'Temps tour', totalTime: 'Temps total',
    hint: 'Appuyez sur Échap pour quitter',
  },
  en: {
    hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS', millis: 'MILLIS',
    start: 'Start', pause: 'Pause', resume: 'Resume',
    reset: 'Reset', lap: 'Lap',
    lapCol: 'Lap', lapTime: 'Lap time', totalTime: 'Total time',
    hint: 'Press Esc to exit',
  },
} as const;

/* ═══════════════════════════════════════════════════════════════
   Helpers
═══════════════════════════════════════════════════════════════ */
function pad2(n: number) { return String(n).padStart(2, '0'); }
function pad3(n: number) { return String(n).padStart(3, '0'); }

function msToDisplay(ms: number) {
  const h   = Math.floor(ms / 3_600_000);
  const m   = Math.floor((ms % 3_600_000) / 60_000);
  const s   = Math.floor((ms % 60_000) / 1_000);
  const mil = ms % 1_000;
  return { h: pad2(h), m: pad2(m), s: pad2(s), mil: pad3(mil) };
}

/* ═══════════════════════════════════════════════════════════════
   Sous-composants affichage
═══════════════════════════════════════════════════════════════ */
const digitBase: React.CSSProperties = {
  fontFamily: 'var(--clock-font-family)',
  fontWeight: 300,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--color-text-primary)',
  letterSpacing: '0.04em',
  lineHeight: 1,
};

function ChronoUnit({ digit, label }: { digit: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span className="chrono-size" style={digitBase}>{digit}</span>
      <span className="clock-label">{label}</span>
    </div>
  );
}

function ChronoColon() {
  return (
    <span
      className="chrono-size"
      style={{ ...digitBase, opacity: 0.5, paddingBottom: '16px', letterSpacing: 0 }}
    >
      :
    </span>
  );
}

function ChronoDot() {
  return (
    <span
      className="chrono-size-millis"
      style={{ ...digitBase, opacity: 0.5, paddingBottom: '16px', letterSpacing: 0 }}
    >
      .
    </span>
  );
}

function MillisUnit({ digit, label }: { digit: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span className="chrono-size-millis" style={{ ...digitBase, opacity: 0.6 }}>{digit}</span>
      <span className="clock-label" style={{ fontSize: '9px' }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tableau des tours
═══════════════════════════════════════════════════════════════ */
interface Lap { lapTime: number; totalTime: number; }
type Labels = typeof LABELS[keyof typeof LABELS];

function LapTable({ laps, t }: { laps: Lap[]; t: Labels }) {
  if (laps.length === 0) return null;

  const headerCell: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
  };
  const dataCell: React.CSSProperties = {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.80)',
    padding: '10px 14px',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        width: '100%',
        maxHeight: '240px',
        overflowY: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...headerCell, textAlign: 'left'  }}>{t.lapCol}</th>
            <th style={{ ...headerCell, textAlign: 'right' }}>{t.lapTime}</th>
            <th style={{ ...headerCell, textAlign: 'right' }}>{t.totalTime}</th>
          </tr>
        </thead>
        <tbody>
          {[...laps].reverse().map((lap, idx) => {
            const num = laps.length - idx;
            const isLatest = idx === 0;
            const lt = msToDisplay(lap.lapTime);
            const tt = msToDisplay(lap.totalTime);
            return (
              <tr
                key={num}
                style={{ borderBottom: isLatest ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
              >
                <td style={{ ...dataCell, textAlign: 'left' }}>{pad2(num)}</td>
                <td style={{
                  ...dataCell,
                  textAlign: 'right',
                  color: isLatest ? '#4FC3F7' : 'rgba(255,255,255,0.80)',
                }}>
                  {lt.m}:{lt.s}.{lt.mil}
                </td>
                <td style={{ ...dataCell, textAlign: 'right' }}>
                  {tt.h}:{tt.m}:{tt.s}.{tt.mil}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton pill
═══════════════════════════════════════════════════════════════ */
function PillButton({
  label, icon, onClick, active = false, disabled = false,
}: {
  label: string; icon?: React.ReactNode;
  onClick: () => void; active?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: '50px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${active ? 'rgba(79,195,247,0.50)' : disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)'}`,
        background: active ? 'rgba(79,195,247,0.22)' : disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
        color: active ? '#B3E5FC' : disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
        transition: 'background 150ms ease, border-color 150ms ease, transform 100ms ease',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.background = active ? 'rgba(79,195,247,0.30)' : 'rgba(255,255,255,0.12)';
        el.style.borderColor = active ? 'rgba(79,195,247,0.65)' : 'rgba(255,255,255,0.20)';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.background = active ? 'rgba(79,195,247,0.22)' : 'rgba(255,255,255,0.08)';
        el.style.borderColor = active ? 'rgba(79,195,247,0.50)' : 'rgba(255,255,255,0.15)';
        el.style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}{label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton icône bas desktop (identique à ClockPageClient)
═══════════════════════════════════════════════════════════════ */
function IconButton({
  children, onClick, active = false, href, title,
}: {
  children: React.ReactNode; onClick?: () => void;
  active?: boolean; href?: string; title?: string;
}) {
  const style: React.CSSProperties = {
    width: '44px', height: '44px', borderRadius: '50px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    border: `1px solid ${active ? 'var(--glass-border-accent)' : 'var(--glass-border)'}`,
    background: active ? 'var(--glass-bg-accent)' : 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
    color: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.80)',
    transition: 'background 150ms ease, border-color 150ms ease',
    textDecoration: 'none', flexShrink: 0,
  };
  if (href) return <Link href={href} style={style} title={title}>{children}</Link>;
  return (
    <button
      onClick={onClick} style={style} title={title}
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

/* ═══════════════════════════════════════════════════════════════
   Hint plein écran
═══════════════════════════════════════════════════════════════ */
function FullscreenHint({ language, onExit }: { language: 'fr' | 'en'; onExit: () => void }) {
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

  const label = language === 'fr' ? 'Appuyez sur Échap pour quitter' : 'Press Esc to exit';
  return (
    <div
      onClick={onExit}
      style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 60,
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)', border: '1px solid var(--glass-border)',
        borderRadius: '50px', padding: '8px 16px', fontSize: '12px', fontWeight: 400,
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

/* ═══════════════════════════════════════════════════════════════
   Composant principal
═══════════════════════════════════════════════════════════════ */
export default function ChronoPageClient() {
  const {
    settings, updateFont, updateFontSize, updateTextColor, updateBackground,
    updateFormat, updateMirror, updateShowDate, updateShowSeconds, updateLanguage,
  } = useSettings();

  const t = LABELS[settings.language];

  /* ── UI state ── */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [accountHref,  setAccountHref]  = useState('/connexion');

  useEffect(() => {
    let unsub: (() => void) | null = null;
    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => setAccountHref(user ? '/compte' : '/connexion'));
    }).catch(() => {});
    return () => { unsub?.(); };
  }, []);

  /* ── Chrono state ── */
  const [elapsed,  setElapsed]  = useState(0);
  const [running,  setRunning]  = useState(false);
  const [laps,     setLaps]     = useState<Lap[]>([]);

  /* Référence pour ancrer le chrono : Date.now() − elapsed = point zéro */
  const anchorRef = useRef<number>(0);

  /* ── Boucle requestAnimationFrame ── */
  useEffect(() => {
    if (!running) return;
    anchorRef.current = Date.now() - elapsed;
    let id: number;
    const tick = () => {
      setElapsed(Date.now() - anchorRef.current);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  /* ── Plein écran ── */
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFullscreen]);

  /* ── Actions chrono ── */
  const handleStartPause = () => {
    if (!running) anchorRef.current = Date.now() - elapsed;
    setRunning(r => !r);
  };

  const handleReset = () => {
    if (elapsed > 0) {
      saveSession({
        type: 'chrono',
        duration: elapsed,
        laps: laps.length > 0
          ? laps.map((l, i) => ({ lap: i + 1, lapTime: l.lapTime, totalTime: l.totalTime }))
          : null,
      });
    }
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!running && elapsed === 0) return;
    const cur = running ? Date.now() - anchorRef.current : elapsed;
    const prevTotal = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
    setLaps(prev => [...prev, { lapTime: cur - prevTotal, totalTime: cur }]);
  };

  /* ── Rendu ── */
  const { h, m, s, mil } = msToDisplay(elapsed);

  const startPauseLabel = running ? t.pause : elapsed > 0 ? t.resume : t.start;
  const startPauseIcon  = running
    ? <Pause size={18} strokeWidth={1.5} />
    : <Play  size={18} strokeWidth={1.5} />;

  return (
    <div className="relative overflow-hidden" style={{ height: '100svh', minHeight: '100vh' }}>

      {/* ── Hamburger desktop ── */}
      {!isFullscreen && (
        <button
          className="hidden sm:flex"
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'absolute', top: '24px', left: '24px', zIndex: 50,
            width: '40px', height: '40px', borderRadius: '50px',
            background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)', border: '1px solid var(--glass-border)',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.80)', transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; }}
          title="Menu"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      )}

      {/* ── Affichage central ── */}
      <div className="chrono-centered" style={{ zIndex: 10 }}>

        {/* Chiffres HH:MM:SS.mmm */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
          <ChronoUnit  digit={h}   label={t.hours}   />
          <ChronoColon />
          <ChronoUnit  digit={m}   label={t.minutes}  />
          <ChronoColon />
          <ChronoUnit  digit={s}   label={t.seconds}  />
          <ChronoDot   />
          <MillisUnit  digit={mil} label={t.millis}   />
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <PillButton
            label={startPauseLabel}
            icon={startPauseIcon}
            onClick={handleStartPause}
            active={running}
          />
          <PillButton
            label={t.reset}
            icon={<RotateCcw size={18} strokeWidth={1.5} />}
            onClick={handleReset}
            disabled={elapsed === 0 && !running}
          />
          <PillButton
            label={t.lap}
            icon={<Flag size={18} strokeWidth={1.5} />}
            onClick={handleLap}
            disabled={!running && elapsed === 0}
          />
        </div>

        {/* Tableau des tours */}
        <LapTable laps={laps} t={t} />
      </div>

      {/* ── 3 icônes bas centre — desktop ── */}
      {!isFullscreen && (
        <div
          className="hidden sm:flex"
          style={{
            position: 'absolute', bottom: '32px', left: '50%',
            transform: 'translateX(-50%)', gap: '12px', zIndex: 30,
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
          <IconButton href={accountHref} title={settings.language === 'fr' ? 'Mon compte' : 'My account'}>
            <User size={20} strokeWidth={1.5} />
          </IconButton>
        </div>
      )}

      {/* ── Liens footer bas gauche — desktop ── */}
      {!isFullscreen && (
        <div
          className="hidden sm:flex"
          style={{ position: 'absolute', bottom: '28px', left: '24px', zIndex: 30, gap: '16px' }}
        >
          {[
            { href: '/cgu',             label: 'CGU'              },
            { href: '/mentions-legales', label: 'Mentions légales' },
            { href: '/confidentialite', label: 'Confidentialité'  },
          ].map(({ href, label }) => (
            <Link
              key={href} href={href}
              style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.40)', textDecoration: 'none', transition: 'color 150ms ease' }}
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
      {isFullscreen && <FullscreenHint language={settings.language} onExit={toggleFullscreen} />}

      {/* ── Sidebar ── */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} language={settings.language} />

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
  );
}
