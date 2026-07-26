import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Horizontal page gutter on phone-width layouts. */
export const SPACE_X = 16;

/** Vertical rhythm between major sections / list rows. */
export const SPACE_Y = 12;

/**
 * Soft max width for the content column. Header chrome and PageBody both
 * centre against this so catalogue, demos, and full pages share one axis.
 */
export const CONTENT_MAX_WIDTH = 560;

/**
 * Shared content metrics for every showcase page.
 * - Phone: 16px side gutters, full-width column.
 * - Tablet/web: column capped at CONTENT_MAX_WIDTH and centred.
 */
export function usePageLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, CONTENT_MAX_WIDTH);
  const sideGutter = Math.max(SPACE_X, Math.round((width - contentWidth) / 2));

  return {
    insets,
    width,
    contentWidth,
    sideGutter,
    contentPaddingTop: SPACE_Y + 4,
    contentPaddingBottom: Math.max(insets.bottom, 16) + 24,
    rowGap: SPACE_Y,
  };
}
