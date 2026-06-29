'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu, Settings2, Maximize2, Minimize2, LogOut, UserCheck, Trash2, Eye, EyeOff,
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
    deleteBtn:      'Supprimer mon compte',
    deleteTitle:    'Supprimer définitivement le compte',
    deleteWarn:     'Cette action est irréversible. Votre compte et toutes vos données (préférences, historique) seront définitivement supprimés.',
    deletePwd:      'Confirmez avec votre mot de passe',
    deleteGoogle:   'Une fenêtre Google s\'ouvrira pour confirmer votre identité.',
    deleteConfirm:  'Supprimer définitivement',
    deleteCancel:   'Annuler',
    deletePwdReq:   'Veuillez saisir votre mot de passe.',
    deleteWrongPwd: 'Mot de passe incorrect.',
    deleteErr:      'Une erreur est survenue. Veuillez réessayer.',
    colType:    'Type',
    colDuration:'Durée',
    colDate:    'Date',
    chrono:     'Chronomètre',
    minuteur:   'Minuteur',
    loading:    'Chargement…',
    settings:        'Paramètres',
    fullscreen:      'Plein écran',
    account:         'Mon compte',
    ariaSettings:    'Ouvrir les paramètres',
    ariaFullscreen:  'Activer le plein écran',
    ariaExitFs:      'Quitter le plein écran',
    ariaAccount:     'Voir mon compte',
  },
  en: {
    signOut:    'Sign out',
    sessions:   'My recent sessions',
    noSessions: 'No sessions recorded',
    deleteBtn:      'Delete my account',
    deleteTitle:    'Permanently delete account',
    deleteWarn:     'This action is irreversible. Your account and all your data (preferences, history) will be permanently deleted.',
    deletePwd:      'Confirm with your password',
    deleteGoogle:   'A Google window will open to confirm your identity.',
    deleteConfirm:  'Delete permanently',
    deleteCancel:   'Cancel',
    deletePwdReq:   'Please enter your password.',
    deleteWrongPwd: 'Incorrect password.',
    deleteErr:      'An error occurred. Please try again.',
    colType:    'Type',
    colDuration:'Duration',
    colDate:    'Date',
    chrono:     'Stopwatch',
    minuteur:   'Timer',
    loading:    'Loading…',
    settings:   'Settings',
    fullscreen: 'Fullscreen',
    account:    'My account',
    ariaSettings:    'Open settings',
    ariaFullscreen:  'Enable fullscreen',
    ariaExitFs:      'Exit fullscreen',
    ariaAccount:     'My account',
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
   Tableau historique — glass v2
═══════════════════════════════════════════════════════════════ */
function HistoryTable({
  history, loading, language, t,
}: {
  history: SessionDoc[]; loading: boolean; language: 'fr' | 'en'; t: Labels;
}) {
  const containerStyle: React.CSSProperties = {
    background:          'linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))',
    backdropFilter:      'blur(14px) saturate(160%)',
    WebkitBackdropFilter:'blur(14px) saturate(160%)',
    border:              '1px solid rgba(255,255,255,0.16)',
    boxShadow:           'inset 0 1px 1px rgba(255,255,255,0.22)',
    borderRadius:        '20px',
    overflow:            'hidden',
    width:               '100%',
  };
  const headerCell: React.CSSProperties = {
    fontSize:       '10px',
    fontWeight:     500,
    letterSpacing:  '0.10em',
    textTransform:  'uppercase',
    color:          'rgba(255,255,255,0.38)',
    padding:        '12px 16px',
    borderBottom:   '1px solid rgba(255,255,255,0.10)',
  };
  const dataCell: React.CSSProperties = {
    fontSize: '13px',
    color:    'rgba(255,255,255,0.80)',
    padding:  '11px 16px',
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
   Bouton icône bas desktop — glass v2
═══════════════════════════════════════════════════════════════ */
function IconButton({
  children, onClick, active = false, title, ariaLabel,
}: {
  children: React.ReactNode; onClick?: () => void; active?: boolean; title?: string; ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
      style={{
        width:                '44px',
        height:               '44px',
        borderRadius:         '50%',
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        cursor:               'pointer',
        backdropFilter:       'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border:               `1px solid ${active ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.22)'}`,
        background:           active
          ? 'linear-gradient(160deg, rgba(255,255,255,0.26), rgba(255,255,255,0.10))'
          : 'rgba(255,255,255,0.11)',
        boxShadow:            active
          ? 'inset 0 1px 1px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.28)'
          : 'inset 0 1px 1px rgba(255,255,255,0.25)',
        color:                'rgba(255,255,255,0.85)',
        transition:           'transform 0.28s cubic-bezier(.2,.9,.3,1.5), background 200ms ease, border-color 200ms ease',
        flexShrink:           0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform    = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.background   = active
          ? 'linear-gradient(160deg, rgba(255,255,255,0.34), rgba(255,255,255,0.14))'
          : 'rgba(255,255,255,0.18)';
        e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.38)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform    = 'scale(1)';
        e.currentTarget.style.background   = active
          ? 'linear-gradient(160deg, rgba(255,255,255,0.26), rgba(255,255,255,0.10))'
          : 'rgba(255,255,255,0.11)';
        e.currentTarget.style.borderColor  = active ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.22)';
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; }}
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

  /* ── Suppression de compte ── */
  const [isPasswordUser, setIsPasswordUser] = useState(false);
  const [confirming,     setConfirming]     = useState(false);
  const [deletePwd,      setDeletePwd]      = useState('');
  const [showPwd,        setShowPwd]        = useState(false);
  const [deleting,       setDeleting]       = useState(false);
  const [deleteError,    setDeleteError]    = useState<string | null>(null);

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
        setIsPasswordUser(user.providerData[0]?.providerId === 'password');
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

  /* ── Suppression définitive du compte ── */
  const handleDelete = async () => {
    setDeleteError(null);
    if (isPasswordUser && !deletePwd) { setDeleteError(t.deletePwdReq); return; }
    setDeleting(true);
    try {
      const { reauthenticateCurrentUser, deleteAccount } = await import('@/lib/firebase');

      // 1. Réauthentification (obligatoire avant suppression).
      try {
        await reauthenticateCurrentUser(isPasswordUser ? deletePwd : undefined);
      } catch (e) {
        const code = (e as { code?: string }).code ?? '';
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          setDeleteError(t.deleteWrongPwd);
        } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          /* silencieux — popup Google fermée */
        } else {
          setDeleteError(t.deleteErr);
        }
        setDeleting(false);
        return;
      }

      // 2. Suppression données Firestore + compte Auth.
      await deleteAccount();

      // 3. Nettoyage du localStorage de l'app.
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('horloge-live.com-'))
          .forEach((k) => localStorage.removeItem(k));
      } catch { /* noop */ }

      // 4. Retour à l'accueil.
      router.replace('/');
    } catch {
      setDeleteError(t.deleteErr);
      setDeleting(false);
    }
  };

  /* Pendant la résolution auth, on rend rien (le fond CSS reste visible) */
  if (loading) return null;

  return (
    <div className="relative overflow-hidden" style={{ height: '100svh', minHeight: '100vh' }}>

      {/* ── Hamburger desktop — glass v2 ── */}
      {!isFullscreen && (
        <button
          className="hidden sm:flex"
          onClick={() => setSidebarOpen(true)}
          style={{
            position:             'absolute',
            top:                  '24px',
            left:                 '24px',
            zIndex:               50,
            width:                '44px',
            height:               '44px',
            borderRadius:         '50%',
            background:           'rgba(255,255,255,0.13)',
            backdropFilter:       'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border:               '1px solid rgba(255,255,255,0.30)',
            boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.28)',
            alignItems:           'center',
            justifyContent:       'center',
            cursor:               'pointer',
            color:                'rgba(255,255,255,0.85)',
            transition:           'transform 0.28s cubic-bezier(.2,.9,.3,1.5), background 200ms ease',
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
        {/* En-tête utilisateur — glass v2 */}
        <div
          style={{
            background:           'linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))',
            backdropFilter:       'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border:               '1px solid rgba(255,255,255,0.20)',
            boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.28)',
            borderRadius:         '20px',
            padding:              '16px 20px',
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
              padding:              '8px 16px',
              fontSize:             '13px',
              fontWeight:           400,
              cursor:               'pointer',
              display:              'inline-flex',
              alignItems:           'center',
              gap:                  '6px',
              whiteSpace:           'nowrap',
              flexShrink:           0,
              backdropFilter:       'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              border:               '1px solid rgba(255,255,255,0.18)',
              background:           'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
              color:                'rgba(255,255,255,0.80)',
              boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.20)',
              transition:           'background 200ms ease, border-color 200ms ease, transform 0.26s cubic-bezier(.2,.9,.3,1.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
              e.currentTarget.style.transform   = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              e.currentTarget.style.transform   = 'scale(1)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
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

        {/* ── Zone de danger : suppression de compte ── */}
        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          {!confirming ? (
            <button
              onClick={() => { setConfirming(true); setDeleteError(null); }}
              style={{
                alignSelf: 'flex-start',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                fontSize: '13px', color: 'rgba(248,113,113,0.70)',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(248,113,113,1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,113,113,0.70)'; }}
            >
              <Trash2 size={15} strokeWidth={1.5} />
              {t.deleteBtn}
            </button>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '12px',
              padding: '16px',
              borderRadius: '18px',
              border: '1px solid rgba(220,38,38,0.35)',
              background: 'rgba(220,38,38,0.08)',
              backdropFilter: 'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#fca5a5' }}>
                {t.deleteTitle}
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                {t.deleteWarn}
              </span>

              {isPasswordUser ? (
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder={t.deletePwd}
                    value={deletePwd}
                    onChange={(e) => setDeletePwd(e.target.value)}
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: '12px',
                      padding: '10px 40px 10px 14px',
                      fontSize: '14px',
                      color: '#ffffff',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                      color: 'rgba(255,255,255,0.35)', lineHeight: 0,
                    }}
                  >
                    {showPwd ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                  {t.deleteGoogle}
                </span>
              )}

              {deleteError && (
                <div style={{
                  borderRadius: '10px', padding: '8px 12px', fontSize: '12px',
                  border: '1px solid rgba(220,38,38,0.40)', background: 'rgba(220,38,38,0.15)',
                  color: '#fca5a5',
                }}>
                  {deleteError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1,
                    borderRadius: '50px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    border: '1px solid rgba(220,38,38,0.55)',
                    background: deleting
                      ? 'rgba(220,38,38,0.15)'
                      : 'linear-gradient(160deg, rgba(220,38,38,0.30), rgba(220,38,38,0.14))',
                    color: deleting ? 'rgba(252,165,165,0.5)' : '#fecaca',
                    transition: 'background 180ms ease',
                    opacity: deleting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!deleting) e.currentTarget.style.background = 'linear-gradient(160deg, rgba(220,38,38,0.42), rgba(220,38,38,0.20))'; }}
                  onMouseLeave={(e) => { if (!deleting) e.currentTarget.style.background = 'linear-gradient(160deg, rgba(220,38,38,0.30), rgba(220,38,38,0.14))'; }}
                >
                  {deleting ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round"/>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </svg>
                  ) : <Trash2 size={15} strokeWidth={1.5} />}
                  {t.deleteConfirm}
                </button>
                <button
                  onClick={() => { setConfirming(false); setDeletePwd(''); setDeleteError(null); }}
                  disabled={deleting}
                  style={{
                    flex: 1,
                    borderRadius: '50px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 400,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {t.deleteCancel}
                </button>
              </div>
            </div>
          )}
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
            ariaLabel={t.ariaSettings}
          >
            <Settings2 size={20} strokeWidth={1.5} />
          </IconButton>
          <IconButton
            onClick={toggleFullscreen}
            active={isFullscreen}
            title={t.fullscreen}
            ariaLabel={isFullscreen ? t.ariaExitFs : t.ariaFullscreen}
          >
            {isFullscreen
              ? <Minimize2 size={20} strokeWidth={1.5} />
              : <Maximize2 size={20} strokeWidth={1.5} />}
          </IconButton>
          <IconButton active title={t.account} ariaLabel={t.ariaAccount}>
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
