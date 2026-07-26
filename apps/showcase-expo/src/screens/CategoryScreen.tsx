import {
  getCategoryMeta,
  itemsForCategory,
  type CatalogCategory,
} from '../catalog';
import type { ShowcaseNavigation } from '../navigation';
import { CatalogRow } from '../shell/CatalogRow';
import { PageBody } from '../shell/PageBody';
import { ScreenChrome } from '../shell/ScreenChrome';

export function CategoryScreen({
  category,
  navigation,
}: {
  category: CatalogCategory;
  navigation: ShowcaseNavigation;
}) {
  const meta = getCategoryMeta(category);
  const items = itemsForCategory(category);

  return (
    <ScreenChrome title={meta.title} subtitle={meta.description} onBack={navigation.pop}>
      <PageBody gap={10}>
        {items.map((item) => (
          <CatalogRow
            key={item.id}
            title={item.title}
            description={item.description}
            meta={item.presentation === 'fullscreen' ? 'screen' : undefined}
            onPress={() =>
              navigation.push({
                name: 'demo',
                category,
                itemId: item.id,
              })
            }
          />
        ))}
      </PageBody>
    </ScreenChrome>
  );
}
