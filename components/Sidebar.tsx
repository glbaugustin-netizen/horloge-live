'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Timer, AlarmClock, Globe, X, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'fr' | 'en';
}

const NAV_ITEMS = {
  fr: [
    { href: '/',        Icon: Clock,      label: 'Horloge'     },
    { href: '/chrono',  Icon: Timer,      label: 'Chronomètre' },
    { href: '/minuteur',Icon: AlarmClock, label: 'Minuteur'    },
    { href: '/monde',   Icon: Globe,      label: 'Monde'       },
  ],
  en: [
    { href: '/',        Icon: Clock,      label: 'Clock'       },
    { href: '/chrono',  Icon: Timer,      label: 'Stopwatch'   },
    { href: '/minuteur',Icon: AlarmClock, label: 'Timer'       },
    { href: '/monde',   Icon: Globe,      label: 'World'       },
  ],
};

export default function Sidebar({ isOpen, onClose, language = 'fr' }: SidebarProps) {
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
      {/* ── Overlay — clic ferme la sidebar ── */}
      <div
        className="hidden sm:block"
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.20)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 35,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 200ms ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* ── Panneau sidebar ── */}
      <aside
        className="hidden sm:flex"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '240px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '24px 16px',
          zIndex: 50,
          flexDirection: 'column',
          gap: '6px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: isOpen
            ? 'transform 300ms ease-out'
            : 'transform 250ms ease-in',
        }}
      >
        {/* Bouton fermeture (X) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.50)',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.80)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.50)';
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items navigation pill */}
        {items.map(({ href, Icon, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                borderRadius: '50px',
                padding: '10px 16px',
                fontSize: '15px',
                fontWeight: 400,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'background 150ms ease, color 150ms ease',
                background: isActive
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(255,255,255,0.20)' : 'transparent'}`,
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
              }}
              onMouseEnter={(e) => {
                if (isActive) return;
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(255,255,255,0.08)';
                el.style.color = 'rgba(255,255,255,0.80)';
              }}
              onMouseLeave={(e) => {
                if (isActive) return;
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(255,255,255,0.04)';
                el.style.color = 'rgba(255,255,255,0.55)';
              }}
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                color={isActive ? '#4FC3F7' : 'rgba(255,255,255,0.55)'}
              />
              {label}
            </Link>
          );
        })}

        {/* Lien Mon compte — poussé en bas */}
        {(() => {
          const accountLabel  = language === 'fr' ? 'Mon compte' : 'My account';
          const isAccountActive = pathname === '/compte' || pathname === '/connexion';
          return (
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              <Link
                href={accountHref}
                onClick={onClose}
                style={{
                  borderRadius: '50px',
                  padding: '10px 16px',
                  fontSize: '15px',
                  fontWeight: 400,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'background 150ms ease, color 150ms ease',
                  background: isAccountActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isAccountActive ? 'rgba(255,255,255,0.20)' : 'transparent'}`,
                  color: isAccountActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={(e) => {
                  if (isAccountActive) return;
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.08)';
                  el.style.color = 'rgba(255,255,255,0.80)';
                }}
                onMouseLeave={(e) => {
                  if (isAccountActive) return;
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                <User size={16} strokeWidth={1.5} color={isAccountActive ? '#4FC3F7' : 'rgba(255,255,255,0.55)'} />
                {accountLabel}
              </Link>
            </div>
          );
        })()}
      </aside>
    </>
  );
}
