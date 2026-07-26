import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@registry/text/text';

import { getItem } from '../catalog';
import { renderDemo } from '../demos';
import { CONTENT_MAX_WIDTH, SPACE_X } from '../layout';
import type { ShowcaseNavigation } from '../navigation';
import { PageBody } from '../shell/PageBody';
import { ScreenChrome } from '../shell/ScreenChrome';

export function DemoScreen({
  itemId,
  navigation,
}: {
  itemId: string;
  navigation: ShowcaseNavigation;
}) {
  const item = getItem(itemId);
  const insets = useSafeAreaInsets();
  const title = item?.title ?? itemId;
  const subtitle = item?.description;
  const fullscreen = item?.presentation === 'fullscreen';

  if (fullscreen) {
    // Live screen/flow: thin context strip, then the real layout under chrome.
    return (
      <ScreenChrome title={title} subtitle={subtitle} onBack={navigation.pop}>
        <View
          className="border-b border-border bg-muted/40"
          style={{ width: '100%', alignItems: 'center' }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: CONTENT_MAX_WIDTH,
              paddingHorizontal: SPACE_X,
              paddingVertical: 10,
              gap: 2,
            }}
          >
            <Text size="xs" weight="medium">
              Live preview
            </Text>
            <Text size="xs" variant="muted">
              {subtitle
                ? `${subtitle} Callbacks are mocked with toasts — no backend required.`
                : 'Callbacks are mocked with toasts — no backend required.'}
            </Text>
          </View>
        </View>
        <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
          {renderDemo(itemId)}
        </View>
      </ScreenChrome>
    );
  }

  return (
    <ScreenChrome title={title} subtitle={subtitle} onBack={navigation.pop}>
      <PageBody>{renderDemo(itemId)}</PageBody>
    </ScreenChrome>
  );
}
