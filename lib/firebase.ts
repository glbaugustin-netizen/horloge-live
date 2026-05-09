/**
 * lib/firebase.ts
 * Initialisation Firebase + helpers Auth + Firestore préférences.
 *
 * Les clés sont lues depuis les variables d'environnement NEXT_PUBLIC_*
 * définies dans .env.local (voir .env.local pour les instructions).
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
  onAuthStateChanged as _onAuthStateChanged,
  type User,
  type AuthError,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

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
export const db   = getFirestore(app);

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
  const ref  = doc(db, 'users', uid, 'preferences', 'main');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FirestorePrefs) : null;
}

/**
 * Enregistre l'horodatage du consentement RGPD.
 * Chemin : /users/{uid}/data/consent
 */
export async function saveConsentToFirestore(uid: string): Promise<void> {
  const ref = doc(db, 'users', uid, 'data', 'consent');
  await setDoc(ref, {
    acceptedAt: serverTimestamp(),
    version: '1.0',
  }, { merge: true });
}

/* ── Re-exports utiles ────────────────────────────────────────── */
export { _onAuthStateChanged as onAuthStateChanged };
export type { User, AuthError };
