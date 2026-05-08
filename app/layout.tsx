import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Horloge en ligne — Plein écran & personnalisable | horloge-live.com',
    template: '%s | horloge-live.com',
  },
  description:
    'Affichez l\'heure exacte en ligne avec une horloge gratuite, personnalisable et en plein écran. Choisissez votre style et utilisez-la sur mobile ou PC en un clic.',
  metadataBase: new URL('https://horloge-live.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://horloge-live.com',
    siteName: 'horloge-live.com',
    title: 'Horloge en ligne — Plein écran & personnalisable | horloge-live.com',
    description:
      'Affichez l\'heure exacte en ligne avec une horloge gratuite, personnalisable et en plein écran. Choisissez votre style et utilisez-la sur mobile ou PC en un clic.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge en ligne — Plein écran & personnalisable | horloge-live.com',
    description:
      'Affichez l\'heure exacte en ligne avec une horloge gratuite, personnalisable et en plein écran.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Horloge en ligne',
  url: 'https://horloge-live.com',
  description:
    'Horloge en ligne gratuite, personnalisable et en plein écran. Affiche l\'heure exacte en temps réel, synchronisée avec votre navigateur. Sans installation, sans inscription.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript',
  inLanguage: 'fr',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  author: {
    '@type': 'Person',
    name: 'Augustin GLB',
  },
  publisher: {
    '@type': 'Person',
    name: 'Augustin GLB',
    url: 'https://horloge-live.com',
  },
};

/**
 * Script FOUC — exécuté de façon SYNCHRONE avant le premier rendu.
 * Lit les préférences dans localStorage et applique immédiatement
 * les variables CSS sur :root, évitant tout flash de l'image/couleur par défaut.
 */
const foucScript = `(function(){try{
  var r=document.documentElement;
  var font=localStorage.getItem('horloge-live.com-font')||'Inter';
  var size=parseInt(localStorage.getItem('horloge-live.com-font-size')||'120',10);
  var color=localStorage.getItem('horloge-live.com-text-color')||'#FFFFFF';
  var bg=localStorage.getItem('horloge-live.com-background')||"url('/backgrounds/bg-nature7.webp')";
  r.style.setProperty('--clock-font-family',"'"+font+"', sans-serif");
  r.style.setProperty('--clock-font-size',size+'px');
  r.style.setProperty('--color-text-primary',color);
  if(bg.indexOf('url(')===0){
    r.style.setProperty('--bg-image',bg);
    r.style.setProperty('--bg-color','transparent');
  }else{
    r.style.setProperty('--bg-image','none');
    r.style.setProperty('--bg-color',bg);
  }
}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        {/* ── Anti-FOUC : applique les CSS vars AVANT le premier rendu ── */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: foucScript }} />

        {/* ── Préconnexion Google Fonts (polices alternatives) ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* ── Préchargement image de fond par défaut (LCP) ── */}
        <link
          rel="preload"
          as="image"
          href="/backgrounds/bg-nature7.webp"
          type="image/webp"
        />

        {/* ── Données structurées Schema.org ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationJsonLd),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
