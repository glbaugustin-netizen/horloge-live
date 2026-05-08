'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadFont } from '@/lib/googleFonts';

const KEYS = {
  font:       'horloge-live.com-font',
  fontSize:   'horloge-live.com-font-size',
  textColor:  'horloge-live.com-text-color',
  background: 'horloge-live.com-background',
  format:     'horloge-live.com-format',
  mirror:     'horloge-live.com-mirror',
  showDate:   'horloge-live.com-show-date',
  language:   'horloge-live.com-language',
} as const;

export interface Settings {
  font:       string;
  fontSize:   number;
  textColor:  string;
  background: string;
  format:     '12h' | '24h';
  mirror:     boolean;
  showDate:   boolean;
  language:   'fr' | 'en';
}

const DEFAULTS: Settings = {
  font:       'Inter',
  fontSize:   120,
  textColor:  '#FFFFFF',
  background: "url('/backgrounds/bg-nature7.webp')",
  format:     '24h',
  mirror:     false,
  showDate:   true,
  language:   'fr',
};

function detectLanguage(): 'fr' | 'en' {
  if (typeof navigator === 'undefined') return 'fr';
  const lang = navigator.language?.toLowerCase() ?? 'fr';
  return lang.startsWith('en') ? 'en' : 'fr';
}

function readFromStorage(): Partial<Settings> {
  if (typeof window === 'undefined') return {};
  try {
    const font        = localStorage.getItem(KEYS.font);
    const fontSizeRaw = localStorage.getItem(KEYS.fontSize);
    const textColor   = localStorage.getItem(KEYS.textColor);
    const background  = localStorage.getItem(KEYS.background);
    const format      = localStorage.getItem(KEYS.format);
    const mirror      = localStorage.getItem(KEYS.mirror);
    const showDate    = localStorage.getItem(KEYS.showDate);
    const language    = localStorage.getItem(KEYS.language);

    const result: Partial<Settings> = {};
    if (font) result.font = font;
    if (fontSizeRaw) {
      const parsed = parseInt(fontSizeRaw, 10);
      if (!isNaN(parsed) && parsed >= 50 && parsed <= 200) result.fontSize = parsed;
    }
    if (textColor)  result.textColor  = textColor;
    if (background) result.background = background;
    if (format === '12h' || format === '24h') result.format = format;
    if (mirror  === 'true' || mirror  === 'false') result.mirror   = mirror  === 'true';
    if (showDate === 'true' || showDate === 'false') result.showDate = showDate === 'true';
    if (language === 'fr' || language === 'en')      result.language = language;

    return result;
  } catch {
    return {};
  }
}

function applyToCssVariables(settings: Settings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--clock-font-family', `'${settings.font}', sans-serif`);
  root.style.setProperty('--clock-font-size',   `${settings.fontSize}px`);
  root.style.setProperty('--color-text-primary', settings.textColor);

  const isUrl = settings.background.startsWith('url(');
  if (isUrl) {
    root.style.setProperty('--bg-image', settings.background);
    root.style.setProperty('--bg-color', 'transparent');
  } else {
    root.style.setProperty('--bg-image', 'none');
    root.style.setProperty('--bg-color', settings.background);
  }
}

/**
 * Applique un objet de préférences Firestore au localStorage + état React.
 * Retourne le Settings mergé avec les defaults.
 */
function applyFirestorePrefs(firestorePrefs: Record<string, string>): Settings {
  Object.entries(KEYS).forEach(([, storageKey]) => {
    const value = firestorePrefs[storageKey];
    if (value !== undefined) {
      try { localStorage.setItem(storageKey, value); } catch { /* noop */ }
    }
  });
  const stored = readFromStorage();
  return { ...DEFAULTS, ...stored };
}

export function useSettings() {
  const [settings,    setSettings]    = useState<Settings>(DEFAULTS);
  const [isHydrated,  setIsHydrated]  = useState(false);

  /* ── Hydratation initiale + sync Firestore (chargé dynamiquement) ── */
  useEffect(() => {
    // 1. Lire localStorage immédiatement
    const stored      = readFromStorage();
    const detectedLang = detectLanguage();
    const merged: Settings = {
      ...DEFAULTS,
      language: detectedLang,
      ...stored,
    };
    setSettings(merged);
    applyToCssVariables(merged);
    if (merged.font !== 'Inter') loadFont(merged.font);
    setIsHydrated(true);

    // 2. Firebase — import dynamique (hors bundle initial, ~300 KB économisés)
    let cancelled = false;
    let unsubscribeFirebase: (() => void) | null = null;

    import('@/lib/firebase').then(({ auth, onAuthStateChanged, loadPrefsFromFirestore }) => {
      if (cancelled) return;
      unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
        if (cancelled || !user) return;
        try {
          const firestorePrefs = await loadPrefsFromFirestore(user.uid);
          if (!firestorePrefs || cancelled) return;
          const newSettings = applyFirestorePrefs(firestorePrefs);
          setSettings(newSettings);
          applyToCssVariables(newSettings);
          if (newSettings.font !== 'Inter') loadFont(newSettings.font);
        } catch {
          // Firestore non disponible ou config manquante — silencieux
        }
      });
    }).catch(() => {
      // Firebase non configuré — silencieux
    });

    return () => {
      cancelled = true;
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, []);

  /* ── Mise à jour d'un réglage ── */
  const updateSetting = useCallback(<K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      applyToCssVariables(next);

      try {
        const storageKey = KEYS[key];
        localStorage.setItem(storageKey, String(value));
      } catch {
        // localStorage non disponible (mode privé strict)
      }

      return next;
    });

    // Sync Firestore — import dynamique (déjà en cache après la première fois)
    import('@/lib/firebase').then(({ auth, savePrefsToFirestore }) => {
      const user = auth.currentUser;
      if (user) {
        const storageKey = KEYS[key];
        savePrefsToFirestore(user.uid, { [storageKey]: String(value) }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const updateFont       = useCallback((font: string) => {
    loadFont(font);
    updateSetting('font', font);
  }, [updateSetting]);
  const updateFontSize   = useCallback((size: number)       => updateSetting('fontSize',   size),  [updateSetting]);
  const updateTextColor  = useCallback((color: string)      => updateSetting('textColor',  color), [updateSetting]);
  const updateBackground = useCallback((bg: string)         => updateSetting('background', bg),    [updateSetting]);
  const updateFormat     = useCallback((fmt: '12h' | '24h') => updateSetting('format',     fmt),   [updateSetting]);
  const updateMirror     = useCallback((val: boolean)       => updateSetting('mirror',     val),   [updateSetting]);
  const updateShowDate   = useCallback((val: boolean)       => updateSetting('showDate',   val),   [updateSetting]);
  const updateLanguage   = useCallback((lang: 'fr' | 'en')  => updateSetting('language',  lang),  [updateSetting]);

  return {
    settings,
    isHydrated,
    updateFont,
    updateFontSize,
    updateTextColor,
    updateBackground,
    updateFormat,
    updateMirror,
    updateShowDate,
    updateLanguage,
  };
}
