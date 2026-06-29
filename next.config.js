/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,

  experimental: {
    // Améliore le tree-shaking de ces packages : Next.js transforme les imports
    // barrel (index.js) en imports directs vers les modules sources.
    // lucide-react : évite de bundler les ~1000 icônes non utilisées.
    // firebase/auth : réduit le sous-ensemble Auth chargé initialement.
    optimizePackageImports: ['lucide-react', 'firebase/auth'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31_536_000,
  },

  async headers() {
    return [
      /* Images de fond — immuables (hash dans le nom de fichier) */
      {
        source: '/backgrounds/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      /* Chunks JS/CSS Next.js — immuables */
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      /* Page racine — CDN 1h, stale-while-revalidate 24h */
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      /* Pages widget — SEULES routes embarquables en iframe (Notion, etc.) */
      {
        source: '/widget/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *',
          },
        ],
      },
      {
        source: '/widget',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *',
          },
        ],
      },
      /* Tout le reste SAUF /widget — durcissement sécurité + interdiction
         d'embarquement (anti-clickjacking, notamment /connexion et /compte).
         Le lookahead négatif évite de fusionner ces headers sur /widget. */
      {
        source: '/((?!widget).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
