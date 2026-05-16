import type { Metadata } from 'next';
import ConfidentialiteContent from '@/components/ConfidentialiteContent';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | horloge-live.com',
  robots: { index: false, follow: false },
};

export default function ConfidentialitePage() {
  return <ConfidentialiteContent />;
}
