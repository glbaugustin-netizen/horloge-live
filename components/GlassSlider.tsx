'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface GlassSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default function GlassSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  ariaLabel,
}: GlassSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  /* Déformation liquide de la boule : {x: étirement horizontal, y: compression verticale} */
  const [stretch, setStretch] = useState({ x: 1, y: 1 });

  /* Suivi vitesse pour l'intensité de la déformation */
  const lastXRef    = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const resetTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ratio = (value - min) / (max - min);

  const valueFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const r = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = min + r * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
  }, [min, max, step, value]);

  const applyStretchFromVelocity = useCallback((clientX: number) => {
    const now = performance.now();
    if (lastXRef.current !== null) {
      const dt = Math.max(1, now - lastTimeRef.current);
      const dx = clientX - lastXRef.current;
      const v  = Math.abs(dx) / dt;                  // px / ms
      const speed = Math.min(v * 0.9, 1);            // normalisé 0→1
      setStretch({
        x: 1 + speed * 0.55,                         // s'allonge horizontalement
        y: 1 - speed * 0.32,                         // s'aplatit verticalement
      });
      /* Si on arrête de bouger tout en maintenant : la boule se reforme */
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStretch({ x: 1, y: 1 }), 90);
    }
    lastXRef.current = clientX;
    lastTimeRef.current = now;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    lastXRef.current = null;
    onChange(valueFromClientX(e.clientX));
  }, [onChange, valueFromClientX]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    onChange(valueFromClientX(e.clientX));
    applyStretchFromVelocity(e.clientX);
  }, [onChange, valueFromClientX, applyStretchFromVelocity]);

  const endDrag = useCallback(() => {
    draggingRef.current = false;
    setDragging(false);
    lastXRef.current = null;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    /* Reformation avec léger décalage (cf. transition-delay du blob) */
    setStretch({ x: 1, y: 1 });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let next = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   next = clamp(value + step, min, max);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = clamp(value - step, min, max);
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End')  next = max;
    else return;
    e.preventDefault();
    onChange(next);
  }, [value, step, min, max, onChange]);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value}px`}
      style={{
        position:     'relative',
        width:        '100%',
        height:       '24px',
        display:      'flex',
        alignItems:   'center',
        cursor:       dragging ? 'grabbing' : 'pointer',
        touchAction:  'none',
        userSelect:   'none',
        outline:      'none',
      }}
    >
      {/* Rail creusé */}
      <div
        style={{
          position:     'absolute',
          left:         0,
          right:        0,
          height:       '5px',
          borderRadius: '3px',
          background:   'var(--glass2-bg-recessed)',
          boxShadow:    'var(--glass2-shadow-recessed)',
        }}
      />

      {/* Partie remplie — léger reflet glass */}
      <div
        style={{
          position:     'absolute',
          left:         0,
          width:        `${ratio * 100}%`,
          height:       '5px',
          borderRadius: '3px',
          background:   'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.38))',
          boxShadow:    'inset 0 1px 1px rgba(255,255,255,0.30)',
          pointerEvents: 'none',
        }}
      />

      {/* Boule déformable */}
      <div
        style={{
          position:      'absolute',
          left:          `${ratio * 100}%`,
          transform:     'translateX(-50%)',
          width:         '20px',
          height:        '20px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width:         '100%',
            height:        '100%',
            borderRadius:  '50%',
            background:    'var(--glass2-knob-gradient)',
            boxShadow:     'var(--glass2-shadow-knob)',
            border:        '2px solid rgba(255,255,255,0.30)',
            overflow:      'hidden',
            position:      'relative',
            /* Déformation liquide */
            transform:     `scale(${stretch.x}, ${stretch.y})`,
            transition:    dragging
              ? 'transform 90ms cubic-bezier(.4,0,.2,1)'
              : 'transform 0.55s var(--glass2-ease-bounce) 0.07s',  // reformation + léger décalage
          }}
        >
          {/* Gloss bombé moitié haute */}
          <span
            aria-hidden="true"
            style={{
              position:     'absolute',
              top:          0,
              left:         0,
              right:        0,
              height:       '50%',
              borderRadius: '50% 50% 40% 40%',
              background:   'linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)',
              opacity:      0.6,
              pointerEvents:'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
