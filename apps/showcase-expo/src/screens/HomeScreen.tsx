import { View } from 'react-native';

import { Text } from '@registry/text/text';

import {
  CATALOG,
  CATEGORIES,
  categoryCount,
  type CatalogCategory,
} from '../catalog';
import type { ShowcaseNavigation } from '../navigation';
import { CatalogRow } from '../shell/CatalogRow';
import { PageBody } from '../shell/PageBody';
import { ScreenChrome } from '../shell/ScreenChrome';

export function HomeScreen({ navigation }: { navigation: ShowcaseNavigation }) {
  return (
    <ScreenChrome title="UIXVISOR" subtitle={`${CATALOG.length} items · Expo SDK 57`}>
      <PageBody>
        <View className="mb-1 gap-1.5 pb-1">
          <Text weight="semibold" size="lg">
            Catalogue
          </Text>
          <Text variant="muted" size="sm">
            Monochrome by default. Colour carries meaning, never decoration. Open
            any item to see how it behaves on a real device.
          </Text>
        </View>

        {CATEGORIES.map((category) => (
          <CatalogRow
            key={category.id}
            title={category.title}
            description={category.description}
            meta={`${categoryCount(category.id)}`}
            icon={category.icon}
            onPress={() =>
              navigation.push({
                name: 'category',
                category: category.id as CatalogCategory,
              })
            }
          />
        ))}
      </PageBody>
    </ScreenChrome>
  );
}
