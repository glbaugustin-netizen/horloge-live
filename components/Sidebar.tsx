'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Timer, AlarmClock, Globe, GraduationCap, Clock3, Menu, X, User } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;      // contrôle externe (desktop) — optionnel
  onClose?: () => void;  // callback externe fermeture — optionnel
  language?: 'fr' | 'en';
}

const NAV_ITEMS = {
  fr: [
    { href: '/',                  Icon: Clock,          label: 'Horloge'            },
    { href: '/chrono',            Icon: Timer,          label: 'Chronomètre'        },
    { href: '/minuteur',          Icon: AlarmClock,     label: 'Minuteur'           },
    { href: '/monde',             Icon: Globe,          label: 'Monde'              },
    { href: '/examen',            Icon: GraduationCap,  label: 'Mode Examen'        },
    { href: '/horloge-aiguille',  Icon: Clock3,         label: 'Horloge analogique' },
  ],
  en: [
    { href: '/',                  Icon: Clock,          label: 'Clock'              },
    { href: '/chrono',            Icon: Timer,          label: 'Stopwatch'          },
    { href: '/minuteur',          Icon: AlarmClock,     label: 'Timer'              },
    { href: '/monde',             Icon: Globe,          label: 'World'              },
    { href: '/examen',            Icon: GraduationCap,  label: 'Exam Mode'          },
    { href: '/horloge-aiguille',  Icon: Clock3,         label: 'Analog Clock'       },
  ],
};

/* ─────────────────────────────────────────────────────────────
   Composant Sidebar
   — Desktop : contrôlé par le page client via isOpen / onClose
   — Mobile  : auto-contrôlé via état interne + bouton hamburger
───────────────────────────────────────────────────────────── */

export default function Sidebar({ isOpen: externalOpen, onClose, language = 'fr' }: SidebarProps) {
  const pathname    = usePathname();
  const items       = NAV_ITEMS[language];

  /* ── États ─────────────────────────────────────────────────── */
  const [open,     setOpen]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [accountHref, setAccountHref] = useState('/connexion');

  /* Sync état externe (desktop) → état interne */
  useEffect(() => {
    if (externalOpen !== undefined) setOpen(externalOpen);
  }, [externalOpen]);

  /* Détection mobile pour largeur responsive */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Firebase auth */
  useEffect(() => {
    let unsub: (() => void) | null = null;
    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => {
        setAccountHref(user ? '/compte' : '/connexion');
      });
    }).catch(() => {});
    return () => { unsub?.(); };
  }, []);

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  /* ─────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Bouton hamburger — visible sur mobile uniquement ── */}
      <button
        className="sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 50,
          width: '40px',
          height: '40px',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.80)',
        }}
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {/* ── Overlay — clic ferme la sidebar ── */}
      <div
        aria-hidden="true"
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.20)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 35,
          opacity: open ? 1 : 0,
          transition: 'opacity 200ms ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* ── Panneau sidebar ── */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          /* Mobile : plein écran, Desktop : 240px */
          width: isMobile ? '100%' : '240px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          /* Mobile : pas de border-right */
          borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
          padding: '24px 16px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: open
            ? 'transform 300ms ease-out'
            : 'transform 250ms ease-in',
        }}
      >
        {/* Bouton fermeture (X) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            onClick={handleClose}
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
              onClick={handleClose}
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
          const accountLabel   = language === 'fr' ? 'Mon compte' : 'My account';
          const isAccountActive = pathname === '/compte' || pathname === '/connexion';
          return (
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              <Link
                href={accountHref}
                onClick={handleClose}
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
