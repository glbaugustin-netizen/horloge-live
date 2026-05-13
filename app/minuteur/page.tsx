import type { Metadata } from 'next';
import MinuteurPageClient from '@/components/MinuteurPageClient';

export const metadata: Metadata = {
  title: 'Minuteur en ligne gratuit | horloge-live.com',
  description:
    'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
  alternates: { canonical: 'https://horloge-live.com/minuteur' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Minuteur en ligne gratuit | horloge-live.com',
    description:
      'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
    url: 'https://horloge-live.com/minuteur',
    images: [
      {
        url: '/backgrounds/bg-nature7.webp',
        width: 1920,
        height: 1080,
        alt: 'Minuteur en ligne — horloge-live.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minuteur en ligne gratuit | horloge-live.com',
    description:
      'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
  },
};

export default function MinuteurPage() {
  return <MinuteurPageClient />;
}
