import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import FullscreenBodyLock from '@/components/FullscreenBodyLock';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Horloge en ligne — Heure exacte, aesthetic, live et personnalisable | horloge-live.com',
    template: '%s | horloge-live.com',
  },
  description:
    "Horloge en ligne live et aesthetic — affiche l'heure exacte en temps réel, gratuite et personnalisable. Plus de 60 polices, fonds aesthetic, paysages. Plein écran en un clic. Sur mobile et PC.",
  metadataBase: new URL('https://horloge-live.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://horloge-live.com',
    siteName: 'horloge-live.com',
    title: 'Horloge en ligne — Heure exacte, aesthetic, live et personnalisable | horloge-live.com',
    description:
      "Horloge en ligne live et aesthetic — affiche l'heure exacte en temps réel, gratuite et personnalisable. Plus de 60 polices, fonds aesthetic, paysages. Plein écran en un clic.",
    images: [
      {
        url: 'https://horloge-live.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Horloge en ligne gratuite et personnalisable — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horloge en ligne — Heure exacte, aesthetic, live et personnalisable | horloge-live.com',
    description:
      "Horloge en ligne live et aesthetic — affiche l'heure exacte en temps réel, gratuite et personnalisable. Plus de 60 polices, fonds aesthetic, paysages. Plein écran en un clic.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'Hzs39rl0UhFX4FifeL0N9sjbvjI5VwwiW-JOhW96gbk',
  },
  other: {
    'p:domain_verify': '48ee732ffd6a25dbac4a94feb8e63963',
  },
};

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Horloge en ligne',
  url: 'https://horloge-live.com',
  datePublished: '2026-01-01',
  dateModified: '2026-06-10',
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
  var size=parseInt(localStorage.getItem('horloge-live.com-font-size')||'200',10);
  var color=localStorage.getItem('horloge-live.com-text-color')||'#FFFFFF';
  var bg=localStorage.getItem('horloge-live.com-background')||"url('/backgrounds/bg-nature7.webp')";
  r.style.setProperty('--clock-font-family',"'"+font+"', sans-serif");
  r.style.setProperty('--clock-font-size',size+'px');
  r.style.setProperty('--color-text-primary',color);
  if(bg.indexOf('url(')===0){
    r.style.setProperty('--bg-image',bg);
    var mob=bg.startsWith("url('/backgrounds/")&&bg.endsWith(".webp')")?bg.replace(".webp')","-mobile.webp')"):bg;
    r.style.setProperty('--bg-image-mobile',mob);
    r.style.setProperty('--bg-color','transparent');
  }else{
    r.style.setProperty('--bg-image','none');
    r.style.setProperty('--bg-image-mobile','none');
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
        {/* ── 1. PRELOAD IMAGE LCP — EN PREMIER, avant tout autre tag ──
            Le navigateur découvre et planifie le téléchargement de l'image
            de fond le plus tôt possible dans le parsing HTML. ── */}
        <link
          rel="preload"
          as="image"
          href="/backgrounds/bg-nature7.webp"
          type="image/webp"
          fetchPriority="high"
        />

        {/* ── 2. Anti-FOUC : applique les CSS vars AVANT le premier rendu ── */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: foucScript }} />

        {/* ── 3. Préconnexion Google Fonts (polices alternatives) ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* ── 4. Données structurées Schema.org ── */}
        <Script
          id="ld-json-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationJsonLd),
          }}
        />
      </head>
      <body>
        <FullscreenBodyLock />
        {children}
      </body>
    </html>
  );
}
