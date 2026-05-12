'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { Settings } from '@/lib/useSettings';

// Mirrors KEYS in useSettings.ts — kept separate to avoid circular imports
const STORAGE_KEY_MAP: Record<keyof Settings, string> = {
  font:       'horloge-live.com-font',
  fontSize:   'horloge-live.com-font-size',
  textColor:  'horloge-live.com-text-color',
  background: 'horloge-live.com-background',
  format:     'horloge-live.com-format',
  mirror:       'horloge-live.com-mirror',
  showDate:     'horloge-live.com-show-date',
  showSeconds:  'horloge-live.com-show-seconds',
  language:     'horloge-live.com-language',
};

// Firestore doc uses clean field names (font, fontSize…); localStorage uses full keys
function settingsToFirestorePrefs(s: Settings): Record<string, string> {
  return {
    font:       s.font,
    fontSize:   String(s.fontSize),
    textColor:  s.textColor,
    background: s.background,
    format:     s.format,
    mirror:       String(s.mirror),
    showDate:     String(s.showDate),
    showSeconds:  String(s.showSeconds),
    language:     s.language,
  };
}

function writePrefsToLocalStorage(prefs: Record<string, string>): void {
  for (const [field, storageKey] of Object.entries(STORAGE_KEY_MAP)) {
    const value = prefs[field];
    if (value !== undefined) {
      try { localStorage.setItem(storageKey, value); } catch { /* noop */ }
    }
  }
}

/**
 * Synchronise les préférences entre Firestore et localStorage.
 *
 * @param onLoad  Appelé quand les prefs Firestore arrivent après connexion.
 *                useSync a déjà écrit dans localStorage avant cet appel.
 * @returns       syncToFirestore — à appeler à chaque changement de setting.
 */
export function useSync(
  onLoad: (prefs: Record<string, string>) => void,
): { syncToFirestore: (settings: Settings) => void } {
  // Ref stable vers la fonction de sync Firebase (peuplée après import dynamique)
  const syncRef   = useRef<(settings: Settings) => void>(() => {});
  // Ref stable vers onLoad pour éviter de re-exécuter le useEffect
  const onLoadRef = useRef(onLoad);
  useEffect(() => { onLoadRef.current = onLoad; });

  useEffect(() => {
    let cancelled   = false;
    let unsubscribe: (() => void) | null = null;

    import('@/lib/firebase')
      .then(({ auth, onAuthStateChanged, savePrefsToFirestore, loadPrefsFromFirestore }) => {
        if (cancelled) return;

        syncRef.current = (settings: Settings) => {
          const user = auth.currentUser;
          if (!user) return;
          savePrefsToFirestore(user.uid, settingsToFirestorePrefs(settings)).catch(() => {});
        };

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (cancelled || !user) return;
          try {
            const prefs = await loadPrefsFromFirestore(user.uid);
            if (!prefs || cancelled) return;
            writePrefsToLocalStorage(prefs);
            onLoadRef.current(prefs);
          } catch (e) {
            console.error('[useSync] Firestore load error:', e);
          }
        });
      })
      .catch((e) => {
        console.error('[useSync] Firebase import error:', e);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
      syncRef.current = () => {};
    };
  }, []);

  const syncToFirestore = useCallback((settings: Settings) => {
    syncRef.current(settings);
  }, []);

  return { syncToFirestore };
}
