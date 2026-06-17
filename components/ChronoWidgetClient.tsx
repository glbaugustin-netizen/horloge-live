'use client';

import { useState, useEffect, useRef } from 'react';

interface ChronoWidgetClientProps {
  fontSize: number;
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatElapsed(ms: number): { main: string; millis: string } {
  const totalSec = Math.floor(ms / 1000);
  const h  = Math.floor(totalSec / 3600);
  const m  = Math.floor((totalSec % 3600) / 60);
  const s  = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  const main = h > 0 ? `${pad2(h)}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
  return { main, millis: pad2(cs) };
}

export default function ChronoWidgetClient({ fontSize }: ChronoWidgetClientProps) {
  const [elapsed,  setElapsed]  = useState(0);
  const [running,  setRunning]  = useState(false);
  const startRef  = useRef<number | null>(null);
  const baseRef   = useRef(0);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    const tick = () => {
      setElapsed(baseRef.current + (performance.now() - (startRef.current ?? 0)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  const handlePlayPause = () => {
    if (running) {
      baseRef.current = elapsed;
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const handleReset = () => {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
  };

  const { main, millis } = formatElapsed(elapsed);
  const millisSize = Math.round(fontSize * 0.42);
  const btnSize    = Math.max(28, Math.round(fontSize * 0.34));

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        background:     '#0A0A0A',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
        gap:            `${Math.round(fontSize * 0.28)}px`,
        zIndex:         9999,
      }}
    >
      {/* Affichage temps */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', lineHeight: 1 }}>
        <span
          style={{
            fontFamily:         'var(--clock-font-family, Inter, sans-serif)',
            fontSize:           `${fontSize}px`,
            fontVariantNumeric: 'tabular-nums',
            fontWeight:         300,
            letterSpacing:      '0.04em',
            lineHeight:         1,
            color:              '#ffffff',
          }}
        >
          {main}
        </span>
        <span
          style={{
            fontFamily:         'var(--clock-font-family, Inter, sans-serif)',
            fontSize:           `${millisSize}px`,
            fontVariantNumeric: 'tabular-nums',
            fontWeight:         300,
            letterSpacing:      '0.04em',
            color:              'rgba(255,255,255,0.45)',
            lineHeight:         1,
            paddingBottom:      `${Math.round(fontSize * 0.06)}px`,
          }}
        >
          .{millis}
        </span>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          style={{
            width:                `${btnSize}px`,
            height:               `${btnSize}px`,
            borderRadius:         '50%',
            display:              'flex',
            alignItems:           'center',
            justifyContent:       'center',
            cursor:               'pointer',
            background:           'rgba(255,255,255,0.15)',
            backdropFilter:       'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border:               '1px solid rgba(255,255,255,0.30)',
            boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.40)',
            color:                '#ffffff',
            transition:           'background 180ms ease, transform 0.22s cubic-bezier(.2,.9,.3,1.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = 'rgba(255,255,255,0.24)';
            e.currentTarget.style.transform   = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform   = 'scale(1)';
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
          onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          aria-label={running ? 'Pause' : 'Démarrer'}
        >
          {running ? (
            /* Pause icon */
            <svg width={Math.round(btnSize * 0.36)} height={Math.round(btnSize * 0.36)} viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="3.5" height="12" rx="1"/>
              <rect x="9.5" y="2" width="3.5" height="12" rx="1"/>
            </svg>
          ) : (
            /* Play icon */
            <svg width={Math.round(btnSize * 0.36)} height={Math.round(btnSize * 0.36)} viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2.5l10 5.5-10 5.5V2.5z"/>
            </svg>
          )}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          style={{
            width:                `${Math.round(btnSize * 0.75)}px`,
            height:               `${Math.round(btnSize * 0.75)}px`,
            borderRadius:         '50%',
            display:              'flex',
            alignItems:           'center',
            justifyContent:       'center',
            cursor:               'pointer',
            background:           'rgba(255,255,255,0.07)',
            backdropFilter:       'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border:               '1px solid rgba(255,255,255,0.15)',
            color:                'rgba(255,255,255,0.55)',
            transition:           'background 180ms ease, color 180ms ease, transform 0.22s cubic-bezier(.2,.9,.3,1.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
            e.currentTarget.style.color      = 'rgba(255,255,255,0.85)';
            e.currentTarget.style.transform  = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.color      = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.transform  = 'scale(1)';
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.90)'; }}
          onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          aria-label="Réinitialiser"
        >
          <svg width={Math.round(btnSize * 0.28)} height={Math.round(btnSize * 0.28)} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 8a5.5 5.5 0 1 0 1-3.1"/>
            <path d="M2.5 2v3h3"/>
          </svg>
        </button>
      </div>

      {/* Lien discret */}
      <a
        href="https://horloge-live.com/chrono"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position:   'absolute',
          bottom:     '8px',
          fontSize:   '11px',
          color:      'rgba(255,255,255,0.22)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        horloge-live.com
      </a>
    </div>
  );
}
