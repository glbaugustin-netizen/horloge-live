export const FONT_CATEGORIES = [
  {
    label: 'Sans-Serif',
    fonts: [
      'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
      'Nunito', 'Poppins', 'Raleway', 'Ubuntu', 'Josefin Sans',
      'Outfit', 'DM Sans',
    ],
  },
  {
    label: 'Serif',
    fonts: [
      'Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond',
      'EB Garamond', 'Libre Baskerville', 'Crimson Text', 'Cardo',
    ],
  },
  {
    label: 'Monospace',
    fonts: [
      'JetBrains Mono', 'Roboto Mono', 'Source Code Pro', 'IBM Plex Mono',
      'Fira Code', 'Space Mono', 'Courier Prime', 'Share Tech Mono',
    ],
  },
  {
    label: 'Condensed',
    fonts: [
      'Barlow Condensed', 'Oswald', 'Anton', 'Bebas Neue',
      'Archivo Narrow', 'Fjalla One',
    ],
  },
  {
    label: 'Décorative',
    fonts: [
      'Orbitron', 'Exo 2', 'Audiowide', 'Rajdhani', 'Quantico',
      'Russo One', 'Syncopate', 'Wallpoet', 'Major Mono Display', 'VT323',
      'Press Start 2P', 'Silkscreen', 'Special Elite', 'Cutive Mono',
    ],
  },
  {
    label: 'Thématique',
    fonts: [
      'Cinzel', 'UnifrakturMaguntia', 'Pirata One', 'Creepster',
      'Finger Paint', 'Fredoka One', 'Righteous', 'Lobster', 'Pacifico',
      'Dancing Script', 'Great Vibes', 'Satisfy', 'Permanent Marker', 'Caveat',
    ],
  },
] as const;

export type FontCategory = typeof FONT_CATEGORIES[number];
export const ALL_FONTS = FONT_CATEGORIES.flatMap((c) => c.fonts);

/* Charge toutes les 62 polices d'un coup (pour le panneau paramètres) */
export function loadAllFonts(): void {
  if (typeof document === 'undefined') return;
  const id = 'gf-all-62';
  if (document.getElementById(id)) return;

  const families = ALL_FONTS
    .map((f) => `family=${f.replace(/\s+/g, '+')}`)
    .join('&');

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

/* Charge une police unique (pour l'horloge lors d'un changement de police) */
export function loadFont(fontName: string): void {
  if (typeof document === 'undefined') return;
  const id = `gf-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500&display=swap`;
  document.head.appendChild(link);
}
