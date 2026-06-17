'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Timer, AlarmClock, Globe, GraduationCap, Clock3, Menu, X, User } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
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

export default function Sidebar({ isOpen: externalOpen, onClose, language = 'fr' }: SidebarProps) {
  const pathname = usePathname();
  const items    = NAV_ITEMS[language];

  const [open,        setOpen]        = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const [accountHref, setAccountHref] = useState('/connexion');

  useEffect(() => {
    if (externalOpen !== undefined) setOpen(externalOpen);
  }, [externalOpen]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    import('@/lib/firebase').then(({ auth, onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, (user) => {
        setAccountHref(user ? '/compte' : '/connexion');
      });
    }).catch(() => {});
    return () => { unsub?.(); };
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  /* ── Styles partagés ── */
  const navItemBase: React.CSSProperties = {
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: 400,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    backdropFilter: 'blur(14px) saturate(160%)',
    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
    transition: 'transform 0.22s cubic-bezier(.2,.9,.3,1.4), background 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
  };

  const navItemActive: React.CSSProperties = {
    ...navItemBase,
    background: 'linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))',
    border: '1px solid rgba(255,255,255,0.38)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.50), 0 4px 14px rgba(0,0,0,0.22)',
    color: 'rgba(255,255,255,0.97)',
  };

  const navItemInactive: React.CSSProperties = {
    ...navItemBase,
    background: 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
    border: '1px solid rgba(255,255,255,0.14)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.18)',
    color: 'rgba(255,255,255,0.55)',
  };

  return (
    <>
      {/* ── Bouton hamburger — mobile uniquement ── */}
      <button
        className="flex sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 50,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.13)',
          backdropFilter: 'blur(14px) saturate(160%)',
          WebkitBackdropFilter: 'blur(14px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.30)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.28)',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.85)',
          transition: 'transform 0.28s cubic-bezier(.2,.9,.3,1.5), background 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.20)';
          e.currentTarget.style.transform  = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
          e.currentTarget.style.transform  = 'scale(1)';
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
        onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {/* ── Overlay ── */}
      <div
        aria-hidden="true"
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
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
          width: isMobile ? '100%' : '240px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.14)',
          boxShadow: '8px 0 40px rgba(0,0,0,0.30)',
          padding: '24px 14px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: open
            ? 'transform 340ms cubic-bezier(.2,.9,.3,1.2)'
            : 'transform 250ms ease-in',
          overflow: 'hidden',
        }}
      >
        {/* Gloss haut du panneau */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.09), transparent)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Bouton fermeture (X) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
          <button
            onClick={handleClose}
            aria-label="Fermer le menu"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.50)',
              transition: 'color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color      = 'rgba(255,255,255,0.85)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color      = 'rgba(255,255,255,0.50)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items navigation */}
        <nav aria-label="Navigation principale" style={{ position: 'relative', zIndex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {items.map(({ href, Icon, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={handleClose}
                    style={isActive ? navItemActive : navItemInactive}
                    aria-current={isActive ? 'page' : undefined}
                    onMouseEnter={(e) => {
                      if (isActive) return;
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))';
                      el.style.borderColor = 'rgba(255,255,255,0.26)';
                      el.style.color       = 'rgba(255,255,255,0.85)';
                      el.style.transform   = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      if (isActive) return;
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))';
                      el.style.borderColor = 'rgba(255,255,255,0.14)';
                      el.style.color       = 'rgba(255,255,255,0.55)';
                      el.style.transform   = 'translateX(0)';
                    }}
                    onMouseDown={(e) => { if (!isActive) e.currentTarget.style.transform = 'translateX(1px) scale(0.98)'; }}
                    onMouseUp={(e)   => { if (!isActive) e.currentTarget.style.transform = 'translateX(3px)'; }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      color={isActive ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.45)'}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Lien Mon compte — poussé en bas */}
        {(() => {
          const accountLabel    = language === 'fr' ? 'Mon compte' : 'My account';
          const isAccountActive = pathname === '/compte' || pathname === '/connexion';
          return (
            <nav aria-label="Compte" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.10)', position: 'relative', zIndex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                  <Link
                    href={accountHref}
                    onClick={handleClose}
                    style={isAccountActive ? navItemActive : navItemInactive}
                    aria-current={isAccountActive ? 'page' : undefined}
                    onMouseEnter={(e) => {
                      if (isAccountActive) return;
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))';
                      el.style.borderColor = 'rgba(255,255,255,0.26)';
                      el.style.color       = 'rgba(255,255,255,0.85)';
                      el.style.transform   = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      if (isAccountActive) return;
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background  = 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))';
                      el.style.borderColor = 'rgba(255,255,255,0.14)';
                      el.style.color       = 'rgba(255,255,255,0.55)';
                      el.style.transform   = 'translateX(0)';
                    }}
                    onMouseDown={(e) => { if (!isAccountActive) e.currentTarget.style.transform = 'translateX(1px) scale(0.98)'; }}
                    onMouseUp={(e)   => { if (!isAccountActive) e.currentTarget.style.transform = 'translateX(3px)'; }}
                  >
                    <User size={16} strokeWidth={1.5} color={isAccountActive ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.45)'} />
                    {accountLabel}
                  </Link>
                </li>
              </ul>
            </nav>
          );
        })()}
      </aside>
    </>
  );
}
