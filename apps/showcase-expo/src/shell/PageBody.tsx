import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { CONTENT_MAX_WIDTH, SPACE_X, usePageLayout } from '../layout';

/**
 * Shared body for Home, Category, and inline Demo pages.
 *
 * Outer scroll is full-bleed; an inner column is max-width capped and centred
 * so every page’s content sits on the same vertical axis as the header title.
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
  const { contentPaddingTop, contentPaddingBottom, rowGap } = usePageLayout();

  const columnStyle: ViewStyle = {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: SPACE_X,
    paddingTop: contentPaddingTop,
    paddingBottom: contentPaddingBottom,
    gap: gap ?? rowGap,
  };

  if (!scroll) {
    return (
      <View className="flex-1" style={{ width: '100%' }}>
        <View style={[columnStyle, { flex: 1 }, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <View style={[columnStyle, contentStyle]}>{children}</View>
    </ScrollView>
  );
}
