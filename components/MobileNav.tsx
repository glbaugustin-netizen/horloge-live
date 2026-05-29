'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Clock, Timer, AlarmClock, Globe, GraduationCap } from 'lucide-react';
import BottomBar from '@/components/BottomBar';

interface MobileNavProps {
  language?: 'fr' | 'en';
  isFullscreen: boolean;
  onSettingsOpen: () => void;
  onFullscreenToggle: () => void;
}

const NAV_ITEMS = {
  fr: [
    { href: '/',        Icon: Clock,          label: 'Horloge'  },
    { href: '/chrono',  Icon: Timer,          label: 'Chrono'   },
    { href: '/minuteur',Icon: AlarmClock,     label: 'Minuteur' },
    { href: '/monde',   Icon: Globe,          label: 'Monde'    },
    { href: '/examen',  Icon: GraduationCap,  label: 'Examen'   },
  ],
  en: [
    { href: '/',        Icon: Clock,          label: 'Clock'    },
    { href: '/chrono',  Icon: Timer,          label: 'Chrono'   },
    { href: '/minuteur',Icon: AlarmClock,     label: 'Timer'    },
    { href: '/monde',   Icon: Globe,          label: 'World'    },
    { href: '/examen',  Icon: GraduationCap,  label: 'Exam'     },
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

/* ─── Composant ───────────────────────────────────────────────── */

export default function MobileNav({
  language = 'fr',
  isFullscreen,
  onSettingsOpen,
  onFullscreenToggle,
}: MobileNavProps) {
  const pathname = usePathname();
  const router   = useRouter();
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
        <BottomBar
          onSettingsClick={onSettingsOpen}
          onAccountClick={() => router.push(accountHref)}
          isFullscreen={isFullscreen}
          onFullscreenToggle={onFullscreenToggle}
          isAuthenticated={accountHref === '/compte'}
          language={language}
        />
      </div>

      {/* ── Barre 2 — Navigation (Horloge | Chrono | Minuteur | Monde | Examen) ── */}
      <nav className="sm:hidden flex" style={{ ...BAR_BASE, bottom: 0, overflowX: 'auto', justifyContent: 'flex-start' }}>
        {items.map(({ href, Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: '0 0 20%',
                minWidth: '64px',
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
