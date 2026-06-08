'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomBar from '@/components/BottomBar';

interface MobileNavProps {
  language?: 'fr' | 'en';
  isFullscreen: boolean;
  onSettingsOpen: () => void;
  onFullscreenToggle: () => void;
}

/* ─── Style barre fixe ──────────────────────────────────────── */

const BAR_STYLE: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '56px',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
  /* display géré par la classe Tailwind (flex + sm:hidden)
     pour que sm:hidden puisse l'écraser sans conflit de spécificité */
  justifyContent: 'space-around',
  alignItems: 'center',
  zIndex: 30,
};

/* ─── Composant ─────────────────────────────────────────────── */

export default function MobileNav({
  language = 'fr',
  isFullscreen,
  onSettingsOpen,
  onFullscreenToggle,
}: MobileNavProps) {
  const router = useRouter();
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

  // flex sm:hidden : display:flex sur mobile, display:none sur desktop ≥640px
  return (
    <div className="flex sm:hidden" style={BAR_STYLE}>
      <BottomBar
        onSettingsClick={onSettingsOpen}
        onAccountClick={() => router.push(accountHref)}
        isFullscreen={isFullscreen}
        onFullscreenToggle={onFullscreenToggle}
        isAuthenticated={accountHref === '/compte'}
        language={language}
      />
    </div>
  );
}
