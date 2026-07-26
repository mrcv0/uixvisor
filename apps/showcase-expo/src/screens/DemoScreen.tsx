import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getItem } from '../catalog';
import { renderDemo } from '../demos';
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
    // Screens and flows own the full body; chrome only provides back + theme.
    return (
      <ScreenChrome title={title} subtitle={subtitle} onBack={navigation.pop}>
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
