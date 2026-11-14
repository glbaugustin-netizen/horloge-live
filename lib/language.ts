/**
 * Langue de l'interface — règle unique pour tout le site :
 * 1. choix enregistré par le visiteur (localStorage) ;
 * 2. sinon, langue du navigateur : français → FR, toute autre langue → EN.
 * Le HTML rendu côté serveur (SEO) reste en français.
 */

export type Lang = 'fr' | 'en';

export const LANGUAGE_KEY = 'horloge-live.com-language';

export function detectBrowserLanguage(): Lang {
  if (typeof navigator === 'undefined') return 'fr';
  const lang = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase();
  return lang.startsWith('fr') ? 'fr' : 'en';
}

export function getPreferredLanguage(): Lang {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch { /* localStorage indisponible */ }
  return detectBrowserLanguage();
}
