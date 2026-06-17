'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Settings2, Maximize2, User, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import MobileNav from '@/components/MobileNav';
import { useSettings } from '@/lib/useSettings';

const Sidebar      = dynamic(() => import('@/components/Sidebar'),       { ssr: false, loading: () => null });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });

/* ═══════════════════════════════════════════════════════════════
   Données statiques
═══════════════════════════════════════════════════════════════ */

const DEFAULT_ZONES = [
  { tz: 'Europe/Paris',        name: { fr: 'Paris',       en: 'Paris'       } },
  { tz: 'America/New_York',    name: { fr: 'New York',    en: 'New York'    } },
  { tz: 'Asia/Tokyo',          name: { fr: 'Tokyo',       en: 'Tokyo'       } },
  { tz: 'Europe/London',       name: { fr: 'Londres',     en: 'London'      } },
  { tz: 'Asia/Dubai',          name: { fr: 'Dubaï',       en: 'Dubai'       } },
  { tz: 'America/Los_Angeles', name: { fr: 'Los Angeles', en: 'Los Angeles' } },
] as const;

const DEFAULT_TZS = DEFAULT_ZONES.map(z => z.tz);

const PRESET_CITIES: Array<{ tz: string; name: { fr: string; en: string } }> = [
  { tz: 'Europe/Paris',                   name: { fr: 'Paris',        en: 'Paris'        } },
  { tz: 'America/New_York',               name: { fr: 'New York',     en: 'New York'     } },
  { tz: 'Asia/Tokyo',                     name: { fr: 'Tokyo',        en: 'Tokyo'        } },
  { tz: 'Europe/London',                  name: { fr: 'Londres',      en: 'London'       } },
  { tz: 'Asia/Dubai',                     name: { fr: 'Dubaï',        en: 'Dubai'        } },
  { tz: 'America/Los_Angeles',            name: { fr: 'Los Angeles',  en: 'Los Angeles'  } },
  { tz: 'Asia/Shanghai',                  name: { fr: 'Shanghai',     en: 'Shanghai'     } },
  { tz: 'Asia/Singapore',                 name: { fr: 'Singapour',    en: 'Singapore'    } },
  { tz: 'Asia/Seoul',                     name: { fr: 'Séoul',        en: 'Seoul'        } },
  { tz: 'Asia/Kolkata',                   name: { fr: 'Mumbai',       en: 'Mumbai'       } },
  { tz: 'Europe/Berlin',                  name: { fr: 'Berlin',       en: 'Berlin'       } },
  { tz: 'Europe/Madrid',                  name: { fr: 'Madrid',       en: 'Madrid'       } },
  { tz: 'Europe/Rome',                    name: { fr: 'Rome',         en: 'Rome'         } },
  { tz: 'Europe/Amsterdam',               name: { fr: 'Amsterdam',    en: 'Amsterdam'    } },
  { tz: 'Europe/Zurich',                  name: { fr: 'Zurich',       en: 'Zurich'       } },
  { tz: 'Europe/Moscow',                  name: { fr: 'Moscou',       en: 'Moscow'       } },
  { tz: 'America/Chicago',                name: { fr: 'Chicago',      en: 'Chicago'      } },
  { tz: 'America/Denver',                 name: { fr: 'Denver',       en: 'Denver'       } },
  { tz: 'America/Toronto',                name: { fr: 'Toronto',      en: 'Toronto'      } },
  { tz: 'America/Vancouver',              name: { fr: 'Vancouver',    en: 'Vancouver'    } },
  { tz: 'America/Sao_Paulo',              name: { fr: 'São Paulo',    en: 'São Paulo'    } },
  { tz: 'America/Argentina/Buenos_Aires', name: { fr: 'Buenos Aires', en: 'Buenos Aires' } },
  { tz: 'America/Mexico_City',            name: { fr: 'Mexico',       en: 'Mexico City'  } },
  { tz: 'Africa/Cairo',                   name: { fr: 'Le Caire',     en: 'Cairo'        } },
  { tz: 'Africa/Johannesburg',            name: { fr: 'Johannesburg', en: 'Johannesburg' } },
  { tz: 'Africa/Lagos',                   name: { fr: 'Lagos',        en: 'Lagos'        } },
  { tz: 'Australia/Sydney',               name: { fr: 'Sydney',       en: 'Sydney'       } },
  { tz: 'Pacific/Auckland',               name: { fr: 'Auckland',     en: 'Auckland'     } },
  { tz: 'Asia/Bangkok',                   name: { fr: 'Bangkok',      en: 'Bangkok'      } },
  { tz: 'Asia/Jakarta',                   name: { fr: 'Jakarta',      en: 'Jakarta'      } },
];

/* ═══════════════════════════════════════════════════════════════
   Helpers temps
═══════════════════════════════════════════════════════════════ */

function formatTime(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone:  tz,
    hourCycle: 'h23',
    hour:      '2-digit',
    minute:    '2-digit',
    second:    '2-digit',
  }).format(date);
}

function formatDate(date: Date, tz: string, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
    timeZone: tz,
    weekday:  'short',
    day:      'numeric',
    month:    'short',
  }).format(date);
}

function getUTCOffsetHours(date: Date, tz: string): number {
  const utcMs = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();
  const tzMs  = new Date(date.toLocaleString('en-US', { timeZone: tz   })).getTime();
  return (tzMs - utcMs) / 3_600_000;
}

function getOffsetFromParis(date: Date, tz: string): string {
  const parisDiff = getUTCOffsetHours(date, 'Europe/Paris');
  const tzDiff    = getUTCOffsetHours(date, tz);
  const diff      = tzDiff - parisDiff;
  if (Math.abs(diff) < 0.01) return '';
  const sign    = diff > 0 ? '+' : '-';
  const absDiff = Math.abs(diff);
  const h       = Math.floor(absDiff);
  const m       = Math.round((absDiff - h) * 60);
  return m === 0 ? `${sign}${h}h` : `${sign}${h}h${String(m).padStart(2, '0')}`;
}

function tzDisplayName(tz: string, language: 'fr' | 'en'): string {
  const found = PRESET_CITIES.find(c => c.tz === tz);
  if (found) return found.name[language];
  return tz.split('/').pop()?.replace(/_/g, ' ') ?? tz;
}

/* ═══════════════════════════════════════════════════════════════
   Composant carte horloge
═══════════════════════════════════════════════════════════════ */
function ClockCard({
  tz, now, language, isCustom, onRemove,
}: {
  tz: string;
  now: Date;
  language: 'fr' | 'en';
  isCustom: boolean;
  onRemove?: () => void;
}) {
  const time   = formatTime(now, tz);
  const date   = formatDate(now, tz, language);
  const offset = getOffsetFromParis(now, tz);
  const name   = tzDisplayName(tz, language);

  return (
    <div
      style={{
        position:             'relative',
        overflow:             'hidden',
        background:           'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
        backdropFilter:       'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border:               '1px solid rgba(255,255,255,0.28)',
        borderRadius:         '20px',
        boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.50), 0 6px 18px rgba(0,0,0,0.22)',
        padding:              '20px 24px',
        transition:           'box-shadow 200ms ease, border-color 200ms ease',
        cursor:               'default',
        userSelect:           'none',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(255,255,255,0.40)';
        el.style.boxShadow   = 'inset 0 1px 1px rgba(255,255,255,0.60), 0 10px 28px rgba(0,0,0,0.28)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(255,255,255,0.28)';
        el.style.boxShadow   = 'inset 0 1px 1px rgba(255,255,255,0.50), 0 6px 18px rgba(0,0,0,0.22)';
      }}
    >
      {/* Bouton supprimer (villes perso uniquement) */}
      {isCustom && (
        <button
          onClick={onRemove}
          style={{
            position:   'absolute',
            top:        '12px',
            right:      '14px',
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      'rgba(255,255,255,0.30)',
            padding:    '2px',
            display:    'flex',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; }}
          title="Supprimer"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      )}

      {/* Nom de la ville */}
      <div style={{
        fontSize:      '13px',
        fontWeight:    500,
        color:         'rgba(255,255,255,0.60)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom:  '6px',
      }}>
        {name}
      </div>

      {/* Heure HH:MM:SS */}
      <div style={{
        fontSize:           '40px',
        fontWeight:         300,
        color:              '#FFFFFF',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing:      '0.05em',
        fontFamily:         'var(--clock-font-family)',
        lineHeight:         1,
        marginBottom:       '6px',
      }}>
        {time}
      </div>

      {/* Date courte */}
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', marginBottom: '2px' }}>
        {date}
      </div>

      {/* Décalage vs Paris */}
      {offset && (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)' }}>
          {offset}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Carte "Ajouter"
═══════════════════════════════════════════════════════════════ */
function AddCityCard({ onClick, language }: { onClick: () => void; language: 'fr' | 'en' }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:           'rgba(255,255,255,0.06)',
        backdropFilter:       'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border:               '1px dashed rgba(255,255,255,0.28)',
        borderRadius:         '20px',
        boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.20)',
        padding:              '20px 24px',
        minHeight:            '130px',
        display:              'flex',
        flexDirection:        'column',
        alignItems:           'center',
        justifyContent:       'center',
        gap:                  '8px',
        cursor:               'pointer',
        transition:           'background 200ms ease, border-color 200ms ease',
        width:                '100%',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background  = 'rgba(255,255,255,0.12)';
        el.style.borderColor = 'rgba(255,255,255,0.42)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background  = 'rgba(255,255,255,0.06)';
        el.style.borderColor = 'rgba(255,255,255,0.28)';
      }}
    >
      <span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>+</span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
        {language === 'fr' ? 'Ajouter une ville' : 'Add a city'}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Modale ajout de ville
═══════════════════════════════════════════════════════════════ */
function AddCityModal({
  language,
  availableCities,
  onAdd,
  onClose,
}: {
  language: 'fr' | 'en';
  availableCities: Array<{ tz: string; name: { fr: string; en: string } }>;
  onAdd: (tz: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(availableCities[0]?.tz ?? '');

  return (
    <div
      style={{
        position:             'fixed',
        inset:                0,
        zIndex:               60,
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        background:           'rgba(0,0,0,0.50)',
        backdropFilter:       'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background:           'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
          backdropFilter:       'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border:               '1px solid rgba(255,255,255,0.18)',
          boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.22), 0 24px 56px rgba(0,0,0,0.45)',
          borderRadius:         '24px',
          padding:              '24px',
          width:                '340px',
          maxWidth:             '90vw',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.90)', marginBottom: '16px' }}>
          {language === 'fr' ? 'Ajouter une ville' : 'Add a city'}
        </p>

        {/* Liste des villes — bulles glass v2 */}
        <div
          style={{
            display:              'flex',
            flexWrap:             'wrap',
            gap:                  '8px',
            maxHeight:            '240px',
            overflowY:            'auto',
            marginBottom:         '20px',
            padding:              '2px',
          }}
        >
          {availableCities.map((city) => {
            const isSelected = city.tz === selected;
            return (
              <button
                key={city.tz}
                onClick={() => setSelected(city.tz)}
                style={{
                  borderRadius:         '50px',
                  padding:              '7px 16px',
                  fontSize:             '13px',
                  fontWeight:           isSelected ? 500 : 400,
                  cursor:               'pointer',
                  backdropFilter:       'blur(14px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                  border:               `1px solid ${isSelected ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.14)'}`,
                  background:           isSelected
                    ? 'linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10))'
                    : 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
                  boxShadow:            isSelected
                    ? 'inset 0 1px 1px rgba(255,255,255,0.60), 0 4px 14px rgba(0,0,0,0.28)'
                    : 'inset 0 1px 1px rgba(255,255,255,0.14)',
                  color:                isSelected ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.65)',
                  transition:           'transform 0.22s cubic-bezier(.2,.9,.3,1.4), background 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
                  whiteSpace:           'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                  if (!isSelected) {
                    e.currentTarget.style.background   = 'linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))';
                    e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.24)';
                    e.currentTarget.style.color        = 'rgba(255,255,255,0.85)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  if (!isSelected) {
                    e.currentTarget.style.background   = 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))';
                    e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.14)';
                    e.currentTarget.style.color        = 'rgba(255,255,255,0.65)';
                  }
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
                onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)'; }}
              >
                {city.name[language]}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {/* Annuler */}
          <button
            onClick={onClose}
            style={{
              borderRadius:         '50px',
              padding:              '9px 18px',
              fontSize:             '14px',
              fontWeight:           400,
              cursor:               'pointer',
              backdropFilter:       'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              border:               '1px solid rgba(255,255,255,0.15)',
              background:           'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
              color:                'rgba(255,255,255,0.75)',
              transition:           'background 180ms ease, border-color 180ms ease, transform 0.22s cubic-bezier(.2,.9,.3,1.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform   = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform   = 'scale(1)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
            onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          >
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>

          {/* Ajouter */}
          <button
            onClick={() => { if (selected) onAdd(selected); }}
            disabled={!selected}
            style={{
              borderRadius:         '50px',
              padding:              '9px 18px',
              fontSize:             '14px',
              fontWeight:           500,
              cursor:               selected ? 'pointer' : 'not-allowed',
              backdropFilter:       'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              border:               '1px solid rgba(255,255,255,0.40)',
              background:           'linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10))',
              color:                'rgba(255,255,255,0.97)',
              boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.55), 0 4px 14px rgba(0,0,0,0.22)',
              transition:           'background 200ms ease, border-color 200ms ease, transform 0.28s cubic-bezier(.2,.9,.3,1.5)',
            }}
            onMouseEnter={(e) => {
              if (!selected) return;
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.36), rgba(255,255,255,0.16))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
              e.currentTarget.style.transform   = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10))';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)';
              e.currentTarget.style.transform   = 'scale(1)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
            onMouseUp={(e)   => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          >
            {language === 'fr' ? 'Ajouter' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Bouton icône bas desktop
═══════════════════════════════════════════════════════════════ */
function IconButton({
  children, onClick, href, title, disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  href?: string;
  title?: string;
  disabled?: boolean;
}) {
  const style: React.CSSProperties = {
    position:             'relative',
    overflow:             'hidden',
    width:                '52px',
    height:               '52px',
    borderRadius:         '50%',
    display:              'flex',
    alignItems:           'center',
    justifyContent:       'center',
    cursor:               disabled ? 'not-allowed' : 'pointer',
    background:           'rgba(255,255,255,0.13)',
    backdropFilter:       'blur(14px) saturate(160%)',
    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
    border:               '1px solid rgba(255,255,255,0.34)',
    boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -8px 16px rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.32)',
    color:                'rgba(255,255,255,0.90)',
    transition:           'transform 0.28s cubic-bezier(.2,.9,.3,1.5)',
    textDecoration:       'none',
    flexShrink:           0,
    opacity:              disabled ? 0.4 : 1,
  };
  if (href) return <Link href={href} style={style} title={title}>{children}</Link>;
  return (
    <button
      onClick={onClick}
      style={style}
      title={title}
      disabled={disabled}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
      onMouseDown={(e)  => { if (!disabled) e.currentTarget.style.transform = 'scale(0.9)'; }}
      onMouseUp={(e)    => { if (!disabled) e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Composant principal
═══════════════════════════════════════════════════════════════ */
export default function MondePageClient() {
  const {
    settings, updateFont, updateFontSize, updateTextColor, updateBackground,
    updateFormat, updateMirror, updateShowDate, updateShowSeconds, updateLanguage,
  } = useSettings();

  const language = settings.language;

  /* ── Temps ── */
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── UI ── */
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  /* ── Auth + fuseaux perso ── */
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [accountHref,  setAccountHref]  = useState('/connexion');
  const [customZones,  setCustomZones]  = useState<string[]>([]);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    import('@/lib/firebase').then(async ({ auth, onAuthStateChanged, getDb }) => {
      const { doc, getDoc } = await import('firebase/firestore');

      unsub = onAuthStateChanged(auth, async (user) => {
        setIsLoggedIn(!!user);
        setAccountHref(user ? '/compte' : '/connexion');

        if (user) {
          try {
            const db   = await getDb();
            const ref  = doc(db, 'users', user.uid, 'worldClock', 'main');
            const snap = await getDoc(ref);
            if (snap.exists()) {
              const zones = snap.data().zones;
              if (Array.isArray(zones)) setCustomZones(zones as string[]);
            }
          } catch { /* silencieux */ }
        } else {
          setCustomZones([]);
        }
      });
    }).catch(() => {});

    return () => { unsub?.(); };
  }, []);

  /* ── Ajouter une ville ── */
  const handleAddZone = async (tz: string) => {
    const newZones = [...customZones, tz];
    setCustomZones(newZones);
    setAddModalOpen(false);
    try {
      const { auth, getDb } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const user = auth.currentUser;
      if (!user) return;
      const db = await getDb();
      await setDoc(doc(db, 'users', user.uid, 'worldClock', 'main'), { zones: newZones }, { merge: true });
    } catch (e) { console.error('[MondePageClient] addZone:', e); }
  };

  /* ── Supprimer une ville ── */
  const handleRemoveZone = async (tz: string) => {
    const newZones = customZones.filter(z => z !== tz);
    setCustomZones(newZones);
    try {
      const { auth, getDb } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const user = auth.currentUser;
      if (!user) return;
      const db = await getDb();
      await setDoc(doc(db, 'users', user.uid, 'worldClock', 'main'), { zones: newZones }, { merge: true });
    } catch (e) { console.error('[MondePageClient] removeZone:', e); }
  };

  /* ── Villes disponibles pour la modale ── */
  const allAddedTzs    = [...DEFAULT_TZS, ...customZones];
  const availableCities = PRESET_CITIES.filter(c => !allAddedTzs.includes(c.tz));
  const canAddMore      = isLoggedIn && customZones.length < 6 && availableCities.length > 0;

  return (
    <div className="relative overflow-hidden" style={{ height: '100svh', minHeight: '100vh' }}>

      {/* ── Hamburger desktop ── */}
      <button
        className="hidden sm:flex"
        onClick={() => setSidebarOpen(true)}
        style={{
          position:             'absolute',
          top:                  '24px',
          left:                 '24px',
          zIndex:               50,
          width:                '44px',
          height:               '44px',
          borderRadius:         '50%',
          background:           'rgba(255,255,255,0.13)',
          backdropFilter:       'blur(14px) saturate(160%)',
          WebkitBackdropFilter: 'blur(14px) saturate(160%)',
          border:               '1px solid rgba(255,255,255,0.30)',
          boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.28)',
          alignItems:           'center',
          justifyContent:       'center',
          cursor:               'pointer',
          color:                'rgba(255,255,255,0.85)',
          transition:           'transform 0.28s cubic-bezier(.2,.9,.3,1.5), background 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.20)';
          e.currentTarget.style.transform  = 'translateY(-2px) scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
          e.currentTarget.style.transform  = 'scale(1)';
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
        onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="Menu"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {/* ── Contenu scrollable ── */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', zIndex: 10 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px 140px' }}>

          {/* Grille d'horloges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] sm:gap-[12px] lg:gap-[16px]">

            {/* Fuseaux par défaut */}
            {DEFAULT_ZONES.map(({ tz }) => (
              <ClockCard
                key={tz}
                tz={tz}
                now={now}
                language={language}
                isCustom={false}
              />
            ))}

            {/* Fuseaux personnalisés */}
            {customZones.map(tz => (
              <ClockCard
                key={tz}
                tz={tz}
                now={now}
                language={language}
                isCustom
                onRemove={() => handleRemoveZone(tz)}
              />
            ))}

            {/* Carte "+" */}
            {canAddMore && (
              <AddCityCard onClick={() => setAddModalOpen(true)} language={language} />
            )}
          </div>

          {/* Message non connecté */}
          {!isLoggedIn && (
            <p style={{
              marginTop:  '24px',
              textAlign:  'center',
              fontSize:   '13px',
              color:      'rgba(255,255,255,0.35)',
              fontWeight: 400,
            }}>
              {language === 'fr'
                ? "Connectez-vous pour ajouter jusqu’à 6 villes supplémentaires"
                : 'Sign in to add up to 6 more cities'}
            </p>
          )}
        </div>
      </div>

      {/* ── 3 icônes bas centre — desktop ── */}
      <div
        className="hidden sm:flex"
        style={{
          position:  'absolute',
          bottom:    '32px',
          left:      '50%',
          transform: 'translateX(-50%)',
          gap:       '12px',
          zIndex:    30,
        }}
      >
        <IconButton
          onClick={() => setSettingsOpen(true)}
          title={language === 'fr' ? 'Paramètres' : 'Settings'}
        >
          <Settings2 size={20} strokeWidth={1.5} />
        </IconButton>
        <IconButton disabled title={language === 'fr' ? 'Non disponible' : 'Not available'}>
          <Maximize2 size={20} strokeWidth={1.5} />
        </IconButton>
        <IconButton href={accountHref} title={language === 'fr' ? 'Mon compte' : 'My account'}>
          <User size={20} strokeWidth={1.5} />
        </IconButton>
      </div>

      {/* ── Liens footer bas gauche — desktop ── */}
      <div
        className="hidden sm:flex"
        style={{ position: 'absolute', bottom: '28px', left: '24px', zIndex: 30, gap: '16px' }}
      >
        {[
          { href: '/cgu',              label: 'CGU'              },
          { href: '/mentions-legales', label: 'Mentions légales' },
          { href: '/confidentialite',  label: 'Confidentialité'  },
        ].map(({ href, label }) => (
          <Link
            key={href} href={href}
            style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.40)', textDecoration: 'none', transition: 'color 150ms ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.70)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)'; }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* ── Navigation mobile ── */}
      <MobileNav
        language={language}
        isFullscreen={false}
        onSettingsOpen={() => setSettingsOpen(true)}
        onFullscreenToggle={() => {}}
      />

      {/* ── Sidebar ── */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} language={language} />

      {/* ── Panneau paramètres ── */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        updateFont={updateFont}
        updateFontSize={updateFontSize}
        updateTextColor={updateTextColor}
        updateBackground={updateBackground}
        updateFormat={updateFormat}
        updateMirror={updateMirror}
        updateShowDate={updateShowDate}
        updateShowSeconds={updateShowSeconds}
        updateLanguage={updateLanguage}
      />

      {/* ── Modale ajout ville ── */}
      {addModalOpen && (
        <AddCityModal
          language={language}
          availableCities={availableCities}
          onAdd={handleAddZone}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
}
