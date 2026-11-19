'use client';

import { useState, useEffect } from 'react';

const t = {
  hours: 'HOURS',
  minutes: 'MINUTES',
  seconds: 'SECONDS',
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
} as const;

interface ClockProps {
  format?: '12h' | '24h';
  showDate?: boolean;
  showSeconds?: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatDate(d: Date) {
  return `${t.days[d.getDay()]}, ${t.months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Pré-remplissage instantané — exécuté pendant le parsing du HTML, AVANT l'hydratation.
 * Écrit l'heure réelle dans les éléments [data-clk] pour que le premier affichage
 * (et donc le LCP) montre directement la bonne heure, sans attendre le JavaScript.
 * React garde ce texte grâce à suppressHydrationWarning, puis prend le relais.
 */
const PREFILL = `(function(){try{
var d=new Date(),h=d.getHours(),p=function(n){return(n<10?'0':'')+n};
if(localStorage.getItem('horloge-live.com-format')==='12h'){h=h%12||12}
var D=${JSON.stringify(t.days)},M=${JSON.stringify(t.months)};
var v={h:p(h),m:p(d.getMinutes()),s:p(d.getSeconds()),d:D[d.getDay()]+', '+M[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()};
var e=document.querySelectorAll('[data-clk]');
for(var i=0;i<e.length;i++){e[i].textContent=v[e[i].getAttribute('data-clk')]}
}catch(x){}})();`;

const digitStyle: React.CSSProperties = {
  fontFamily: 'var(--clock-font-family)',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 300,
  lineHeight: 1,
  color: 'var(--clock-text-color)',
};

function TimeUnit({ value, label, k }: { value: string; label: string; k: 'h' | 'm' | 's' }) {
  return (
    <div className="flex flex-col items-center">
      <div className="clock-size" style={digitStyle} data-clk={k} suppressHydrationWarning>
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
        color: 'var(--clock-text-color)',
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
}: ClockProps) {
  /* null au premier rendu, côté serveur ET côté client → structure identique,
     hydratation sans erreur. L'heure réelle est déjà écrite par PREFILL. */
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  let hh = '00';
  let mm = '00';
  let ss = '00';
  let ampm = '';
  let dateDisplay = ' ';

  if (time) {
    let hours = time.getHours();
    if (format === '12h') {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }
    hh = pad(hours);
    mm = pad(time.getMinutes());
    ss = pad(time.getSeconds());
    dateDisplay = formatDate(time);
  }

  const dateSecondaryStyle: React.CSSProperties = {
    fontWeight: 400,
    opacity: 0.5,
    color: 'var(--clock-text-color)',
  };

  return (
    <div className="text-center select-none">

      {/* ─── Desktop + Tablet : HH : MM : SS alignés à la baseline ─── */}
      <div className="hidden sm:flex items-baseline justify-center">
        <TimeUnit value={hh} label={t.hours} k="h" />
        <Colon />
        <TimeUnit value={mm} label={t.minutes} k="m" />
        {showSeconds && <>
          <Colon />
          <TimeUnit value={ss} label={t.seconds} k="s" />
        </>}
        {ampm && (
          <div
            className="ml-4"
            style={{
              fontFamily: 'var(--clock-font-family)',
              fontSize: '24px',
              fontWeight: 300,
              opacity: 0.6,
              color: 'var(--clock-text-color)',
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
          <div className="clock-size" style={digitStyle} data-clk="h" suppressHydrationWarning>
            {hh}
          </div>
          <div
            className="clock-size"
            style={{
              fontFamily: 'var(--clock-font-family)',
              fontWeight: 300,
              lineHeight: 1,
              color: 'var(--clock-text-color)',
              opacity: 0.5,
            }}
          >
            :
          </div>
          <div className="clock-size" style={digitStyle} data-clk="m" suppressHydrationWarning>
            {mm}
          </div>
        </div>

        {/* Labels HOURS / MINUTES */}
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
                color: 'var(--clock-text-color)',
                opacity: 0.5,
              }}
            >
              :
            </span>
            <span className="clock-size-seconds" style={digitStyle} data-clk="s" suppressHydrationWarning>
              {ss}
            </span>
          </div>

          {/* Label SECONDS */}
          <div className="clock-label mt-1">{t.seconds}</div>
        </>}

        {/* AM/PM */}
        {ampm && (
          <div
            className="mt-1"
            style={{ fontSize: '16px', fontWeight: 300, opacity: 0.6, color: 'var(--clock-text-color)' }}
          >
            {ampm}
          </div>
        )}
      </div>

      {/* ─── Date ─── */}
      {showDate && (
        <div className="mt-4 sm:mt-6">
          <span className="hidden sm:inline" style={{ ...dateSecondaryStyle, fontSize: '18px' }} data-clk="d" suppressHydrationWarning>
            {dateDisplay}
          </span>
          <span className="sm:hidden" style={{ ...dateSecondaryStyle, fontSize: '14px' }} data-clk="d" suppressHydrationWarning>
            {dateDisplay}
          </span>
        </div>
      )}

      {/* Pré-remplissage de l'heure avant hydratation (voir PREFILL) */}
      <script dangerouslySetInnerHTML={{ __html: PREFILL }} suppressHydrationWarning />
    </div>
  );
}
