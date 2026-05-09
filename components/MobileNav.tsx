'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings2, Maximize2, Minimize2, User,
  Clock, Timer, AlarmClock, Globe,
} from 'lucide-react';

interface MobileNavProps {
  language?: 'fr' | 'en';
  isFullscreen: boolean;
  onSettingsOpen: () => void;
  onFullscreenToggle: () => void;
}

const NAV_ITEMS = {
  fr: [
    { href: '/',        Icon: Clock,      label: 'Horloge'     },
    { href: '/chrono',  Icon: Timer,      label: 'Chrono'      },
    { href: '/minuteur',Icon: AlarmClock, label: 'Minuteur'    },
    { href: '/monde',   Icon: Globe,      label: 'Monde'       },
  ],
  en: [
    { href: '/',        Icon: Clock,      label: 'Clock'       },
    { href: '/chrono',  Icon: Timer,      label: 'Chrono'      },
    { href: '/minuteur',Icon: AlarmClock, label: 'Timer'       },
    { href: '/monde',   Icon: Globe,      label: 'World'       },
  ],
};

/* ─── Styles partagés ─────────────────────────────────────────── */

const BAR_BASE: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  height: '56px',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
  /* display géré par les classes Tailwind (flex + sm:hidden)
     pour que sm:hidden puisse l'écraser sans conflit de spécificité */
  justifyContent: 'space-around',
  alignItems: 'center',
  zIndex: 30,
};

function iconBtnStyle(active: boolean): React.CSSProperties {
  return {
    width: '40px',
    height: '40px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: active ? 'var(--glass-bg-accent)' : 'var(--glass-bg)',
    border: `1px solid ${active ? 'var(--glass-border-accent)' : 'var(--glass-border)'}`,
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    color: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.80)',
    textDecoration: 'none',
    flexShrink: 0,
  };
}

/* ─── Composant ───────────────────────────────────────────────── */

export default function MobileNav({
  language = 'fr',
  isFullscreen,
  onSettingsOpen,
  onFullscreenToggle,
}: MobileNavProps) {
  const pathname = usePathname();
  const items    = NAV_ITEMS[language];

  const [accountHref, setAccountHref] = useState('/connexion');
  useEffect(() => {
    let unsub: (() => void) | null = null;
    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => {
        setAccountHref(user ? '/compte' : '/connexion');
      });
    }).catch(() => {});
    return () => { unsub?.(); };
  }, []);

  return (
    <>
      {/* ── Barre 1 — Actions (Settings | Fullscreen | Account) ── */}
      <div className="sm:hidden flex" style={{ ...BAR_BASE, bottom: '56px' }}>
        <button
          onClick={onSettingsOpen}
          style={iconBtnStyle(false)}
          title={language === 'fr' ? 'Paramètres' : 'Settings'}
        >
          <Settings2 size={20} strokeWidth={1.5} />
        </button>

        <button
          onClick={onFullscreenToggle}
          style={iconBtnStyle(isFullscreen)}
          title={language === 'fr' ? 'Plein écran' : 'Fullscreen'}
        >
          {isFullscreen
            ? <Minimize2 size={20} strokeWidth={1.5} />
            : <Maximize2 size={20} strokeWidth={1.5} />}
        </button>

        <Link
          href={accountHref}
          style={iconBtnStyle(pathname === '/compte' || pathname === '/connexion')}
          title={language === 'fr' ? 'Mon compte' : 'My account'}
        >
          <User size={20} strokeWidth={1.5} />
        </Link>
      </div>

      {/* ── Barre 2 — Navigation (Horloge | Chronomètre | Minuteur) ── */}
      <nav className="sm:hidden flex" style={{ ...BAR_BASE, bottom: 0 }}>
        {items.map(({ href, Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                textDecoration: 'none',
                background: isActive ? 'var(--glass-bg-accent)' : 'transparent',
                transition: 'background 150ms ease',
              }}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                color={isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.55)'}
              />
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  color: isActive
                    ? 'var(--color-accent-subtle)'
                    : 'rgba(255,255,255,0.55)',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
