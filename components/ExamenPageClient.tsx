'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Maximize2, Minimize2, Pencil, GraduationCap, ArrowLeft } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type Lang = 'fr' | 'en';

interface ExamConfig {
  subject: string;
  durationHours: number;
  durationMinutes: number;
  showSeconds: boolean;
  showDate: boolean;
  startTime: string;   // HH:MM:SS — vide = heure courante au lancement
  showEndTime: boolean;
}

const DEFAULT_CONFIG: ExamConfig = {
  subject: '',
  durationHours: 2,
  durationMinutes: 0,
  showSeconds: true,
  showDate: true,
  startTime: '',
  showEndTime: true,
};

const STORAGE_KEY     = 'horloge-live.com-examen-config';
const STORAGE_LANG    = 'horloge-live.com-language';

/* ─── Traductions ────────────────────────────────────────────── */
const LABELS = {
  fr: {
    backLink:        "Retour à l'horloge",
    title:           'Horloge plein écran pour la classe et les examens',
    subtitle:        'Horloge plein écran pour la salle de classe',
    labelSubject:    'Matière',
    placeholder:     'Ex : Mathématiques, Physique…',
    labelDuration:   "Durée de l'épreuve",
    labelStartTime:  'Heure de début',
    hour:            (n: number) => `${n} heure${n !== 1 ? 's' : ''}`,
    min:             (m: number) => `${m} min`,
    showSeconds:     'Afficher les secondes',
    showDate:        'Afficher la date',
    showEndTime:     "Afficher la fin de l'examen",
    startBtn:        "Démarrer l'examen",
    durationPrefix:  'Durée :',
    endTimePrefix:   "Fin de l'examen à",
    editBtn:         'Modifier',
    exitFullscreen:  'Quitter le plein écran',
    fullscreen:      'Plein écran',
  },
  en: {
    backLink:        'Back to clock',
    title:           'Full screen clock for classroom and exams',
    subtitle:        'Full screen clock for the classroom',
    labelSubject:    'Subject',
    placeholder:     'E.g. Mathematics, Physics…',
    labelDuration:   'Exam duration',
    labelStartTime:  'Start time',
    hour:            (n: number) => `${n} hour${n !== 1 ? 's' : ''}`,
    min:             (m: number) => `${m} min`,
    showSeconds:     'Show seconds',
    showDate:        'Show date',
    showEndTime:     'Show exam end time',
    startBtn:        'Start exam',
    durationPrefix:  'Duration:',
    endTimePrefix:   'Exam ends at',
    editBtn:         'Edit',
    exitFullscreen:  'Exit full screen',
    fullscreen:      'Full screen',
  },
} as const;

/* ─── Helpers ────────────────────────────────────────────────── */
function formatTime(date: Date, showSeconds: boolean): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  if (!showSeconds) return `${h}:${m}`;
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatDate(date: Date, lang: Lang): string {
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDuration(hours: number, minutes: number): string {
  if (hours > 0 && minutes > 0) return `${hours}h${minutes.toString().padStart(2, '0')}`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes} min`;
  return '';
}

function computeEndTime(
  startTime: string,
  durationHours: number,
  durationMinutes: number,
  showSeconds: boolean,
): string {
  let h: number, m: number, s: number;
  if (startTime) {
    const parts = startTime.split(':');
    h = parseInt(parts[0] ?? '0', 10) || 0;
    m = parseInt(parts[1] ?? '0', 10) || 0;
    s = parseInt(parts[2] ?? '0', 10) || 0;
  } else {
    const now = new Date();
    h = now.getHours();
    m = now.getMinutes();
    s = now.getSeconds();
  }
  const totalSec = h * 3600 + m * 60 + s + durationHours * 3600 + durationMinutes * 60;
  const endH = Math.floor(totalSec / 3600) % 24;
  const endM = Math.floor((totalSec % 3600) / 60);
  const endS = totalSec % 60;
  const hh = endH.toString().padStart(2, '0');
  const mm = endM.toString().padStart(2, '0');
  if (!showSeconds) return `${hh}h${mm}`;
  return `${hh}h${mm}:${endS.toString().padStart(2, '0')}`;
}

/* ─── Toggle component ───────────────────────────────────────── */
function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '12px' }}>
      <span style={{ fontSize: '15px', color: '#374151' }}>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          background: checked ? '#1a1a2e' : '#d1d5db',
          transition: 'background 200ms ease',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '23px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ffffff',
            transition: 'left 200ms ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
          }}
        />
      </button>
    </label>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function ExamenPageClient() {
  const [lang, setLang]             = useState<Lang>('fr');
  const [config, setConfig]         = useState<ExamConfig>(DEFAULT_CONFIG);
  const [isStarted, setIsStarted]   = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [endTime, setEndTime]       = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  /* Detect language + load config from localStorage */
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(STORAGE_LANG);
      if (storedLang === 'en') setLang('en');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ExamConfig>;
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch {}
  }, []);

  /* Save config to localStorage */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  /* Clock tick — only when exam is running */
  useEffect(() => {
    if (!isStarted) return;
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, [isStarted]);

  /* Hide SEO section while exam is running */
  useEffect(() => {
    const el = document.getElementById('examen-seo');
    if (el) el.style.display = isStarted ? 'none' : '';
  }, [isStarted]);

  /* Fullscreen listener */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleStart = () => {
    setCurrentTime(new Date());
    setEndTime(computeEndTime(
      config.startTime,
      config.durationHours,
      config.durationMinutes,
      config.showSeconds,
    ));
    setIsStarted(true);
  };

  const handleFullscreenToggle = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }, []);

  const t = LABELS[lang];

  /* ── Config panel ── */
  if (!isStarted) {
    const fieldLabel: React.CSSProperties = {
      display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280',
      textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px',
    };
    const fieldInput: React.CSSProperties = {
      width: '100%', padding: '9px 12px', fontSize: '14px', borderRadius: '10px',
      border: '1.5px solid #e5e7eb', background: '#f9fafb', color: '#111827',
      outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms ease',
    };
    return (
      <div
        style={{
          height: '100svh',
          overflowY: 'auto',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', color: '#6b7280', textDecoration: 'none',
              marginBottom: '10px',
            }}
          >
            <ArrowLeft size={13} />
            {t.backLink}
          </Link>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px', background: '#1a1a2e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <GraduationCap size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {t.title}
            </h1>
          </div>

          {/* Form card */}
          <div style={{
            background: '#ffffff', borderRadius: '18px', padding: '16px 20px',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          }}>

            {/* Subject */}
            <div style={{ marginBottom: '12px' }}>
              <label style={fieldLabel}>{t.labelSubject}</label>
              <input
                type="text"
                placeholder={t.placeholder}
                value={config.subject}
                onChange={(e) => setConfig(c => ({ ...c, subject: e.target.value }))}
                style={fieldInput}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#1a1a2e'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            </div>

            {/* Duration + Start time — côte à côte */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={fieldLabel}>{t.labelDuration}</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={config.durationHours}
                    onChange={(e) => setConfig(c => ({ ...c, durationHours: Number(e.target.value) }))}
                    style={{ ...fieldInput, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', padding: '9px 8px' }}
                  >
                    {Array.from({ length: 13 }, (_, i) => (
                      <option key={i} value={i}>{t.hour(i)}</option>
                    ))}
                  </select>
                  <select
                    value={config.durationMinutes}
                    onChange={(e) => setConfig(c => ({ ...c, durationMinutes: Number(e.target.value) }))}
                    style={{ ...fieldInput, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', padding: '9px 8px' }}
                  >
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{t.min(m)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={fieldLabel}>{t.labelStartTime}</label>
                <input
                  type="time"
                  step="1"
                  value={config.startTime}
                  onChange={(e) => setConfig(c => ({ ...c, startTime: e.target.value }))}
                  style={{ ...fieldInput, color: config.startTime ? '#111827' : '#9ca3af' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#1a1a2e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
                />
              </div>
            </div>

            {/* Toggles */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '10px',
              marginBottom: '14px', paddingTop: '10px', borderTop: '1px solid #f3f4f6',
            }}>
              <ToggleRow
                label={t.showSeconds}
                checked={config.showSeconds}
                onChange={(v) => setConfig(c => ({ ...c, showSeconds: v }))}
              />
              <ToggleRow
                label={t.showDate}
                checked={config.showDate}
                onChange={(v) => setConfig(c => ({ ...c, showDate: v }))}
              />
              <ToggleRow
                label={t.showEndTime}
                checked={config.showEndTime}
                onChange={(v) => setConfig(c => ({ ...c, showEndTime: v }))}
              />
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              style={{
                width: '100%', padding: '12px', fontSize: '15px', fontWeight: 600,
                borderRadius: '11px', background: '#1a1a2e', color: '#ffffff',
                border: 'none', cursor: 'pointer',
                transition: 'background 150ms ease, transform 100ms ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2d2d44'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a2e'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {t.startBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Clock display ── */
  const durationStr = formatDuration(config.durationHours, config.durationMinutes);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100svh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '40px 24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        userSelect: 'none',
      }}
    >
      {/* Subject */}
      {config.subject && (
        <p style={{
          fontSize: 'clamp(18px, 2.5vw, 26px)',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '6px',
          textAlign: 'center',
          letterSpacing: '0.01em',
        }}>
          {config.subject}
        </p>
      )}

      {/* Duration badge + end time */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        {durationStr && (
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            letterSpacing: '0.03em',
            marginBottom: config.showEndTime && endTime ? '6px' : 0,
          }}>
            {t.durationPrefix} {durationStr}
          </p>
        )}
        {config.showEndTime && endTime && (
          <p style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#374151',
            letterSpacing: '0.01em',
          }}>
            {t.endTimePrefix} {endTime}
          </p>
        )}
      </div>

      {/* Time */}
      <div style={{
        fontSize: 'clamp(56px, 14vw, 120px)',
        fontWeight: 300,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.03em',
        color: '#111827',
        lineHeight: 1,
        fontFamily: '"SF Mono", "Cascadia Code", "Fira Code", ui-monospace, monospace',
      }}>
        {formatTime(currentTime, config.showSeconds)}
      </div>

      {/* Date */}
      {config.showDate && (
        <p style={{
          marginTop: '20px',
          fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: '#9ca3af',
          textTransform: 'capitalize',
          letterSpacing: '0.01em',
        }}>
          {formatDate(currentTime, lang)}
        </p>
      )}

      {/* Bottom-right controls */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <button
          onClick={() => setIsStarted(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '50px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
        >
          <Pencil size={13} />
          {t.editBtn}
        </button>

        <button
          onClick={handleFullscreenToggle}
          title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
}
