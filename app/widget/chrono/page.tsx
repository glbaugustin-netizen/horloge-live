import type { Metadata } from 'next';
import ChronoWidgetClient from '@/components/ChronoWidgetClient';

type Size = 'small' | 'medium' | 'large';

const SIZE_MAP: Record<Size, { fontSize: number }> = {
  small:  { fontSize: 40 },
  medium: { fontSize: 58 },
  large:  { fontSize: 76 },
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ChronoWidgetPage({
  searchParams,
}: {
  searchParams: { size?: string };
}) {
  const raw = searchParams.size ?? 'medium';
  const size: Size = (['small', 'medium', 'large'] as const).includes(raw as Size)
    ? (raw as Size)
    : 'medium';

  const { fontSize } = SIZE_MAP[size];

  return <ChronoWidgetClient fontSize={fontSize} />;
}
