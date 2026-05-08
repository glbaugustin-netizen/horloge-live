'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogOut } from 'lucide-react';
import {
  auth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
  saveConsentToFirestore,
  loadPrefsFromFirestore,
  onAuthStateChanged,
  type User,
  type AuthError,
} from '@/lib/firebase';
import { useSettings } from '@/lib/useSettings';

/* ═══════════════════════════════════════════════════════════════
   Traductions UI
═══════════════════════════════════════════════════════════════ */
const UI = {
  fr: {
    tabSignIn:       'Connexion',
    tabSignUp:       'Inscription',
    email:           'Adresse e-mail',
    password:        'Mot de passe',
    confirm:         'Confirmer le mot de passe',
    btnSignIn:       'Se connecter',
    btnSignUp:       'S\'inscrire',
    btnGoogle:       'Continuer avec Google',
    forgotLink:      'Mot de passe oublié ?',
    forgotTitle:     'Réinitialiser le mot de passe',
    forgotBtn:       'Envoyer le lien',
    forgotBack:      '← Retour à la connexion',
    rgpdText:        'J\'accepte les',
    rgpdCgu:         'conditions générales d\'utilisation',
    rgpdAnd:         'et la',
    rgpdPrivacy:     'politique de confidentialité',
    accountTitle:    'Mon compte',
    signedInAs:      'Connecté en tant que',
    btnSignOut:      'Se déconnecter',
    signOutConfirm:  'Vous avez été déconnecté.',
    successSignIn:   'Connexion réussie. Bienvenue !',
    successSignUp:   'Compte créé avec succès. Bienvenue !',
    successReset:    'Un e-mail de réinitialisation a été envoyé à votre adresse.',
    errRgpd:         'Veuillez accepter les conditions générales pour vous inscrire.',
    errEmailMissing: 'Veuillez entrer votre adresse e-mail.',
    or:              '— ou —',
  },
  en: {
    tabSignIn:       'Sign in',
    tabSignUp:       'Sign up',
    email:           'Email address',
    password:        'Password',
    confirm:         'Confirm password',
    btnSignIn:       'Sign in',
    btnSignUp:       'Sign up',
    btnGoogle:       'Continue with Google',
    forgotLink:      'Forgot password?',
    forgotTitle:     'Reset password',
    forgotBtn:       'Send link',
    forgotBack:      '← Back to sign in',
    rgpdText:        'I accept the',
    rgpdCgu:         'terms of use',
    rgpdAnd:         'and the',
    rgpdPrivacy:     'privacy policy',
    accountTitle:    'My account',
    signedInAs:      'Signed in as',
    btnSignOut:      'Sign out',
    signOutConfirm:  'You have been signed out.',
    successSignIn:   'Connexion réussie. Bienvenue !',
    successSignUp:   'Compte créé avec succès. Bienvenue !',
    successReset:    'Un e-mail de réinitialisation a été envoyé à votre adresse.',
    errRgpd:         'Please accept the terms to create an account.',
    errEmailMissing: 'Please enter your email address.',
    or:              '— or —',
  },
} as const;

/* ═══════════════════════════════════════════════════════════════
   Mappage erreurs Firebase → messages personnalisés
═══════════════════════════════════════════════════════════════ */
function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email ou mot de passe incorrect. Veuillez réessayer.';
    case 'auth/email-already-in-use':
      return 'Cette adresse e-mail est déjà utilisée.';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    case 'auth/invalid-email':
      return 'Adresse e-mail invalide.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ''; // Silencieux — l'utilisateur a fermé le popup
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
}

/* ═══════════════════════════════════════════════════════════════
   Logo Google (SVG inline officiel)
═══════════════════════════════════════════════════════════════ */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Champ de saisie
═══════════════════════════════════════════════════════════════ */
interface AuthInputProps {
  type: 'email' | 'password' | 'text';
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  rightElement?: React.ReactNode;
  hasError?: boolean;
}
function AuthInput({ type, placeholder, value, onChange, autoComplete, rightElement, hasError }: AuthInputProps) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.10)',
          border: `1px solid ${hasError ? 'rgba(220,38,38,0.60)' : 'rgba(255,255,255,0.20)'}`,
          borderRadius: '12px',
          padding: rightElement ? '10px 42px 10px 14px' : '10px 14px',
          fontSize: '14px',
          fontWeight: 400,
          color: '#ffffff',
          outline: 'none',
          transition: 'border-color 150ms ease, background 150ms ease',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = hasError
            ? 'rgba(220,38,38,0.80)'
            : 'rgba(79,195,247,0.60)';
          e.target.style.background = 'rgba(255,255,255,0.13)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = hasError
            ? 'rgba(220,38,38,0.60)'
            : 'rgba(255,255,255,0.20)';
          e.target.style.background = 'rgba(255,255,255,0.10)';
        }}
      />
      {rightElement && (
        <div style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: 'translateY(-50%)',
        }}>
          {rightElement}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Message d'état (erreur / succès)
═══════════════════════════════════════════════════════════════ */
function StatusMessage({ type, text }: { type: 'error' | 'success'; text: string }) {
  if (!text) return null;
  const isError = type === 'error';
  return (
    <div style={{
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '13px',
      fontWeight: 400,
      border: `1px solid ${isError ? 'rgba(220,38,38,0.40)' : 'rgba(34,197,94,0.40)'}`,
      background: isError ? 'rgba(220,38,38,0.15)' : 'rgba(34,197,94,0.15)',
      color: isError ? '#fca5a5' : '#86efac',
    }}>
      {text}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Checkbox RGPD personnalisée
═══════════════════════════════════════════════════════════════ */
function RgpdCheckbox({
  checked,
  onChange,
  language,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  language: 'fr' | 'en';
}) {
  const u = UI[language];
  return (
    <div
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}
      onClick={() => onChange(!checked)}
    >
      {/* Case */}
      <div style={{
        width: '16px', height: '16px', minWidth: '16px',
        borderRadius: '4px', marginTop: '2px',
        border: `1px solid ${checked ? 'rgba(79,195,247,0.60)' : 'rgba(255,255,255,0.30)'}`,
        background: checked ? 'rgba(79,195,247,0.40)' : 'rgba(255,255,255,0.08)',
        transition: 'background 150ms ease, border-color 150ms ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {/* Texte */}
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5', userSelect: 'none' }}>
        {u.rgpdText}{' '}
        <Link
          href="/cgu"
          onClick={(e) => e.stopPropagation()}
          style={{ color: '#4FC3F7', textDecoration: 'underline' }}
        >
          {u.rgpdCgu}
        </Link>{' '}
        {u.rgpdAnd}{' '}
        <Link
          href="/confidentialite"
          onClick={(e) => e.stopPropagation()}
          style={{ color: '#4FC3F7', textDecoration: 'underline' }}
        >
          {u.rgpdPrivacy}
        </Link>.
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Séparateur « — ou — »
═══════════════════════════════════════════════════════════════ */
function Separator({ label }: { label: string }) {
  const lineStyle: React.CSSProperties = {
    flex: 1, height: '1px', background: 'rgba(255,255,255,0.12)',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={lineStyle} />
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={lineStyle} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton primaire (glass-accent)
═══════════════════════════════════════════════════════════════ */
function PrimaryButton({ label, onClick, loading }: {
  label: string; onClick: () => void; loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        borderRadius: '50px',
        padding: '11px 20px',
        fontSize: '14px',
        fontWeight: 400,
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(79,195,247,0.50)',
        background: loading ? 'rgba(79,195,247,0.12)' : 'rgba(79,195,247,0.22)',
        color: loading ? 'rgba(179,229,252,0.50)' : '#B3E5FC',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background  = 'rgba(79,195,247,0.30)';
          e.currentTarget.style.borderColor = 'rgba(79,195,247,0.65)';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.background  = 'rgba(79,195,247,0.22)';
          e.currentTarget.style.borderColor = 'rgba(79,195,247,0.50)';
        }
      }}
    >
      {loading ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round"/>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      ) : null}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton Google
═══════════════════════════════════════════════════════════════ */
function GoogleButton({ label, onClick, loading }: {
  label: string; onClick: () => void; loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        borderRadius: '50px',
        padding: '10px 20px',
        fontSize: '13px',
        fontWeight: 400,
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.20)',
        background: 'rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.80)',
        transition: 'background 150ms ease',
      }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
    >
      <GoogleIcon />
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton icône (Eye/EyeOff)
═══════════════════════════════════════════════════════════════ */
function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
        color: 'rgba(255,255,255,0.35)', lineHeight: 0,
        transition: 'color 150ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
    >
      {show
        ? <EyeOff size={16} strokeWidth={1.5} />
        : <Eye    size={16} strokeWidth={1.5} />
      }
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Vue compte connecté
═══════════════════════════════════════════════════════════════ */
function AccountView({ user, language }: { user: User; language: 'fr' | 'en' }) {
  const router = useRouter();
  const u = UI[language];
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push('/');
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '24px',
      padding: '24px',
      width: '360px',
      maxWidth: 'calc(100% - 32px)',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#ffffff', margin: 0 }}>
        {u.accountTitle}
      </h2>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: 0 }}>
        {u.signedInAs}
        <span style={{ color: '#ffffff', marginLeft: '4px' }}>{user.email}</span>
      </p>
      <button
        onClick={handleSignOut}
        disabled={loading}
        style={{
          borderRadius: '50px',
          padding: '10px 20px',
          fontSize: '14px', fontWeight: 400,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.85)',
          transition: 'background 150ms ease',
          width: 'fit-content',
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
      >
        <LogOut size={18} strokeWidth={1.5} />
        {u.btnSignOut}
      </button>

      {/* Retour à l'horloge */}
      <Link
        href="/"
        style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)', textDecoration: 'none' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.70)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)'; }}
      >
        ← {language === 'fr' ? 'Retour à l\'horloge' : 'Back to clock'}
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Composant principal
═══════════════════════════════════════════════════════════════ */
export default function ConnexionPageClient() {
  const { settings } = useSettings();
  const router       = useRouter();
  const language     = settings.language;
  const u            = UI[language];

  /* ── Firebase auth state ── */
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  /* ── Form state ── */
  const [tab,             setTab]             = useState<'connexion' | 'inscription'>('connexion');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirm,         setConfirm]         = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [rgpd,            setRgpd]            = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [success,         setSuccess]         = useState<string | null>(null);
  const [forgotMode,      setForgotMode]      = useState(false);

  const clearMessages = () => { setError(null); setSuccess(null); };

  /* ── Connexion email ── */
  const handleSignIn = async () => {
    clearMessages();
    if (!email) { setError(u.errEmailMissing); return; }
    setLoading(true);
    try {
      const cred = await signInWithEmail(email, password);
      // Charger les préférences Firestore et les appliquer en localStorage
      try {
        const prefs = await loadPrefsFromFirestore(cred.user.uid);
        if (prefs) {
          Object.entries(prefs).forEach(([k, v]) => {
            try { localStorage.setItem(k, v); } catch { /* noop */ }
          });
        }
      } catch { /* noop */ }
      setSuccess(u.successSignIn);
      setTimeout(() => router.push('/'), 1200);
    } catch (err) {
      const code = (err as AuthError).code ?? '';
      const msg  = mapFirebaseError(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Inscription email ── */
  const handleSignUp = async () => {
    clearMessages();
    if (!rgpd) { setError(u.errRgpd); return; }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const cred = await signUpWithEmail(email, password);
      await saveConsentToFirestore(cred.user.uid);
      setSuccess(u.successSignUp);
      setTimeout(() => router.push('/'), 1200);
    } catch (err) {
      const code = (err as AuthError).code ?? '';
      const msg  = mapFirebaseError(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    clearMessages();
    // Inscription : vérifier RGPD avant d'ouvrir le popup
    if (tab === 'inscription' && !rgpd) {
      setError(u.errRgpd);
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithGoogle();
      if (tab === 'inscription') {
        await saveConsentToFirestore(cred.user.uid);
      } else {
        // Connexion : charger les préférences
        try {
          const prefs = await loadPrefsFromFirestore(cred.user.uid);
          if (prefs) {
            Object.entries(prefs).forEach(([k, v]) => {
              try { localStorage.setItem(k, v); } catch { /* noop */ }
            });
          }
        } catch { /* noop */ }
      }
      setSuccess(tab === 'inscription' ? u.successSignUp : u.successSignIn);
      setTimeout(() => router.push('/'), 1200);
    } catch (err) {
      const code = (err as AuthError).code ?? '';
      const msg  = mapFirebaseError(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Mot de passe oublié ── */
  const handleResetPassword = async () => {
    clearMessages();
    if (!email) { setError(u.errEmailMissing); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(u.successReset);
    } catch (err) {
      const code = (err as AuthError).code ?? '';
      const msg  = mapFirebaseError(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Submit on Enter ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (forgotMode) return handleResetPassword();
    if (tab === 'connexion') return handleSignIn();
    handleSignUp();
  };

  /* ════════════════════════════════════════
     Rendu
  ════════════════════════════════════════ */

  /* Conteneur pleine page centré */
  const pageStyle: React.CSSProperties = {
    minHeight: '100svh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    position: 'relative',
    zIndex: 2, // au-dessus du ::before overlay
  };

  /* Panel glass */
  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '24px',
    padding: '24px',
    width: '360px',
    maxWidth: 'calc(100% - 0px)', // pleine largeur sur mobile (margin géré par padding page)
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  };

  /* Vue "Mon compte" si déjà connecté */
  if (user) {
    return (
      <div style={pageStyle}>
        <AccountView user={user} language={language} />
      </div>
    );
  }

  /* ── Mode "Mot de passe oublié" ── */
  if (forgotMode) {
    return (
      <div style={pageStyle}>
        <div style={panelStyle} onKeyDown={handleKeyDown}>
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#ffffff', margin: 0 }}>
            {u.forgotTitle}
          </h2>
          <AuthInput
            type="email"
            placeholder={u.email}
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          {error   && <StatusMessage type="error"   text={error}   />}
          {success && <StatusMessage type="success" text={success} />}
          <PrimaryButton label={u.forgotBtn} onClick={handleResetPassword} loading={loading} />
          <button
            onClick={() => { setForgotMode(false); clearMessages(); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '12px', color: 'rgba(255,255,255,0.40)',
              padding: 0, textAlign: 'left', transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; }}
          >
            {u.forgotBack}
          </button>
        </div>
      </div>
    );
  }

  /* ── Formulaire principal ── */
  return (
    <div style={pageStyle}>
      <div style={panelStyle} onKeyDown={handleKeyDown}>

        {/* Toggle Connexion / Inscription */}
        <div style={{
          display: 'flex', gap: '4px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '50px', padding: '4px',
        }}>
          {(['connexion', 'inscription'] as const).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => { setTab(t); clearMessages(); }}
                style={{
                  flex: 1, textAlign: 'center', padding: '7px',
                  borderRadius: '50px', fontSize: '13px', fontWeight: 400,
                  cursor: 'pointer', border: 'none',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
              >
                {t === 'connexion' ? u.tabSignIn : u.tabSignUp}
              </button>
            );
          })}
        </div>

        {/* Champs */}
        <AuthInput
          type="email"
          placeholder={u.email}
          value={email}
          onChange={setEmail}
          autoComplete={tab === 'connexion' ? 'email' : 'email'}
        />
        <AuthInput
          type={showPassword ? 'text' : 'password'}
          placeholder={u.password}
          value={password}
          onChange={setPassword}
          autoComplete={tab === 'connexion' ? 'current-password' : 'new-password'}
          rightElement={<EyeToggle show={showPassword} onToggle={() => setShowPassword(s => !s)} />}
        />
        {tab === 'inscription' && (
          <AuthInput
            type={showConfirm ? 'text' : 'password'}
            placeholder={u.confirm}
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            rightElement={<EyeToggle show={showConfirm} onToggle={() => setShowConfirm(s => !s)} />}
          />
        )}

        {/* Mot de passe oublié (connexion uniquement) */}
        {tab === 'connexion' && (
          <button
            onClick={() => { setForgotMode(true); clearMessages(); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: '12px', color: 'rgba(255,255,255,0.35)',
              textAlign: 'right', transition: 'color 150ms ease', alignSelf: 'flex-end',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.60)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            {u.forgotLink}
          </button>
        )}

        {/* RGPD (inscription uniquement) */}
        {tab === 'inscription' && (
          <RgpdCheckbox checked={rgpd} onChange={setRgpd} language={language} />
        )}

        {/* Messages d'état */}
        {error   && <StatusMessage type="error"   text={error}   />}
        {success && <StatusMessage type="success" text={success} />}

        {/* Bouton principal */}
        <PrimaryButton
          label={tab === 'connexion' ? u.btnSignIn : u.btnSignUp}
          onClick={tab === 'connexion' ? handleSignIn : handleSignUp}
          loading={loading}
        />

        {/* Séparateur */}
        <Separator label={u.or} />

        {/* Google */}
        <GoogleButton label={u.btnGoogle} onClick={handleGoogle} loading={loading} />

      </div>
    </div>
  );
}
