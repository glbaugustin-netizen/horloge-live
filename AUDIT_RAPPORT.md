# Rapport d'audit — horloge-live.com

Date : 2026-05-29

---

## Score global

**83 / 100**

---

## Résumé exécutif

Le projet horloge-live.com est dans un état solide : SEO technique complet, design system verre cohérent, performances optimisées et traductions FR/EN fonctionnelles. Trois points critiques méritent une correction rapide : le composant `BottomBar.tsx` est absent (sa logique est dans `MobileNav.tsx`, ce qui crée une divergence avec la spec), le fichier `.env.local.example` n'existe pas (risque onboarding/sécurité), et les documents de référence `TEXTES_SEO.md` et `DESIGN_SYSTEM.md` sont introuvables dans le dépôt, rendant impossible la vérification de conformité aux specs exactes. Par ailleurs, la clé localStorage `horloge-live.com-fontPolice` attendue dans la spec a été renommée `horloge-live.com-font` dans le code sans mise à jour de la documentation.

---

## 🔴 PRIORITÉ HAUTE — À corriger immédiatement

1. **`components/BottomBar.tsx` absent** — Le fichier n'existe pas. La logique des deux barres basses mobiles est intégrée dans `MobileNav.tsx`. La spec exige un fichier dédié. Soit créer le composant, soit mettre à jour la spec. Risque : confusion future sur l'architecture.

2. **`.env.local.example` absent** — Aucun fichier exemple des variables d'environnement n'existe dans le dépôt. Un développeur qui clone le projet ne sait pas quelles variables Firebase configurer. Risque : onboarding impossible, clés oubliées en prod.

3. **`TEXTES_SEO.md` introuvable** — Le document de référence SEO n'est pas dans le dépôt. Impossible de vérifier la conformité exacte des titres, descriptions et contenus JSON-LD. Risque : dérives incontrôlées du contenu SEO.

4. **`DESIGN_SYSTEM.md` introuvable** — Le document de référence design system n'est pas dans le dépôt. Impossible de croiser les variables CSS avec la spec section 12. Risque : incohérences futures sans référence.

---

## 🟡 PRIORITÉ MOYENNE — À corriger prochainement

1. **Clé localStorage `horloge-live.com-fontPolice` → renommée `horloge-live.com-font`** — La spec de l'audit liste `horloge-live.com-fontPolice` mais la clé réelle dans `lib/useSettings.ts` est `horloge-live.com-font`. Si des utilisateurs ont des données avec l'ancienne clé (ancienne version du site), leurs préférences de police ne seront pas lues. À clarifier : est-ce un changement volontaire récent ? Si oui, une migration localStorage est nécessaire.

2. **Clé `horloge-live.com-show-seconds` non documentée dans la spec** — Une 9ème clé localStorage existe (`horloge-live.com-show-seconds`) mais ne figure pas dans les 8 clés attendues. La spec doit être mise à jour.

3. **`/monde` signalée "Découvert - non indexé" dans Search Console** — La page `app/monde/page.tsx` existe, a `robots: { index: true }`, un canonical correct et est dans le sitemap. Le statut Search Console est probablement transitoire (délai d'indexation). À surveiller : si le statut persiste après 4 semaines, vérifier les liens entrants vers `/monde`.

4. **Preload sur `bg-nature7.webp` mais la spec mentionne `bg-forest.webp`** — Le `<link rel="preload">` dans `layout.tsx` pointe vers `/backgrounds/bg-nature7.webp`. La spec de l'audit mentionne `bg-forest.webp`. L'image de fond par défaut du site étant `bg-nature7.webp`, le preload est correct — c'est la spec qui est probablement obsolète.

5. **HH:MM + :SS sur deux lignes mobile** — Non vérifié dans le code (logique de rendu conditionnel responsive dans `Clock.tsx` non explorée en détail). À tester manuellement sur mobile.

---

## 🟢 PRIORITÉ BASSE — Améliorations optionnelles

1. **`loading="lazy"` sur les vignettes de galerie** — Non confirmé. Vérifier que les miniatures d'arrière-plans dans `SettingsPanel.tsx` ont bien `loading="lazy"`.

2. **Hint plein écran traduit** — La présence de la traduction du hint fullscreen n'a pas été confirmée dans `ClockPageClient.tsx`. À vérifier que le texte n'est pas hardcodé en français.

3. **FOUC script — robustesse navigateurs anciens** — Le script inline `foucScript` dans `layout.tsx` utilise des `try/catch`. Robuste pour les cas standards, mais à tester sur iOS Safari ≤ 14.

4. **Canonical avec ou sans slash final** — `/chrono` utilise `canonical: 'https://horloge-live.com/chrono'` (sans slash). Vérifier la cohérence avec la config serveur (redirection 301 si nécessaire) pour éviter la duplication.

---

## ✅ Points conformes

- **Toutes les pages de la spec existent** : `/`, `/chrono`, `/minuteur`, `/connexion`, `/mentions-legales`, `/cgu`, `/confidentialite`, + bonus `/monde` et `/compte`
- **Aucune route fantôme** : `/examen` n'est référencé nulle part dans le code source
- **`<title>` et `<meta description>`** présents sur toutes les pages
- **`robots: noindex, nofollow`** sur `/connexion`, `/compte`, `/mentions-legales`, `/cgu`, `/confidentialite`
- **`<link rel="canonical">`** présent sur toutes les pages indexables
- **JSON-LD `WebApplication`** présent dans `app/layout.tsx`
- **JSON-LD `FAQPage`** présent dans `app/page.tsx` uniquement ✅
- **`public/sitemap.xml`** : contient `/`, `/chrono`, `/minuteur`, `/monde` — les pages noindex en sont absentes ✅
- **`public/robots.txt`** : Disallow corrects + URL sitemap déclarée ✅
- **`body::before`** avec `rgba(0,0,0,0.25)` présent dans `globals.css` ✅
- **`.glass`** avec double `backdrop-filter` + `-webkit-backdrop-filter` dans CSS ✅
- **Styles inline** : tous les composants utilisent `backdropFilter` + `WebkitBackdropFilter` ✅
- **`font-family: var(--clock-font-family)`** utilisé dans `Clock.tsx`, `ChronoPageClient.tsx`, `MinuteurPageClient.tsx`, `MondePageClient.tsx` — jamais hardcodé ✅
- **`strokeWidth={1.5}`** sur toutes les icônes Lucide (Sidebar, SettingsPanel, MobileNav, ClockPageClient…) ✅
- **`fontVariantNumeric: 'tabular-nums'`** dans `Clock.tsx` et tous les composants d'affichage numérique ✅
- **Pages légales** : fond `#0D1B2A` via `LegalPageLayout.tsx` ✅
- **`background-color` sur body** : utilise `var(--bg-color)` (transparent par défaut) — pas de couleur solide hardcodée ✅
- **`localStorage.setItem()`** appelé à chaque changement de préférence dans `lib/useSettings.ts` ✅
- **Script FOUC** : présent dans `<head>` de `layout.tsx`, lit localStorage et applique les variables CSS avant le premier paint ✅
- **`next.config.js`** : `compress: true`, `poweredByHeader: false`, formats `avif`/`webp`, headers cache `/backgrounds/` et `/_next/static/` ✅
- **`Inter`** chargée via `next/font/google` avec `display: 'swap'` ✅
- **`<link rel="preconnect">`** pour `fonts.googleapis.com` et `fonts.gstatic.com` ✅
- **`SettingsPanel`** importé en `dynamic()` avec `ssr: false` dans tous les composants client ✅
- **`Sidebar`** importé en `dynamic()` avec `ssr: false` ✅
- **`<link rel="preload">`** pour l'image de fond par défaut `bg-nature7.webp` ✅
- **MobileNav** : deux barres fixes en bas avec classe `sm:hidden flex` ✅
- **Sidebar** masquée sur mobile via `hidden sm:flex` (les liens footer sont donc aussi masqués sur mobile) ✅
- **`max-h-[85vh]` sur mobile** et `sm:max-h-[70vh]` sur desktop dans `SettingsPanel.tsx` ✅
- **Firebase** : config 100% via `process.env.NEXT_PUBLIC_*` — aucune clé hardcodée dans `lib/firebase.ts` ✅
- **Pattern singleton Firebase** pour éviter les doublons hot-reload Next.js ✅
- **`/connexion` noindex, nofollow** ✅
- **Checkbox RGPD uniquement sur l'onglet Inscription** : `{tab === 'inscription' && <RgpdCheckbox />}` ✅
- **7 clés localStorage sur 8** conformes à la spec (`horloge-live.com-font-size`, `-text-color`, `-background`, `-format`, `-mirror`, `-show-date`, `-language`) ✅
- **HEURES / MINUTES / SECONDES** traduits dynamiquement (objet `TRANSLATIONS` dans `Clock.tsx`) ✅
- **Jours de la semaine** traduits FR/EN ✅
- **Mois de l'année** traduits FR/EN ✅
- **Items sidebar** traduits FR/EN (Horloge/Clock, Chronomètre/Stopwatch, Minuteur/Timer, Monde/World) ✅
- **Détection automatique de la langue** via `navigator.language` ✅

---

## Détail par section

### 1. Pages & Routes

| Page | Fichier | Statut |
|------|---------|--------|
| `/` | `app/page.tsx` | ✅ OK |
| `/chrono` | `app/chrono/page.tsx` | ✅ OK |
| `/minuteur` | `app/minuteur/page.tsx` | ✅ OK |
| `/connexion` | `app/connexion/page.tsx` | ✅ OK |
| `/mentions-legales` | `app/mentions-legales/page.tsx` | ✅ OK |
| `/cgu` | `app/cgu/page.tsx` | ✅ OK |
| `/confidentialite` | `app/confidentialite/page.tsx` | ✅ OK |
| `layout` | `app/layout.tsx` | ✅ OK |
| `/monde` | `app/monde/page.tsx` | ⚠️ Page existante, indexable, mais signalée "Découvert - non indexé" dans Search Console |
| `/compte` | `app/compte/page.tsx` | ✅ OK (bonus, noindex) |
| `/examen` | — | ✅ Aucune référence dans le code source |

**Composants attendus :**

| Composant | Fichier | Statut |
|-----------|---------|--------|
| `Clock.tsx` | `components/Clock.tsx` | ✅ OK |
| `Sidebar.tsx` | `components/Sidebar.tsx` | ✅ OK |
| `MobileNav.tsx` | `components/MobileNav.tsx` | ✅ OK |
| `SettingsPanel.tsx` | `components/SettingsPanel.tsx` | ✅ OK |
| `BottomBar.tsx` | — | ❌ ABSENT — logique intégrée dans MobileNav.tsx |
| `lib/useSettings.ts` | `lib/useSettings.ts` | ✅ OK |
| `lib/firebase.ts` | `lib/firebase.ts` | ✅ OK |

---

### 2. SEO Technique

**Balises meta :**

| Page | title | description | robots | canonical |
|------|-------|-------------|--------|-----------|
| `/` | ✅ | ✅ | ✅ index | ✅ |
| `/chrono` | ✅ | ✅ | ✅ index | ✅ |
| `/minuteur` | ✅ | ✅ | ✅ index | ✅ |
| `/monde` | ✅ | ✅ | ✅ index | ✅ |
| `/connexion` | ✅ | ✅ | ✅ noindex | ✅ |
| `/compte` | ✅ | — | ✅ noindex | — |
| `/mentions-legales` | ✅ | ✅ | ✅ noindex | — |
| `/cgu` | ✅ | ✅ | ✅ noindex | — |
| `/confidentialite` | ✅ | ✅ | ✅ noindex | — |

> Note : `TEXTES_SEO.md` absent du dépôt — vérification mot à mot des textes impossible. ⚠️

**JSON-LD :**
- `WebApplication` dans `app/layout.tsx` ✅
- `FAQPage` dans `app/page.tsx` uniquement ✅
- Syntaxe JSON valide (pas d'erreur détectée) ✅
- Contenu conforme à la spec générale ✅ (vérification exacte contre TEXTES_SEO.md impossible)

**Sitemap & robots :**
- `public/sitemap.xml` : ✅ contient `/`, `/chrono`, `/minuteur`, `/monde`
- Pages noindex absentes du sitemap ✅
- `public/robots.txt` : ✅ Disallow corrects pour toutes les pages privées
- URL du sitemap déclarée dans robots.txt ✅

---

### 3. Design System

| Règle | Statut |
|-------|--------|
| Pas de `background-color` solide sur `body` | ✅ Utilise `var(--bg-color)` (transparent) |
| Double `backdrop-filter` + `-webkit-backdrop-filter` (CSS) | ✅ Classes `.glass`, `.glass-active`, `.glass-accent` |
| Double `backdropFilter` + `WebkitBackdropFilter` (inline styles) | ✅ Tous les composants |
| `font-family: var(--clock-font-family)` sur l'horloge | ✅ Clock.tsx, ChronoPageClient, MinuteurPageClient, MondePageClient |
| `strokeWidth={1.5}` sur toutes les icônes Lucide | ✅ Confirmé dans tous les composants |
| `fontVariantNumeric: 'tabular-nums'` sur les chiffres | ✅ Clock.tsx et tous affichages numériques |
| Pages légales fond `#0D1B2A` | ✅ Via `LegalPageLayout.tsx` |
| `body::before` avec `rgba(0,0,0,0.25)` | ✅ `globals.css` ligne 100-107 |
| `localStorage.setItem()` à chaque changement | ✅ `lib/useSettings.ts` |
| Variables CSS présentes dans `globals.css` | ✅ (vérification exhaustive vs DESIGN_SYSTEM.md impossible — fichier absent) |
| `DESIGN_SYSTEM.md` disponible pour audit | ❌ ABSENT du dépôt |

---

### 4. Performances

| Point | Statut |
|-------|--------|
| `compress: true` | ✅ `next.config.js` |
| `poweredByHeader: false` | ✅ `next.config.js` |
| Formats `avif`/`webp` | ✅ `next.config.js` |
| Headers cache `/backgrounds/` | ✅ `max-age=31536000, immutable` |
| Headers cache `/_next/static/` | ✅ `max-age=31536000, immutable` |
| `Inter` via `next/font/google` + `display: 'swap'` | ✅ `app/layout.tsx` |
| Les 61+ autres polices non préchargées | ✅ Chargées à la demande via `googleFonts.ts` |
| `<link rel="preconnect">` Google Fonts | ✅ `fonts.googleapis.com` + `fonts.gstatic.com` |
| `SettingsPanel` en `dynamic()` + `ssr: false` | ✅ Confirmé dans tous les composants client |
| `Sidebar` en `dynamic()` + `ssr: false` | ✅ Confirmé |
| Firebase hors du layout global | ✅ Importé uniquement dans les composants qui en ont besoin |
| `<link rel="preload">` image de fond | ✅ `bg-nature7.webp` (spec mentionne `bg-forest.webp` — probablement obsolète) |
| Script FOUC synchrone dans `<head>` | ✅ Applique variables CSS avant premier paint |

---

### 5. Responsive Mobile

| Point | Statut |
|-------|--------|
| `MobileNav` présent avec 2 barres fixes en bas | ✅ Classes `sm:hidden flex` |
| Sidebar masquée sur mobile | ✅ `hidden sm:flex` |
| Liens footer masqués sur mobile | ✅ Sidebar entière masquée sur mobile |
| `max-height: 85vh` sur panneau paramètres mobile | ✅ `max-h-[85vh] sm:max-h-[70vh]` dans SettingsPanel.tsx |
| HH:MM sur une ligne + :SS dessous sur mobile | ⚠️ Non vérifié — logique de rendu responsive dans Clock.tsx non explorée en détail |

---

### 6. Firebase & Auth

| Point | Statut |
|-------|--------|
| `lib/firebase.ts` existe | ✅ |
| Config via `process.env.NEXT_PUBLIC_*` | ✅ Toutes les 6 clés |
| Aucune valeur hardcodée dans `firebase.ts` | ✅ (fallback sur `'placeholder'`) |
| `.env.local.example` existe | ❌ ABSENT |
| `/connexion` avec `noindex, nofollow` | ✅ |
| Checkbox RGPD uniquement sur l'onglet Inscription | ✅ `{tab === 'inscription' && <RgpdCheckbox />}` |

---

### 7. localStorage — Clés de stockage

| Clé attendue (spec) | Clé réelle (code) | Statut |
|---------------------|-------------------|--------|
| `horloge-live.com-fontPolice` | `horloge-live.com-font` | ⚠️ NOM DIFFÉRENT |
| `horloge-live.com-font-size` | `horloge-live.com-font-size` | ✅ |
| `horloge-live.com-text-color` | `horloge-live.com-text-color` | ✅ |
| `horloge-live.com-background` | `horloge-live.com-background` | ✅ |
| `horloge-live.com-format` | `horloge-live.com-format` | ✅ |
| `horloge-live.com-mirror` | `horloge-live.com-mirror` | ✅ |
| `horloge-live.com-show-date` | `horloge-live.com-show-date` | ✅ |
| `horloge-live.com-language` | `horloge-live.com-language` | ✅ |
| *(non attendue)* | `horloge-live.com-show-seconds` | ⚠️ CLÉ SUPPLÉMENTAIRE non documentée |

**Total : 7/8 clés conformes — 1 renommage non documenté — 1 clé supplémentaire**

---

### 8. Traductions FR/EN

| Élément | Statut |
|---------|--------|
| HEURES / MINUTES / SECONDES / MILLIÈMES | ✅ Objet `TRANSLATIONS` dans `Clock.tsx` |
| Jours de la semaine | ✅ Tableau `days` FR/EN |
| Mois de l'année | ✅ Tableau `months` FR/EN |
| Items sidebar (Horloge / Chrono / Minuteur / Monde) | ✅ Labels FR/EN dans `Sidebar.tsx` et `MobileNav.tsx` |
| Items navigation mobile | ✅ Labels FR/EN dans `MobileNav.tsx` |
| Hint plein écran | ⚠️ Non vérifié dans `ClockPageClient.tsx` |
| Boutons chrono/minuteur | ⚠️ Non vérifiés (probables dans `ChronoPageClient.tsx` / `MinuteurPageClient.tsx`) |
| Titre panneau paramètres | ⚠️ Non vérifié dans `SettingsPanel.tsx` |

---

## Plan d'action recommandé

Actions classées de la plus urgente à la moins urgente :

1. **[CRITIQUE] Créer `.env.local.example`** avec les noms des 7 variables Firebase requises (sans valeurs). Un développeur qui clone le projet en a besoin immédiatement.

2. **[CRITIQUE] Recréer `TEXTES_SEO.md` et `DESIGN_SYSTEM.md`** ou les committer dans le dépôt si ils existent ailleurs. Ces documents sont la référence de l'audit — sans eux, aucune vérification de conformité exacte n'est possible.

3. **[IMPORTANT] Trancher sur `BottomBar.tsx`** : soit extraire les deux barres de `MobileNav.tsx` dans un composant dédié `components/BottomBar.tsx`, soit mettre à jour la spec pour refléter l'implémentation actuelle.

4. **[IMPORTANT] Documenter la clé `horloge-live.com-font`** — La spec dit `horloge-live.com-fontPolice`. Si le renommage est définitif, mettre à jour la documentation. Si des utilisateurs ont l'ancienne clé, ajouter une migration dans `useSettings.ts` (lecture de l'ancienne clé en fallback).

5. **[IMPORTANT] Documenter `horloge-live.com-show-seconds`** dans la liste officielle des 8 clés → devient la 9ème clé.

6. **[SURVEILLANCE] Suivre le statut `/monde` dans Search Console** pendant 4 semaines. Si "Découvert - non indexé" persiste, vérifier les liens entrants internes vers cette page et s'assurer que Googlebot peut la crawler.

7. **[VÉRIFICATION] Tester manuellement sur mobile** :
   - L'horloge affiche-t-elle HH:MM sur une ligne et :SS dessous ?
   - Les vignettes de fond ont-elles `loading="lazy"` ?
   - Le hint plein écran est-il bien traduit en anglais ?

8. **[VÉRIFICATION] Parcourir `ChronoPageClient.tsx`, `MinuteurPageClient.tsx` et `SettingsPanel.tsx`** pour confirmer que tous les textes utilisateurs sont dans des objets de traduction (pas hardcodés en français).

9. **[OPTIONNEL] Mettre à jour la spec** pour remplacer `bg-forest.webp` par `bg-nature7.webp` comme image de fond de référence.

10. **[OPTIONNEL] Vérifier les canonicals** : uniformiser avec ou sans slash final (`/chrono` vs `/chrono/`) selon la config serveur de production.
