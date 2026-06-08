'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface AnalogClockProps {
  size?: number;           // diamètre en px, défaut 300
  showNumbers?: boolean;   // true = chiffres 1–12, false = traits seulement
  style?: 'classic' | 'minimal'; // classic = aiguilles avec contrepoids
  format?: '12h' | '24h';
  language?: 'fr' | 'en';
  clockTheme?: 'glass' | 'white'; // défaut : 'glass'
}

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */

/** Angle en degrés → coordonnées sur le cadran (0° = 12h) */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Extrémité opposée (contrepoids) */
function polarOpp(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx - r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

/* ─────────────────────────────────────────────────────────────
   Composant
───────────────────────────────────────────────────────────── */
export default function AnalogClock({
  size = 300,
  showNumbers = true,
  style = 'classic',
  format = '12h',
  language = 'fr',
  clockTheme = 'glass',
}: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* ── Palette selon le thème ── */
  const colors = clockTheme === 'white' ? {
    dialFill:    '#FFFFFF',
    dialStroke:  'rgba(13, 27, 42, 0.15)',
    dialGlow:    'none',
    tickHour:    'rgba(13, 27, 42, 0.70)',
    tickMinute:  'rgba(13, 27, 42, 0.35)',
    numbers:     'rgba(13, 27, 42, 0.85)',
    handHour:    '#0D1B2A',
    handMinute:  '#0D1B2A',
    handSecond:  '#E53E3E',
    pivot:       '#E53E3E',
    pivotInner:  '#FFFFFF',
    shadow:      'drop-shadow(0 4px 24px rgba(0,0,0,0.15))',
  } : {
    dialFill:    'rgba(255, 255, 255, 0.08)',
    dialStroke:  'rgba(255, 255, 255, 0.15)',
    dialGlow:    'rgba(255, 255, 255, 0.05)',
    tickHour:    'rgba(255, 255, 255, 0.70)',
    tickMinute:  'rgba(255, 255, 255, 0.35)',
    numbers:     'rgba(255, 255, 255, 0.85)',
    handHour:    'rgba(255, 255, 255, 0.95)',
    handMinute:  'rgba(255, 255, 255, 0.95)',
    handSecond:  '#4FC3F7',
    pivot:       '#4FC3F7',
    pivotInner:  '#FFFFFF',
    shadow:      'drop-shadow(0 4px 24px rgba(0,0,0,0.3))',
  };

  const cx = size / 2;
  const cy = size / 2;
  const r  = (size / 2) * 0.92;

  /* ── Calcul des angles ── */
  const rawH    = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hours = format === '24h' ? rawH % 24 : rawH % 12;

  const secondAngle = seconds * 6;                          // 360/60
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle   = format === '24h'
    ? hours * 15 + minutes * 0.25   // 360/24
    : hours * 30 + minutes * 0.5;   // 360/12

  /* ── Extrémités des aiguilles ── */
  // Heures
  const hourFwd = polar(cx, cy, r * 0.50, hourAngle);
  const hourBwd = style === 'classic'
    ? polarOpp(cx, cy, r * 0.15, hourAngle)
    : { x: cx, y: cy };
  const hourW   = style === 'classic' ? size * 0.028 : size * 0.016;

  // Minutes
  const minFwd = polar(cx, cy, r * 0.72, minuteAngle);
  const minBwd = style === 'classic'
    ? polarOpp(cx, cy, r * 0.18, minuteAngle)
    : { x: cx, y: cy };
  const minW   = style === 'classic' ? size * 0.020 : size * 0.012;

  // Secondes
  const secFwd = polar(cx, cy, r * 0.80, secondAngle);
  const secBwd = polarOpp(cx, cy, r * 0.22, secondAngle);

  /* ── Rendu ── */
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ filter: colors.shadow }}
      aria-label={language === 'fr' ? 'Horloge analogique' : 'Analog clock'}
    >
      {/* ── 1. Cadran ── */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={colors.dialFill}
        stroke={colors.dialStroke}
        strokeWidth={1}
      />
      {/* Légère lueur intérieure (ignorée en thème white via 'none') */}
      {colors.dialGlow !== 'none' && (
        <circle
          cx={cx} cy={cy} r={r * 0.97}
          fill="none"
          stroke={colors.dialGlow}
          strokeWidth={r * 0.06}
        />
      )}

      {/* ── 2. Graduations (60 traits) ── */}
      {Array.from({ length: 60 }, (_, i) => {
        const isHour = i % 5 === 0;
        const len    = isHour ? r * 0.12 : r * 0.05;
        const angle  = (i * 6 - 90) * (Math.PI / 180);
        const r88    = r * 0.88;
        const x1 = cx + r88 * Math.cos(angle);
        const y1 = cy + r88 * Math.sin(angle);
        const x2 = cx + (r88 - len) * Math.cos(angle);
        const y2 = cy + (r88 - len) * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isHour ? colors.tickHour : colors.tickMinute}
            strokeWidth={isHour ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}

      {/* ── 3. Chiffres 1–12 (optionnel) ── */}
      {showNumbers && Array.from({ length: 12 }, (_, i) => {
        const num   = i + 1;
        const angle = (num * 30 - 90) * (Math.PI / 180);
        const nr    = r * 0.72;
        const x     = cx + nr * Math.cos(angle);
        const y     = cy + nr * Math.sin(angle);
        return (
          <text
            key={num}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.072}
            fontWeight="300"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fill={colors.numbers}
          >
            {num}
          </text>
        );
      })}

      {/* ── 4. Aiguille des heures ── */}
      <line
        x1={hourBwd.x} y1={hourBwd.y}
        x2={hourFwd.x} y2={hourFwd.y}
        stroke={colors.handHour}
        strokeWidth={hourW}
        strokeLinecap="round"
      />

      {/* ── 5. Aiguille des minutes ── */}
      <line
        x1={minBwd.x} y1={minBwd.y}
        x2={minFwd.x} y2={minFwd.y}
        stroke={colors.handMinute}
        strokeWidth={minW}
        strokeLinecap="round"
      />

      {/* ── 6. Aiguille des secondes ── */}
      <line
        x1={secBwd.x} y1={secBwd.y}
        x2={secFwd.x} y2={secFwd.y}
        stroke={colors.handSecond}
        strokeWidth={size * 0.008}
        strokeLinecap="round"
      />

      {/* ── 7. Centre (pivot) ── */}
      <circle cx={cx} cy={cy} r={size * 0.025} fill={colors.pivot} />
      <circle cx={cx} cy={cy} r={size * 0.012} fill={colors.pivotInner} />
    </svg>
  );
}
