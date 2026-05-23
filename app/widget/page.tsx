import type { Metadata } from 'next';
import WidgetClient from '@/components/WidgetClient';

/* ─── Tailles disponibles ─────────────────────────────────── */
type Size = 'small' | 'medium' | 'large';

const SIZE_MAP: Record<Size, { width: number; height: number; fontSize: number }> = {
  small:  { width: 320, height: 120, fontSize: 48 },
  medium: { width: 480, height: 160, fontSize: 72 },
  large:  { width: 640, height: 200, fontSize: 96 },
};

/* ─── Métadonnées — noindex (page embarquée uniquement) ──── */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* ─── Page ────────────────────────────────────────────────── */
export default function WidgetPage({
  searchParams,
}: {
  searchParams: { size?: string };
}) {
  const raw = searchParams.size ?? 'medium';
  const size: Size = (['small', 'medium', 'large'] as const).includes(raw as Size)
    ? (raw as Size)
    : 'medium';

  const { fontSize } = SIZE_MAP[size];

  return <WidgetClient fontSize={fontSize} />;
}
