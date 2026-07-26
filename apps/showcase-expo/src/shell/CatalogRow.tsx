import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { useThemeColor } from '@registry/theme/theme';

export function CatalogRow({
  title,
  description,
  meta,
  icon,
  onPress,
}: {
  title: string;
  description?: string;
  meta?: string;
  /** Optional leading Phosphor icon (semantic name). */
  icon?: IconName;
  onPress: () => void;
}) {
  const foreground = useThemeColor('foreground');
  const muted = useThemeColor('muted-foreground');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={meta ? `${title}, ${meta}` : title}
      onPress={onPress}
      className="min-h-[64px] w-full flex-row items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 active:bg-accent"
    >
      {icon ? (
        <View className="h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon name={icon} size={22} color={foreground} weight="regular" />
        </View>
      ) : null}

      <View className="min-w-0 flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text weight="medium" size="base" numberOfLines={1} className="min-w-0 shrink">
            {title}
          </Text>
          {meta ? (
            <View className="shrink-0 rounded-full bg-muted px-2 py-0.5">
              <Text variant="muted" size="xs" numberOfLines={1}>
                {meta}
              </Text>
            </View>
          ) : null}
        </View>
        {description ? (
          <Text variant="muted" size="sm" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      <View className="shrink-0 pl-1">
        <Icon name="chevron-right" size={18} color={muted} weight="bold" />
      </View>
    </Pressable>
  );
}
