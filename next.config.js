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
      /* Page widget — autorise l'iframe depuis n'importe quel domaine */
      {
        source: '/widget',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
      /* Autorise l'intégration en iframe (Notion, autres sites) */
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
