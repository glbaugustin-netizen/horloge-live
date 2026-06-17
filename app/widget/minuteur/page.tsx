import type { Metadata } from 'next';
import MinuteurWidgetClient from '@/components/MinuteurWidgetClient';

type Size = 'small' | 'medium' | 'large';

const SIZE_MAP: Record<Size, { fontSize: number }> = {
  small:  { fontSize: 38 },
  medium: { fontSize: 54 },
  large:  { fontSize: 72 },
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MinuteurWidgetPage({
  searchParams,
}: {
  searchParams: { size?: string; duration?: string };
}) {
  const raw = searchParams.size ?? 'medium';
  const size: Size = (['small', 'medium', 'large'] as const).includes(raw as Size)
    ? (raw as Size)
    : 'medium';

  const durationRaw = parseInt(searchParams.duration ?? '300', 10);
  const duration = isNaN(durationRaw) || durationRaw <= 0 ? 300 : Math.min(durationRaw, 86400);

  const { fontSize } = SIZE_MAP[size];

  return <MinuteurWidgetClient fontSize={fontSize} duration={duration} />;
}
