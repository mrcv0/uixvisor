import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { usePageLayout } from '../layout';

/**
 * Consistent padded body for catalogue-style pages.
 * Centers content on wide screens and applies one shared bottom safe-area pad.
 */
export function PageBody({
  children,
  scroll = true,
  contentStyle,
  gap,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Override default row gap between children. */
  gap?: number;
}) {
  const { sideGutter, contentPaddingTop, contentPaddingBottom, rowGap } = usePageLayout();

  const paddingStyle: ViewStyle = {
    paddingHorizontal: sideGutter,
    paddingTop: contentPaddingTop,
    paddingBottom: contentPaddingBottom,
    gap: gap ?? rowGap,
    flexGrow: 1,
    width: '100%',
  };

  if (!scroll) {
    return (
      <View className="flex-1" style={[paddingStyle, contentStyle]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[paddingStyle, contentStyle]}
    >
      {children}
    </ScrollView>
  );
}
