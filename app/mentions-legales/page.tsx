import type { Metadata } from 'next';
import MentionsLegalesContent from '@/components/MentionsLegalesContent';

export const metadata: Metadata = {
  title: 'Mentions légales | horloge-live.com',
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return <MentionsLegalesContent />;
}
