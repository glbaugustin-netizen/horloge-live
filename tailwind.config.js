/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#4FC3F7',
          hover: '#81D4FA',
          subtle: '#B3E5FC',
        },
      },
      fontSize: {
        'clock-desktop': [
          '120px',
          { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '300' },
        ],
        'clock-tablet': [
          '80px',
          { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '300' },
        ],
        'clock-mobile': [
          '56px',
          { lineHeight: '1', letterSpacing: '0.04em', fontWeight: '300' },
        ],
        'chrono-desktop': [
          '88px',
          { lineHeight: '1', letterSpacing: '0.04em', fontWeight: '300' },
        ],
        'chrono-mobile': [
          '48px',
          { lineHeight: '1', letterSpacing: '0.03em', fontWeight: '300' },
        ],
        'label-clock': [
          '11px',
          { lineHeight: '1', letterSpacing: '0.10em', fontWeight: '500' },
        ],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        input: '12px',
        lg: '16px',
        panel: '24px',
        pill: '50px',
      },
      backdropBlur: {
        glass: '20px',
      },
      transitionDuration: {
        fast: '100ms',
        normal: '150ms',
        slow: '250ms',
        panel: '350ms',
        bg: '500ms',
      },
      zIndex: {
        clock: '10',
        bar: '30',
        overlay: '35',
        panel: '40',
        sidebar: '50',
        hint: '60',
        toast: '70',
      },
    },
  },
  plugins: [],
};
