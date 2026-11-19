'use client';

/**
 * État de connexion partagé, SANS charger Firebase pour les visiteurs anonymes.
 *
 * Firebase Auth (~130 KB de scripts Google + une iframe) n'est importé que si une
 * session a pu exister sur cet appareil :
 *   - notre marqueur `horloge-live-auth` (posé à chaque connexion détectée),
 *   - une clé `firebase:authUser:*` en localStorage,
 *   - la base IndexedDB `firebaseLocalStorageDb` (persistance par défaut de getAuth).
 * Un seul abonnement onAuthStateChanged est partagé par tous les composants.
 */

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

const MARKER = 'horloge-live-auth';

/** undefined = pas encore connu, null = visiteur anonyme, User = connecté */
type AuthState = User | null | undefined;

let current: AuthState = undefined;
/** true une fois l'abonnement Firebase en place (définitif) */
let subscribed = false;
/** vérification en cours (évite les doublons quand plusieurs composants montent) */
let checking = false;
const listeners = new Set<(u: AuthState) => void>();

function publish(u: AuthState) {
  current = u;
  listeners.forEach((l) => l(u));
}

export async function mightHaveSession(): Promise<boolean> {
  try {
    if (localStorage.getItem(MARKER) === '1') return true;
    if (Object.keys(localStorage).some((k) => k.startsWith('firebase:authUser'))) return true;
  } catch { /* localStorage indisponible */ }
  try {
    const dbs = await indexedDB.databases?.();
    if (dbs?.some((d) => d.name === 'firebaseLocalStorageDb')) return true;
  } catch { /* API indisponible (anciens navigateurs) */ }
  return false;
}

/**
 * Visiteur anonyme : on publie null sans figer l'état, pour revérifier au prochain
 * montage (ex. retour sur l'horloge après connexion sur /connexion, sans rechargement).
 */
function start() {
  if (subscribed || checking) return;
  checking = true;
  mightHaveSession().then((maybe) => {
    if (!maybe) {
      checking = false;
      publish(null);
      return;
    }
    import('@/lib/firebase')
      .then(({ auth, onAuthStateChanged }) => {
        subscribed = true;
        checking = false;
        onAuthStateChanged(auth, (user) => {
          try {
            if (user) localStorage.setItem(MARKER, '1');
            else localStorage.removeItem(MARKER);
          } catch { /* noop */ }
          publish(user);
        });
      })
      .catch(() => { checking = false; publish(null); });
  });
}

export function useAuthUser(): AuthState {
  const [user, setUser] = useState<AuthState>(current);
  useEffect(() => {
    listeners.add(setUser);
    setUser(current);
    start();
    return () => { listeners.delete(setUser); };
  }, []);
  return user;
}
