import { MetadataRoute } from 'next';
import { articles } from '@/lib/conseils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://horloge-live.com';
  const lastModified = new Date('2026-06-10');

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/horloge-aiguille`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/examen`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/monde`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chrono`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/minuteur`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/conseils`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/conseils/${article.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
