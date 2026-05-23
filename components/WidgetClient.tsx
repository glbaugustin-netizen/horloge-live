'use client';

import { useState, useEffect } from 'react';

interface WidgetClientProps {
  fontSize: number;
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export default function WidgetClient({ fontSize }: WidgetClientProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(`${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Horloge */}
      <div
        style={{
          fontFamily: 'var(--clock-font-family, Inter, sans-serif)',
          fontSize: `${fontSize}px`,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 300,
          letterSpacing: '0.04em',
          lineHeight: 1,
          color: '#ffffff',
        }}
      >
        {time ?? ' '}
      </div>

      {/* Lien discret — génère le backlink */}
      <a
        href="https://horloge-live.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          bottom: '8px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        horloge-live.com
      </a>
    </div>
  );
}
