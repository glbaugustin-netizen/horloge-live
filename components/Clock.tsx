'use client';

import { useState, useEffect } from 'react';

const TRANSLATIONS = {
  fr: {
    hours: 'HEURES',
    minutes: 'MINUTES',
    seconds: 'SECONDES',
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    ],
  },
  en: {
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
  },
} as const;

interface ClockProps {
  format?: '12h' | '24h';
  showDate?: boolean;
  showSeconds?: boolean;
  language?: 'fr' | 'en';
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  const clockStyle: React.CSSProperties = {
    fontFamily: 'var(--clock-font-family)',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 300,
    lineHeight: 1,
    color: 'var(--color-text-primary)',
  };
  return (
    <div className="flex flex-col items-center">
      <div className="clock-size" style={clockStyle}>
        {value}
      </div>
      <div className="clock-label mt-1">{label}</div>
    </div>
  );
}

function Colon() {
  return (
    <div
      className="clock-size"
      style={{
        fontFamily: 'var(--clock-font-family)',
        fontWeight: 300,
        lineHeight: 1,
        color: 'var(--color-text-primary)',
        opacity: 0.5,
        /* décalage vers le bas = hauteur du label + mt-1 ≈ 18px */
        paddingBottom: '18px',
      }}
    >
      :
    </div>
  );
}

export default function Clock({
  format = '24h',
  showDate = true,
  showSeconds = false,
  language = 'fr',
}: ClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = TRANSLATIONS[language];

  /* ── placeholder pré-rendu (avant hydratation JS) ── */
  if (!time) {
    const clockStyle: React.CSSProperties = {
      fontFamily: 'var(--clock-font-family)',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 300,
      lineHeight: 1,
      color: 'var(--color-text-primary)',
      opacity: 0.9,
    };
    return (
      <div className="text-center select-none">
        {/* Desktop placeholder */}
        <div className="hidden sm:flex items-baseline justify-center">
          <div className="flex flex-col items-center">
            <div className="clock-size" style={clockStyle}>--</div>
            <div className="clock-label mt-1">{t.hours}</div>
          </div>
          <div className="clock-size" style={{ ...clockStyle, opacity: 0.5, paddingBottom: '18px' }}>:</div>
          <div className="flex flex-col items-center">
            <div className="clock-size" style={clockStyle}>--</div>
            <div className="clock-label mt-1">{t.minutes}</div>
          </div>
          {showSeconds && <>
            <div className="clock-size" style={{ ...clockStyle, opacity: 0.5, paddingBottom: '18px' }}>:</div>
            <div className="flex flex-col items-center">
              <div className="clock-size" style={clockStyle}>--</div>
              <div className="clock-label mt-1">{t.seconds}</div>
            </div>
          </>}
        </div>
        {/* Mobile placeholder */}
        <div className="sm:hidden text-center">
          <div className="flex items-baseline justify-center">
            <div className="clock-size" style={clockStyle}>--</div>
            <div className="clock-size" style={{ ...clockStyle, opacity: 0.5 }}>:</div>
            <div className="clock-size" style={clockStyle}>--</div>
          </div>
        </div>
      </div>
    );
  }

  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  let ampm = '';
  if (format === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  const hh = pad(hours);
  const mm = pad(minutes);
  const ss = pad(seconds);

  const dayName = t.days[time.getDay()];
  const monthName = t.months[time.getMonth()];
  const dateDisplay =
    language === 'fr'
      ? `${dayName} ${time.getDate()} ${monthName} ${time.getFullYear()}`
      : `${dayName}, ${monthName} ${time.getDate()}, ${time.getFullYear()}`;

  const dateSecondaryStyle: React.CSSProperties = {
    fontWeight: 400,
    opacity: 0.5,
    color: 'var(--color-text-primary)',
  };

  return (
    <div className="text-center select-none">

      {/* ─── Desktop + Tablet : HH : MM : SS alignés à la baseline ─── */}
      <div className="hidden sm:flex items-baseline justify-center">
        <TimeUnit value={hh} label={t.hours} />
        <Colon />
        <TimeUnit value={mm} label={t.minutes} />
        {showSeconds && <>
          <Colon />
          <TimeUnit value={ss} label={t.seconds} />
        </>}
        {ampm && (
          <div
            className="ml-4"
            style={{
              fontFamily: 'var(--clock-font-family)',
              fontSize: '24px',
              fontWeight: 300,
              opacity: 0.6,
              color: 'var(--color-text-primary)',
            }}
          >
            {ampm}
          </div>
        )}
      </div>

      {/* ─── Mobile : HH:MM grande, :SS en dessous (40 %) ─── */}
      <div className="sm:hidden text-center">
        {/* HH:MM */}
        <div className="flex items-baseline justify-center">
          <div
            className="clock-size"
            style={{
              fontFamily: 'var(--clock-font-family)',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 300,
              lineHeight: 1,
              color: 'var(--color-text-primary)',
            }}
          >
            {hh}
          </div>
          <div
            className="clock-size"
            style={{
              fontFamily: 'var(--clock-font-family)',
              fontWeight: 300,
              lineHeight: 1,
              color: 'var(--color-text-primary)',
              opacity: 0.5,
            }}
          >
            :
          </div>
          <div
            className="clock-size"
            style={{
              fontFamily: 'var(--clock-font-family)',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 300,
              lineHeight: 1,
              color: 'var(--color-text-primary)',
            }}
          >
            {mm}
          </div>
        </div>

        {/* Labels HEURES / MINUTES */}
        <div className="flex justify-around mt-1 px-4">
          <div className="clock-label">{t.hours}</div>
          <div className="clock-label">{t.minutes}</div>
        </div>

        {/* :SS */}
        {showSeconds && <>
          <div className="mt-3 flex items-baseline justify-center">
            <span
              className="clock-size-seconds"
              style={{
                fontFamily: 'var(--clock-font-family)',
                fontWeight: 300,
                lineHeight: 1,
                color: 'var(--color-text-primary)',
                opacity: 0.5,
              }}
            >
              :
            </span>
            <span
              className="clock-size-seconds"
              style={{
                fontFamily: 'var(--clock-font-family)',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 300,
                lineHeight: 1,
                color: 'var(--color-text-primary)',
              }}
            >
              {ss}
            </span>
          </div>

          {/* Label SECONDES */}
          <div className="clock-label mt-1">{t.seconds}</div>
        </>}

        {/* AM/PM */}
        {ampm && (
          <div
            className="mt-1"
            style={{ fontSize: '16px', fontWeight: 300, opacity: 0.6, color: 'var(--color-text-primary)' }}
          >
            {ampm}
          </div>
        )}
      </div>

      {/* ─── Date ─── */}
      {showDate && (
        <div className="mt-4 sm:mt-6">
          <span className="hidden sm:inline" style={{ ...dateSecondaryStyle, fontSize: '18px' }}>
            {dateDisplay}
          </span>
          <span className="sm:hidden" style={{ ...dateSecondaryStyle, fontSize: '14px' }}>
            {dateDisplay}
          </span>
        </div>
      )}
    </div>
  );
}
