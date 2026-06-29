/**
 * lib/firebase.ts
 * Initialisation Firebase + helpers Auth + Firestore préférences.
 *
 * ⚡ Perf : Firestore SDK (~150 KB) est lazy-loadé via getDb().
 *    Seul firebase/auth est chargé immédiatement à l'import.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as _signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  onAuthStateChanged as _onAuthStateChanged,
  type User,
  type AuthError,
} from 'firebase/auth';

/* ── Configuration ────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? 'placeholder',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? 'placeholder.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? 'placeholder',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? 'placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? 'placeholder',
};

/* Singleton — évite le doublon lors du hot-reload Next.js */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

/* ── App Check (anti-bots / anti-DDoS) ────────────────────────────
   Protège les endpoints Auth & Firestore : seules les requêtes
   provenant de la vraie app (validées par reCAPTCHA v3) sont acceptées.
   ⚡ Ne s'active QUE si la clé reCAPTCHA est fournie — sinon no-op,
      donc aucun risque tant que ce n'est pas configuré côté console. */
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  import('firebase/app-check')
    .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string,
        ),
        isTokenAutoRefreshEnabled: true,
      });
    })
    .catch(() => { /* App Check indisponible — on n'empêche pas l'app de tourner */ });
}

/* ── Firestore : lazy — SDK chargé uniquement si nécessaire ──── */
export const getDb = async () => {
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
};

/* ── Auth helpers ─────────────────────────────────────────────── */

/** Connexion email + mot de passe */
export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Inscription email + mot de passe */
export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/** Connexion via popup Google */
export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  return signInWithPopup(auth, provider);
}

/** Déconnexion */
export function signOut() {
  return _signOut(auth);
}

/** Envoi de l'e-mail de réinitialisation du mot de passe */
export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Envoi de l'e-mail de vérification d'adresse (double opt-in).
 * Le lien renvoie vers le domaine configuré dans Firebase Auth.
 */
export function sendVerificationEmail(user: User) {
  return sendEmailVerification(user);
}

/* ── Préférences Firestore ────────────────────────────────────── */
export type FirestorePrefs = Record<string, string>;

/**
 * Écrit (ou met à jour partiellement) les préférences de l'utilisateur.
 * Chemin : /users/{uid}/preferences/main
 */
export async function savePrefsToFirestore(
  uid: string,
  prefs: FirestorePrefs,
): Promise<void> {
  const db = await getDb();
  const { doc, setDoc } = await import('firebase/firestore');
  const ref = doc(db, 'users', uid, 'preferences', 'main');
  await setDoc(ref, prefs, { merge: true });
}

/**
 * Lit les préférences de l'utilisateur depuis Firestore.
 * Retourne null si le document n'existe pas encore.
 */
export async function loadPrefsFromFirestore(
  uid: string,
): Promise<FirestorePrefs | null> {
  const db = await getDb();
  const { doc, getDoc } = await import('firebase/firestore');
  const ref  = doc(db, 'users', uid, 'preferences', 'main');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FirestorePrefs) : null;
}

/* ── Suppression de compte (RGPD — droit à l'effacement) ──────── */

/**
 * Réauthentifie l'utilisateur courant — requis par Firebase juste avant
 * une opération sensible (suppression de compte).
 * - Compte Google : ouvre une popup de confirmation.
 * - Compte email/password : nécessite le mot de passe.
 */
export async function reauthenticateCurrentUser(password?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('no-current-user');
  const providerId = user.providerData[0]?.providerId;

  if (providerId === 'google.com') {
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(user, provider);
  } else {
    if (!user.email || !password) throw new Error('password-required');
    const cred = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, cred);
  }
}

/**
 * Supprime TOUTES les données Firestore de l'utilisateur :
 * préférences, consentement RGPD et tout l'historique.
 */
export async function deleteUserData(uid: string): Promise<void> {
  const db = await getDb();
  const { doc, deleteDoc, collection, getDocs } = await import('firebase/firestore');

  // Sous-collection historique — supprimer chaque document.
  try {
    const histSnap = await getDocs(collection(db, 'users', uid, 'history'));
    await Promise.all(histSnap.docs.map((d) => deleteDoc(d.ref)));
  } catch { /* noop */ }

  // Documents connus.
  await deleteDoc(doc(db, 'users', uid, 'preferences', 'main')).catch(() => {});
  await deleteDoc(doc(db, 'users', uid, 'data', 'consent')).catch(() => {});
}

/**
 * Supprime définitivement le compte : d'abord les données Firestore
 * (pendant que la session est encore valide), puis le compte Auth.
 * Peut lever auth/requires-recent-login → appeler reauthenticateCurrentUser.
 */
export async function deleteAccount(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('no-current-user');
  await deleteUserData(user.uid);
  await deleteUser(user);
}

/**
 * Enregistre l'horodatage du consentement RGPD.
 * Chemin : /users/{uid}/data/consent
 */
export async function saveConsentToFirestore(uid: string): Promise<void> {
  const db = await getDb();
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  const ref = doc(db, 'users', uid, 'data', 'consent');
  await setDoc(ref, {
    acceptedAt: serverTimestamp(),
    version: '1.0',
  }, { merge: true });
}

/* ── Re-exports utiles ────────────────────────────────────────── */
export { _onAuthStateChanged as onAuthStateChanged };
export type { User, AuthError };
