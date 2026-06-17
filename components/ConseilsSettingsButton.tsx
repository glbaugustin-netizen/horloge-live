'use client';

import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSettings } from '@/lib/useSettings';

const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false, loading: () => null });

export default function ConseilsSettingsButton() {
  const {
    settings,
    updateFont,
    updateFontSize,
    updateTextColor,
    updateBackground,
    updateFormat,
    updateMirror,
    updateShowDate,
    updateShowSeconds,
    updateLanguage,
  } = useSettings();

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir les paramètres"
        style={{
          position:             'fixed',
          bottom:               '32px',
          right:                '32px',
          zIndex:               40,
          width:                '52px',
          height:               '52px',
          borderRadius:         '50%',
          display:              'flex',
          alignItems:           'center',
          justifyContent:       'center',
          background:           'rgba(255,255,255,0.13)',
          backdropFilter:       'blur(14px) saturate(160%)',
          WebkitBackdropFilter: 'blur(14px) saturate(160%)',
          border:               '1px solid rgba(255,255,255,0.34)',
          boxShadow:            'inset 0 1px 1px rgba(255,255,255,0.60), inset 0 -8px 16px rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.32)',
          color:                'rgba(255,255,255,0.90)',
          cursor:               'pointer',
          transition:           'transform 0.28s cubic-bezier(.2,.9,.3,1.5)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        onMouseDown={(e)  => { e.currentTarget.style.transform = 'scale(0.90)'; }}
        onMouseUp={(e)    => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
      >
        <Settings2 size={20} strokeWidth={1.5} />
      </button>

      <SettingsPanel
        isOpen={open}
        onClose={() => setOpen(false)}
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
        disabledOptions={{
          fontSize:   true,
          mirror:     true,
          format:     true,
          flipStyle:  true,
          fontChoice: true,
          showDate:   true,
          seconds:    true,
          textColor:  true,
        }}
      />
    </>
  );
}
