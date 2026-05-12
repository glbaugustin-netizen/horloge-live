'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Menu, Settings2, Maximize2, Minimize2, User,
  Play, Pause, RotateCcw,
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
    reset: 'Réinitialiser', set: 'Fixer',
    labelH: 'H', labelM: 'M', labelS: 'S',
    hint: 'Appuyez sur Échap pour quitter',
  },
  en: {
    hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS', millis: 'MILLIS',
    start: 'Start', pause: 'Pause', resume: 'Resume',
    reset: 'Reset', set: 'Set',
    labelH: 'H', labelM: 'M', labelS: 'S',
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
   Alarme Web Audio
═══════════════════════════════════════════════════════════════ */
function playAlarm() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    [0, 0.45, 0.9].forEach((t) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime + t);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0,    ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.35,  ctx.currentTime + t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.40);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime  + t + 0.40);
    });
  } catch {
    /* AudioContext non disponible */
  }
}

function vibrate() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

/* ═══════════════════════════════════════════════════════════════
   Sous-composants affichage
═══════════════════════════════════════════════════════════════ */
const digitBase: React.CSSProperties = {
  fontFamily: 'var(--clock-font-family)',
  fontWeight: 300,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.04em',
  lineHeight: 1,
};

function ChronoUnit({ digit, label, blink, color }: {
  digit: string; label: string; blink?: boolean; color: string;
}) {
  return (
    <div
      className={blink ? 'timer-blink' : ''}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <span className="chrono-size" style={{ ...digitBase, color }}>{digit}</span>
      <span className="clock-label">{label}</span>
    </div>
  );
}

function ChronoColon({ color }: { color: string }) {
  return (
    <span className="chrono-size" style={{ ...digitBase, color, opacity: 0.5, paddingBottom: '16px', letterSpacing: 0 }}>
      :
    </span>
  );
}

function ChronoDot({ color }: { color: string }) {
  return (
    <span className="chrono-size-millis" style={{ ...digitBase, color, opacity: 0.5, paddingBottom: '16px', letterSpacing: 0 }}>
      .
    </span>
  );
}

function MillisUnit({ digit, label, blink, color }: {
  digit: string; label: string; blink?: boolean; color: string;
}) {
  return (
    <div
      className={blink ? 'timer-blink' : ''}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <span className="chrono-size-millis" style={{ ...digitBase, color, opacity: 0.6 }}>{digit}</span>
      <span className="clock-label" style={{ fontSize: '9px' }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Champs de saisie
═══════════════════════════════════════════════════════════════ */
function TimeInput({
  value, max, label, disabled, onChange,
}: {
  value: string; max: number; label: string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          /* Pendant la frappe : on passe la valeur brute (ex. "5") sans padder.
             Cela permet de taper "5" puis "0" pour obtenir "50".
             Le parent lit parseInt() donc "5" → 5, "50" → 50, les deux sont corrects. */
          const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
          onChange(raw);
        }}
        onFocus={(e) => {
          e.target.select();
          if (!disabled) {
            e.target.style.borderColor = 'rgba(79,195,247,0.60)';
            e.target.style.background  = 'rgba(255,255,255,0.13)';
          }
        }}
        onBlur={(e) => {
          /* À la perte du focus : normaliser en 2 chiffres (ex. "5" → "05", "" → "00") */
          const raw = e.target.value.replace(/\D/g, '');
          const n   = Math.min(parseInt(raw || '0', 10), max);
          onChange(pad2(n));
          e.target.style.borderColor = 'rgba(255,255,255,0.20)';
          e.target.style.background  = disabled
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.10)';
        }}
        onKeyDown={(e) => {
          /* Entrée → valide et quitte le champ */
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        style={{
          width:             '64px',
          background:        disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.10)',
          border:            `1px solid ${disabled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.20)'}`,
          borderRadius:      '12px',
          padding:           '8px',
          fontSize:          '24px',
          fontWeight:        300,
          color:             disabled ? 'rgba(255,255,255,0.35)' : '#ffffff',
          textAlign:         'center',
          letterSpacing:     '0.04em',
          outline:           'none',
          transition:        'border-color 150ms ease, background 150ms ease',
          fontVariantNumeric: 'tabular-nums',
          cursor:            disabled ? 'not-allowed' : 'text',
        }}
      />
      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', fontWeight: 400 }}>
        {label}
      </span>
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
        el.style.background  = active ? 'rgba(79,195,247,0.30)' : 'rgba(255,255,255,0.12)';
        el.style.borderColor = active ? 'rgba(79,195,247,0.65)' : 'rgba(255,255,255,0.20)';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.background  = active ? 'rgba(79,195,247,0.22)' : 'rgba(255,255,255,0.08)';
        el.style.borderColor = active ? 'rgba(79,195,247,0.50)' : 'rgba(255,255,255,0.15)';
        el.style.transform   = 'scale(1)';
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}{label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton icône bas desktop
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
        el.style.background  = active ? 'rgba(79,195,247,0.30)' : 'var(--glass-bg-hover)';
        el.style.borderColor = active ? 'rgba(79,195,247,0.65)' : 'var(--glass-border-active)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background  = active ? 'var(--glass-bg-accent)' : 'var(--glass-bg)';
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
export default function MinuteurPageClient() {
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

  /* ── Saisie ── */
  const [inputH, setInputH] = useState('00');
  const [inputM, setInputM] = useState('05');
  const [inputS, setInputS] = useState('00');

  /* ── Timer state ── */
  const [duration,   setDuration]   = useState(0);
  const [remaining,  setRemaining]  = useState(0);
  const [running,    setRunning]    = useState(false);
  const [atZero,     setAtZero]     = useState(false);

  /* Heure de fin prévue, calculée lors du démarrage */
  const endTimeRef = useRef<number>(0);
  /* Évite de sauvegarder plusieurs fois la même session */
  const hasSavedRef = useRef(false);

  /* ── Boucle requestAnimationFrame ── */
  useEffect(() => {
    if (!running) return;
    endTimeRef.current = Date.now() + remaining;
    let id: number;
    const tick = () => {
      const r = endTimeRef.current - Date.now();
      if (r <= 0) {
        setRemaining(0);
        setRunning(false);
        setAtZero(true);
        playAlarm();
        vibrate();
        return;
      }
      setRemaining(r);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  /* ── Sauvegarde session à la fin naturelle du minuteur ── */
  useEffect(() => { hasSavedRef.current = false; }, [duration]);
  useEffect(() => {
    if (atZero && !hasSavedRef.current && duration > 0) {
      hasSavedRef.current = true;
      saveSession({ type: 'minuteur', duration, laps: null });
    }
  }, [atZero, duration]);

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

  /* ── Actions minuteur ── */
  const handleFixer = () => {
    const d =
      parseInt(inputH, 10) * 3_600_000 +
      parseInt(inputM, 10) * 60_000 +
      parseInt(inputS, 10) * 1_000;
    if (d === 0) return;
    setDuration(d);
    setRemaining(d);
    setRunning(false);
    setAtZero(false);
  };

  const handleStartPause = () => {
    if (remaining === 0) return;
    setAtZero(false);
    setRunning(r => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(duration);
    setAtZero(false);
  };

  /* ── Couleur affichage (rouge si atZero) ── */
  const displayColor = atZero ? '#fca5a5' : 'var(--color-text-primary)';

  /* ── Labels bouton démarrer/pause ── */
  const startPauseLabel = running
    ? t.pause
    : remaining > 0 && remaining < duration
      ? t.resume
      : t.start;
  const startPauseIcon = running
    ? <Pause size={18} strokeWidth={1.5} />
    : <Play  size={18} strokeWidth={1.5} />;

  const startPauseDisabled = remaining === 0 && !running;
  const fixerDisabled      = running;
  const resetDisabled      = duration === 0;

  const { h, m, s, mil } = msToDisplay(remaining);

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

        {/* Compte à rebours HH:MM:SS.mmm */}
        <div
          style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}
        >
          <ChronoUnit digit={h}   label={t.hours}   blink={atZero} color={displayColor} />
          <ChronoColon color={displayColor} />
          <ChronoUnit digit={m}   label={t.minutes}  blink={atZero} color={displayColor} />
          <ChronoColon color={displayColor} />
          <ChronoUnit digit={s}   label={t.seconds}  blink={atZero} color={displayColor} />
          <ChronoDot  color={displayColor} />
          <MillisUnit digit={mil} label={t.millis}   blink={atZero} color={displayColor} />
        </div>

        {/* Champs de saisie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <TimeInput value={inputH} max={99} label={t.labelH} disabled={running} onChange={setInputH} />
          <TimeInput value={inputM} max={59} label={t.labelM} disabled={running} onChange={setInputM} />
          <TimeInput value={inputS} max={59} label={t.labelS} disabled={running} onChange={setInputS} />
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <PillButton
            label={t.set}
            onClick={handleFixer}
            disabled={fixerDisabled}
          />
          <PillButton
            label={startPauseLabel}
            icon={startPauseIcon}
            onClick={handleStartPause}
            active={running}
            disabled={startPauseDisabled}
          />
          <PillButton
            label={t.reset}
            icon={<RotateCcw size={18} strokeWidth={1.5} />}
            onClick={handleReset}
            disabled={resetDisabled}
          />
        </div>
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
