'use client';

import { useEffect } from 'react';

/**
 * Verrouille le scroll du body et masque la scrollbar quand le navigateur
 * passe en mode plein écran. Fonctionne sur tous les navigateurs car
 * la sélection CSS :fullscreen body n'est pas fiable en pratique.
 */
export default function FullscreenBodyLock() {
  useEffect(() => {
    const onFsChange = () => {
      if (document.fullscreenElement) {
        document.body.style.overflow = 'hidden';
        document.body.style.scrollbarWidth = 'none';
        // @ts-expect-error — propriété non standard WebKit
        document.body.style.msOverflowStyle = 'none';
      } else {
        document.body.style.overflow = '';
        document.body.style.scrollbarWidth = '';
        // @ts-expect-error
        document.body.style.msOverflowStyle = '';
      }
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  return null;
}
