import type { Metadata } from 'next';
import MinuteurPageClient from '@/components/MinuteurPageClient';

export const metadata: Metadata = {
  title: 'Minuteur en ligne gratuit | horloge-live.com',
  description:
    'Minuteur en ligne gratuit. Définissez une durée, lancez le compte à rebours et recevez une alerte sonore à la fin. Sur mobile et ordinateur.',
};

export default function MinuteurPage() {
  return <MinuteurPageClient />;
}
