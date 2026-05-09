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

export function useSettings() {
  const [settings,   setSettings]   = useState<Settings>(DEFAULTS);
  const [isHydrated, setIsHydrated] = useState(false);

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
