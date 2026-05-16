import type { Metadata } from 'next';
import CguContent from '@/components/CguContent';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | horloge-live.com",
  robots: { index: false, follow: false },
};

export default function CguPage() {
  return <CguContent />;
}
