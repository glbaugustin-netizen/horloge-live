'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface FlipClockProps {
  theme: 'dark' | 'light';
  showSeconds: boolean;
  format: '12h' | '24h';
  language: 'fr' | 'en';
}

interface DigitState {
  cur: string;
  prev: string;
  key: number;
}

/* ─────────────────────────────────────────────────────────────
   Traductions
───────────────────────────────────────────────────────────── */
const LABELS = {
  fr: { hours: 'HEURES', minutes: 'MINUTES', seconds: 'SECONDES' },
  en: { hours: 'HOURS',  minutes: 'MINUTES', seconds: 'SECONDS'  },
} as const;

/* ─────────────────────────────────────────────────────────────
   CSS injecté — animation 3D pure, accélération GPU
───────────────────────────────────────────────────────────── */
const FLIP_CSS = `
.fc-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  user-select: none;
}
.fc-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.fc-pair {
  display: flex;
  gap: 6px;
}
/* ─ Carte ─ */
.fc-card {
  position: relative;
  width: 100px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  perspective: 300px;
}
/* ─ Demi-cartes statiques ─ */
.fc-half {
  position: absolute;
  left: 0; right: 0;
  height: 50%;
  overflow: hidden;
}
.fc-half--top { top: 0; }
.fc-half--bot { bottom: 0; }
/* ─ Chiffre — couvre toute la hauteur de la carte, centré ─ */
.fc-digit {
  position: absolute;
  left: 0; right: 0;
  top: 0;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96px;
  font-weight: 300;
  font-family: 'Inter', sans-serif;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  pointer-events: none;
}
/* Décalage pour la demi-carte basse : on remonte le chiffre de 50% */
.fc-digit--bot { top: -70px; }
/* ─ Ligne de pli ─ */
.fc-fold {
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  height: 1px;
  z-index: 5;
  pointer-events: none;
  transform: translateZ(0);
}
/* ─ Volet animé HAUT — ancien chiffre tombe vers le bas ─ */
.fc-anim--top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  overflow: hidden;
  transform-origin: center bottom;
  will-change: transform;
  backface-visibility: hidden;
  z-index: 3;
  animation: fc-flip-top 0.25s ease-in forwards;
  transform: translateZ(0);
}
/* ─ Volet animé BAS — nouveau chiffre remonte ─ */
.fc-anim--bot {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 50%;
  overflow: hidden;
  transform-origin: center top;
  will-change: transform;
  backface-visibility: hidden;
  z-index: 3;
  transform: rotateX(90deg) translateZ(0);
  animation: fc-flip-bot 0.25s ease-out 0.25s forwards;
}
@keyframes fc-flip-top {
  from { transform: rotateX(0deg); }
  to   { transform: rotateX(-90deg); }
}
@keyframes fc-flip-bot {
  from { transform: rotateX(90deg); }
  to   { transform: rotateX(0deg); }
}
/* ─ Séparateur : ─ */
.fc-sep {
  font-size: 80px;
  font-weight: 300;
  font-family: 'Inter', sans-serif;
  font-variant-numeric: tabular-nums;
  line-height: 140px;
  flex-shrink: 0;
  align-self: flex-start;
}
/* ─ Label sous les cartes ─ */
.fc-lbl {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
}
/* ─ Responsive tablette 640–1024px ─ */
@media (max-width: 1024px) {
  .fc-card      { width: 72px; height: 100px; }
  .fc-digit     { font-size: 68px; height: 100px; }
  .fc-digit--bot { top: -50px; }
  .fc-pair      { gap: 4px; }
  .fc-wrapper   { gap: 10px; }
  .fc-sep       { font-size: 60px; line-height: 100px; }
}
/* ─ Responsive mobile < 640px ─ */
@media (max-width: 640px) {
  .fc-card      { width: 52px; height: 72px; }
  .fc-digit     { font-size: 48px; height: 72px; }
  .fc-digit--bot { top: -36px; }
  .fc-pair      { gap: 3px; }
  .fc-wrapper   { gap: 6px; }
  .fc-sep       { font-size: 36px; line-height: 72px; }
}
`;

/* ─────────────────────────────────────────────────────────────
   Calcul des 6 chiffres de l'heure
───────────────────────────────────────────────────────────── */
function getTimeDigits(date: Date, format: '12h' | '24h'): string[] {
  let h = date.getHours();
  if (format === '12h') h = h % 12 || 12;
  const hh = String(h).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return [hh[0], hh[1], mm[0], mm[1], ss[0], ss[1]];
}

/* ─────────────────────────────────────────────────────────────
   Composant d'un chiffre flip
   Architecture des couches (de bas en haut) :
     1. Moitié haute statique  → chiffre ACTUEL (top)
     2. Moitié basse statique  → chiffre PRÉCÉDENT pendant l'animation
     3. Ligne de pli (z:5)
     4. Volet animé haut (z:3) → ancien chiffre tombe (0° → -90°)
     5. Volet animé bas  (z:3) → nouveau chiffre remonte (90° → 0°, délai 0.25s)
───────────────────────────────────────────────────────────── */
function FlipDigit({
  state,
  theme,
}: {
  state: DigitState;
  theme: 'dark' | 'light';
}) {
  const cardBg    = theme === 'dark' ? '#2A2A2A' : '#1A1A1A';
  const textColor = '#FFFFFF';
  const foldColor = 'rgba(0,0,0,0.40)';

  const txt: React.CSSProperties = { color: textColor };

  return (
    <div className="fc-card" style={{ background: cardBg }}>

      {/* Moitié haute statique : chiffre ACTUEL */}
      <div className="fc-half fc-half--top">
        <span className="fc-digit" style={txt}>{state.cur}</span>
      </div>

      {/* Moitié basse statique : chiffre PRÉCÉDENT (caché derrière volet animé bas) */}
      <div className="fc-half fc-half--bot">
        <span className="fc-digit fc-digit--bot" style={txt}>
          {state.key > 0 ? state.prev : state.cur}
        </span>
      </div>

      {/* Ligne de pli */}
      <div className="fc-fold" style={{ background: foldColor }} />

      {/* Volet animé HAUT — ancien chiffre tombe (monté avec key unique → relance l'anim) */}
      {state.key > 0 && (
        <div
          key={`at-${state.key}`}
          className="fc-anim--top"
          style={{ background: cardBg }}
        >
          <span className="fc-digit" style={txt}>{state.prev}</span>
        </div>
      )}

      {/* Volet animé BAS — nouveau chiffre remonte */}
      {state.key > 0 && (
        <div
          key={`ab-${state.key}`}
          className="fc-anim--bot"
          style={{ background: cardBg }}
        >
          <span className="fc-digit fc-digit--bot" style={txt}>{state.cur}</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Composant principal FlipClock
───────────────────────────────────────────────────────────── */
export default function FlipClock({
  theme,
  showSeconds,
  format,
  language,
}: FlipClockProps) {
  const t        = LABELS[language];
  const sepColor = 'rgba(255,255,255,0.60)';
  const lblColor = 'rgba(255,255,255,0.35)';

  /* 6 positions : [H1, H2, M1, M2, S1, S2] */
  const [digits, setDigits] = useState<DigitState[]>(() =>
    Array(6).fill(null).map(() => ({ cur: '0', prev: '0', key: 0 }))
  );

  useEffect(() => {
    /* Initialisation immédiate avec l'heure réelle */
    const init = getTimeDigits(new Date(), format);
    setDigits(init.map((d) => ({ cur: d, prev: d, key: 0 })));

    /* Tick toutes les secondes — n'anime que le chiffre qui change */
    const tick = setInterval(() => {
      setDigits((prev) => {
        const chars = getTimeDigits(new Date(), format);
        return prev.map((d, i) =>
          d.cur !== chars[i]
            ? { cur: chars[i], prev: d.cur, key: d.key + 1 }
            : d
        );
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [format]);

  const [h1, h2, m1, m2, s1, s2] = digits;

  return (
    <>
      {/* CSS injecté une seule fois dans le <head> */}
      <style dangerouslySetInnerHTML={{ __html: FLIP_CSS }} />

      <div className="fc-wrapper">

        {/* ── Heures ── */}
        <div className="fc-group">
          <div className="fc-pair">
            <FlipDigit state={h1} theme={theme} />
            <FlipDigit state={h2} theme={theme} />
          </div>
          <span className="fc-lbl" style={{ color: lblColor }}>{t.hours}</span>
        </div>

        <span className="fc-sep" style={{ color: sepColor }}>:</span>

        {/* ── Minutes ── */}
        <div className="fc-group">
          <div className="fc-pair">
            <FlipDigit state={m1} theme={theme} />
            <FlipDigit state={m2} theme={theme} />
          </div>
          <span className="fc-lbl" style={{ color: lblColor }}>{t.minutes}</span>
        </div>

        {/* ── Secondes (optionnel) ── */}
        {showSeconds && (
          <>
            <span className="fc-sep" style={{ color: sepColor }}>:</span>
            <div className="fc-group">
              <div className="fc-pair">
                <FlipDigit state={s1} theme={theme} />
                <FlipDigit state={s2} theme={theme} />
              </div>
              <span className="fc-lbl" style={{ color: lblColor }}>{t.seconds}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
