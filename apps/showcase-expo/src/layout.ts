import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Horizontal page gutter — comfortable on phone, not wasteful on tablet. */
export const SPACE_X = 16;

/** Vertical rhythm between major sections / list rows. */
export const SPACE_Y = 12;

/** Soft max width so catalogue cards don't stretch edge-to-edge on tablets. */
export const CONTENT_MAX_WIDTH = 560;

/**
 * Shared content metrics for every showcase page. Keeps gutters, bottom safe
 * area and tablet centering in one place so Home / Category / Demo stay aligned.
 */
export function usePageLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, CONTENT_MAX_WIDTH);
  const sideGutter = Math.max(SPACE_X, Math.round((width - contentWidth) / 2));

  return {
    insets,
    width,
    sideGutter,
    contentPaddingTop: SPACE_Y + 4,
    contentPaddingBottom: Math.max(insets.bottom, 16) + 24,
    rowGap: SPACE_Y,
  };
}
