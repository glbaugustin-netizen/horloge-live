'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu, Settings2, Maximize2, Minimize2, LogOut, UserCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import MobileNav from '@/components/MobileNav';
import { useSettings } from '@/lib/useSettings';
import { fetchHistory, type SessionDoc } from '@/lib/useHistory';

const Sidebar      = dynamic(() => import('@/components/Sidebar'),       { ssr: false, loading: () => null });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });

/* ═══════════════════════════════════════════════════════════════
   Traductions
═══════════════════════════════════════════════════════════════ */
const LABELS = {
  fr: {
    signOut:    'Se déconnecter',
    sessions:   'Mes dernières sessions',
    noSessions: 'Aucune session enregistrée',
    colType:    'Type',
    colDuration:'Durée',
    colDate:    'Date',
    chrono:     'Chronomètre',
    minuteur:   'Minuteur',
    loading:    'Chargement…',
    settings:   'Paramètres',
    fullscreen: 'Plein écran',
    account:    'Mon compte',
  },
  en: {
    signOut:    'Sign out',
    sessions:   'My recent sessions',
    noSessions: 'No sessions recorded',
    colType:    'Type',
    colDuration:'Duration',
    colDate:    'Date',
    chrono:     'Stopwatch',
    minuteur:   'Timer',
    loading:    'Loading…',
    settings:   'Settings',
    fullscreen: 'Fullscreen',
    account:    'My account',
  },
} as const;

type Labels = typeof LABELS[keyof typeof LABELS];

/* ═══════════════════════════════════════════════════════════════
   Helpers affichage
═══════════════════════════════════════════════════════════════ */
function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  if (h > 0) return `${h}h ${m}min ${s}s`;
  if (m > 0) return `${m}min ${s}s`;
  return `${s}s`;
}

function formatDate(date: Date, language: 'fr' | 'en'): string {
  return date.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  });
}

/* ═══════════════════════════════════════════════════════════════
   Tableau historique
═══════════════════════════════════════════════════════════════ */
function HistoryTable({
  history, loading, language, t,
}: {
  history: SessionDoc[]; loading: boolean; language: 'fr' | 'en'; t: Labels;
}) {
  const containerStyle: React.CSSProperties = {
    background:          'rgba(255,255,255,0.08)',
    backdropFilter:      'blur(20px)',
    WebkitBackdropFilter:'blur(20px)',
    border:              '1px solid rgba(255,255,255,0.15)',
    borderRadius:        '16px',
    overflow:            'hidden',
    width:               '100%',
  };
  const headerCell: React.CSSProperties = {
    fontSize:       '10px',
    fontWeight:     500,
    letterSpacing:  '0.08em',
    textTransform:  'uppercase',
    color:          'rgba(255,255,255,0.35)',
    padding:        '10px 14px',
    borderBottom:   '1px solid rgba(255,255,255,0.10)',
  };
  const dataCell: React.CSSProperties = {
    fontSize: '13px',
    color:    'rgba(255,255,255,0.80)',
    padding:  '10px 14px',
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
        {t.loading}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={{ ...containerStyle, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
        {t.noSessions}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...headerCell, textAlign: 'left'  }}>{t.colType}</th>
            <th style={{ ...headerCell, textAlign: 'right' }}>{t.colDuration}</th>
            <th style={{ ...headerCell, textAlign: 'right' }}>{t.colDate}</th>
          </tr>
        </thead>
        <tbody>
          {history.map((session, idx) => {
            const isLast = idx === history.length - 1;
            return (
              <tr
                key={session.id}
                style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
              >
                <td style={{ ...dataCell, textAlign: 'left' }}>
                  {session.type === 'chrono' ? t.chrono : t.minuteur}
                </td>
                <td style={{ ...dataCell, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {formatDuration(session.duration)}
                </td>
                <td style={{ ...dataCell, textAlign: 'right', color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>
                  {formatDate(session.date, language)}
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
   Bouton icône bas desktop
═══════════════════════════════════════════════════════════════ */
function IconButton({
  children, onClick, active = false, title,
}: {
  children: React.ReactNode; onClick?: () => void; active?: boolean; title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width:              '44px',
        height:             '44px',
        borderRadius:       '50px',
        display:            'flex',
        alignItems:         'center',
        justifyContent:     'center',
        cursor:             'pointer',
        border:             `1px solid ${active ? 'var(--glass-border-accent)' : 'var(--glass-border)'}`,
        background:         active ? 'var(--glass-bg-accent)' : 'var(--glass-bg)',
        backdropFilter:     'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        color:              active ? 'var(--color-accent)' : 'rgba(255,255,255,0.80)',
        transition:         'background 150ms ease, border-color 150ms ease',
        flexShrink:         0,
      }}
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
   Composant principal
═══════════════════════════════════════════════════════════════ */
export default function ComptePageClient() {
  const {
    settings, updateFont, updateFontSize, updateTextColor, updateBackground,
    updateFormat, updateMirror, updateShowDate, updateShowSeconds, updateLanguage,
  } = useSettings();

  const language = settings.language;
  const t        = LABELS[language];
  const router   = useRouter();

  /* ── Auth ── */
  const [loading,   setLoading]   = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  /* ── UI ── */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  /* ── Historique ── */
  const [history,        setHistory]        = useState<SessionDoc[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  /* ── Vérification auth + chargement historique ── */
  useEffect(() => {
    let unsub: (() => void) | null = null;

    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace('/connexion');
          return;
        }
        setUserEmail(user.email);
        setLoading(false);
        fetchHistory().then(data => {
          setHistory(data);
          setHistoryLoading(false);
        });
      });
    }).catch(() => {
      router.replace('/connexion');
    });

    return () => { unsub?.(); };
  }, [router]);

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

  /* ── Déconnexion ── */
  const handleSignOut = async () => {
    try {
      const { signOut } = await import('@/lib/firebase');
      await signOut();
      router.replace('/connexion');
    } catch { /* silencieux */ }
  };

  /* Pendant la résolution auth, on rend rien (le fond CSS reste visible) */
  if (loading) return null;

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

      {/* ── Contenu scrollable ── */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          overflowY:      'auto',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          padding:        '80px 24px 140px',
          gap:            '20px',
          zIndex:         10,
        }}
      >
        {/* En-tête utilisateur */}
        <div
          style={{
            background:           'rgba(255,255,255,0.08)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border:               '1px solid rgba(255,255,255,0.15)',
            borderRadius:         '16px',
            padding:              '14px 20px',
            display:              'flex',
            alignItems:           'center',
            justifyContent:       'space-between',
            gap:                  '16px',
            width:                '100%',
            maxWidth:             '560px',
          }}
        >
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.80)', wordBreak: 'break-all' }}>
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              borderRadius:         '50px',
              padding:              '8px 14px',
              fontSize:             '13px',
              fontWeight:           400,
              cursor:               'pointer',
              display:              'inline-flex',
              alignItems:           'center',
              gap:                  '6px',
              whiteSpace:           'nowrap',
              flexShrink:           0,
              backdropFilter:       'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border:               '1px solid rgba(255,255,255,0.15)',
              background:           'rgba(255,255,255,0.08)',
              color:                'rgba(255,255,255,0.85)',
              transition:           'background 150ms ease, border-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            <LogOut size={14} strokeWidth={1.5} />
            {t.signOut}
          </button>
        </div>

        {/* Section historique */}
        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              fontSize:      '10px',
              fontWeight:    500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.35)',
            }}
          >
            {t.sessions}
          </span>
          <HistoryTable
            history={history}
            loading={historyLoading}
            language={language}
            t={t}
          />
        </div>
      </div>

      {/* ── 3 icônes bas centre — desktop ── */}
      {!isFullscreen && (
        <div
          className="hidden sm:flex"
          style={{
            position:  'absolute',
            bottom:    '32px',
            left:      '50%',
            transform: 'translateX(-50%)',
            gap:       '12px',
            zIndex:    30,
          }}
        >
          <IconButton
            onClick={() => setSettingsOpen(true)}
            title={t.settings}
          >
            <Settings2 size={20} strokeWidth={1.5} />
          </IconButton>
          <IconButton
            onClick={toggleFullscreen}
            active={isFullscreen}
            title={t.fullscreen}
          >
            {isFullscreen
              ? <Minimize2 size={20} strokeWidth={1.5} />
              : <Maximize2 size={20} strokeWidth={1.5} />}
          </IconButton>
          <IconButton active title={t.account}>
            <UserCheck size={20} strokeWidth={1.5} />
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
            { href: '/cgu',              label: 'CGU'              },
            { href: '/mentions-legales', label: 'Mentions légales' },
            { href: '/confidentialite',  label: 'Confidentialité'  },
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
          language={language}
          isFullscreen={isFullscreen}
          onSettingsOpen={() => setSettingsOpen(true)}
          onFullscreenToggle={toggleFullscreen}
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} language={language} />

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
