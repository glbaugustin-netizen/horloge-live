/**
 * Styles partagés pour les pages légales (DESIGN_SYSTEM section 4.14).
 * Fichier pur TypeScript — pas de 'use client', importable depuis Server Components.
 */

export const S = {
  h2: {
    fontSize:     '20px',
    fontWeight:   500,
    color:        '#ffffff',
    marginTop:    '32px',
    marginBottom: '12px',
  } as React.CSSProperties,

  p: {
    fontSize:     '15px',
    fontWeight:   400,
    color:        'rgba(255,255,255,0.70)',
    lineHeight:   1.7,
    marginBottom: '12px',
  } as React.CSSProperties,

  em: {
    fontStyle: 'italic',
    color:     'rgba(255,255,255,0.55)',
  } as React.CSSProperties,

  strong: {
    fontWeight: 600,
    color:      'rgba(255,255,255,0.85)',
  } as React.CSSProperties,

  a: {
    color:          '#4FC3F7',
    textDecoration: 'none',
  } as React.CSSProperties,

  updated: {
    fontSize:     '13px',
    fontWeight:   400,
    color:        'rgba(255,255,255,0.35)',
    marginBottom: '32px',
    display:      'block',
  } as React.CSSProperties,
};
