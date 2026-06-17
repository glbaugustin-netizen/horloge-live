'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadFont } from '@/lib/googleFonts';
import { useSync } from '@/lib/useSync';

const KEYS = {
  font:       'horloge-live.com-font',
  fontSize:   'horloge-live.com-font-size',
  textColor:  'horloge-live.com-text-color',
  background: 'horloge-live.com-background',
  format:     'horloge-live.com-format',
  mirror:       'horloge-live.com-mirror',
  showDate:     'horloge-live.com-show-date',
  showSeconds:  'horloge-live.com-show-seconds',
  language:     'horloge-live.com-language',
} as const;

const FOCUS_KEY = 'horloge-live-focus-mode' as const;

const FLIP_KEYS = {
  flipMode:          'horloge-live-flip-mode',
  flipTheme:         'horloge-live-flip-theme',
  preFlipBackground: 'horloge-live-pre-flip-background',
} as const;

export interface Settings {
  font:       string;
  fontSize:   number;
  textColor:  string;
  background: string;
  format:     '12h' | '24h';
  mirror:       boolean;
  showDate:     boolean;
  showSeconds:  boolean;
  language:     'fr' | 'en';
}

const DEFAULTS: Settings = {
  font:       'Inter',
  fontSize:   200,
  textColor:  '#FFFFFF',
  background: '#0A0A0A',
  format:     '24h',
  mirror:       false,
  showDate:     true,
  showSeconds:  false,
  language:     'fr',
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
    const mirror       = localStorage.getItem(KEYS.mirror);
    const showDate     = localStorage.getItem(KEYS.showDate);
    const showSeconds  = localStorage.getItem(KEYS.showSeconds);
    const language     = localStorage.getItem(KEYS.language);

    const result: Partial<Settings> = {};
    if (font) result.font = font;
    if (fontSizeRaw) {
      const parsed = parseInt(fontSizeRaw, 10);
      if (!isNaN(parsed) && parsed >= 50 && parsed <= 200) result.fontSize = parsed;
    }
    if (textColor)  result.textColor  = textColor;
    if (background) result.background = background;
    if (format === '12h' || format === '24h') result.format = format;
    if (mirror      === 'true' || mirror      === 'false') result.mirror      = mirror      === 'true';
    if (showDate    === 'true' || showDate    === 'false') result.showDate    = showDate    === 'true';
    if (showSeconds === 'true' || showSeconds === 'false') result.showSeconds = showSeconds === 'true';
    if (language === 'fr' || language === 'en')            result.language    = language;

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
  root.style.setProperty('--clock-text-color', settings.textColor);

  const isUrl = settings.background.startsWith('url(');
  if (isUrl) {
    root.style.setProperty('--bg-image', settings.background);
    root.style.setProperty('--bg-image-mobile', getMobileUrl(settings.background));
    root.style.setProperty('--bg-color', 'transparent');
  } else {
    root.style.setProperty('--bg-image', 'none');
    root.style.setProperty('--bg-image-mobile', 'none');
    root.style.setProperty('--bg-color', settings.background);
  }
}

function getMobileUrl(bg: string): string {
  if (bg.startsWith("url('/backgrounds/") && bg.endsWith(".webp')")) {
    return bg.replace(".webp')", "-mobile.webp')");
  }
  return bg;
}

export function useSettings() {
  const [settings,   setSettings]   = useState<Settings>(DEFAULTS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [focusMode,  setFocusModeState]  = useState(false);
  const [flipMode,   setFlipModeState]   = useState(false);
  const [flipTheme,  setFlipThemeState]  = useState<'dark' | 'light'>('dark');

  // Appelé par useSync quand les prefs Firestore arrivent (localStorage déjà mis à jour)
  const handleFirestoreLoad = useCallback(() => {
    const stored      = readFromStorage();
    const newSettings = { ...DEFAULTS, ...stored };
    setSettings(newSettings);
    applyToCssVariables(newSettings);
    if (newSettings.font !== 'Inter') loadFont(newSettings.font);
  }, []);

  const { syncToFirestore } = useSync(handleFirestoreLoad);

  /* ── Hydratation initiale depuis localStorage ── */
  useEffect(() => {
    const stored       = readFromStorage();
    const detectedLang = detectLanguage();
    const merged: Settings = { ...DEFAULTS, language: detectedLang, ...stored };
    setSettings(merged);
    applyToCssVariables(merged);
    if (merged.font !== 'Inter') loadFont(merged.font);
    setIsHydrated(true);
    // Lecture du mode focus
    try {
      const fm = localStorage.getItem(FOCUS_KEY) === 'true';
      setFocusModeState(fm);
    } catch { /* noop */ }
    // Lecture du mode flip
    try {
      const fl = localStorage.getItem(FLIP_KEYS.flipMode) === 'true';
      setFlipModeState(fl);
      const ft = localStorage.getItem(FLIP_KEYS.flipTheme);
      setFlipThemeState(ft === 'light' ? 'light' : 'dark');
    } catch { /* noop */ }
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
        localStorage.setItem(KEYS[key], String(value));
      } catch { /* localStorage non disponible (mode privé strict) */ }
      syncToFirestore(next);
      return next;
    });
  }, [syncToFirestore]);

  const updateFont       = useCallback((font: string) => {
    loadFont(font);
    updateSetting('font', font);
  }, [updateSetting]);
  const updateFontSize   = useCallback((size: number)       => updateSetting('fontSize',   size),  [updateSetting]);
  const updateTextColor  = useCallback((color: string)      => updateSetting('textColor',  color), [updateSetting]);
  const updateBackground = useCallback((bg: string)         => updateSetting('background', bg),    [updateSetting]);
  const updateFormat     = useCallback((fmt: '12h' | '24h') => updateSetting('format',     fmt),   [updateSetting]);
  const updateMirror      = useCallback((val: boolean)       => updateSetting('mirror',      val), [updateSetting]);
  const updateShowDate    = useCallback((val: boolean)       => updateSetting('showDate',    val), [updateSetting]);
  const updateShowSeconds = useCallback((val: boolean)       => updateSetting('showSeconds', val), [updateSetting]);
  const updateLanguage    = useCallback((lang: 'fr' | 'en')  => updateSetting('language',   lang), [updateSetting]);

  const setFocusMode = useCallback((value: boolean) => {
    setFocusModeState(value);
    try {
      localStorage.setItem(FOCUS_KEY, String(value));
    } catch { /* localStorage non disponible (mode privé strict) */ }
  }, []);

  /* ── Mode flip ── */
  const setFlipMode = useCallback((value: boolean) => {
    if (value) {
      // Sauvegarder le fond actuel avant activation
      let currentBg = '';
      try { currentBg = localStorage.getItem(KEYS.background) ?? ''; } catch { /* noop */ }
      try { localStorage.setItem(FLIP_KEYS.preFlipBackground, currentBg); } catch { /* noop */ }
      // Appliquer le fond flip (dark #0A0A0A, light #FFFFFF)
      let ft: 'dark' | 'light' = 'dark';
      try { ft = localStorage.getItem(FLIP_KEYS.flipTheme) === 'light' ? 'light' : 'dark'; } catch { /* noop */ }
      updateBackground(ft === 'dark' ? '#0A0A0A' : '#FFFFFF');
      setFlipModeState(true);
      try { localStorage.setItem(FLIP_KEYS.flipMode, 'true'); } catch { /* noop */ }
    } else {
      // Restaurer le fond sauvegardé
      let preFl = '';
      try { preFl = localStorage.getItem(FLIP_KEYS.preFlipBackground) ?? ''; } catch { /* noop */ }
      if (preFl) {
        updateBackground(preFl);
        try { localStorage.setItem(FLIP_KEYS.preFlipBackground, ''); } catch { /* noop */ }
      }
      setFlipModeState(false);
      try { localStorage.setItem(FLIP_KEYS.flipMode, 'false'); } catch { /* noop */ }
    }
  }, [updateBackground]);

  const setFlipTheme = useCallback((value: 'dark' | 'light') => {
    setFlipThemeState(value);
    try { localStorage.setItem(FLIP_KEYS.flipTheme, value); } catch { /* noop */ }
    // Si flip actif, mettre à jour le fond immédiatement
    try {
      if (localStorage.getItem(FLIP_KEYS.flipMode) === 'true') {
        updateBackground(value === 'dark' ? '#0A0A0A' : '#FFFFFF');
      }
    } catch { /* noop */ }
  }, [updateBackground]);

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
    updateShowSeconds,
    updateLanguage,
    focusMode,
    setFocusMode,
    flipMode,
    setFlipMode,
    flipTheme,
    setFlipTheme,
  };
}
