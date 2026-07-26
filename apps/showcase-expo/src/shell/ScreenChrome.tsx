import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { Button } from '@registry/button/button';
import { Icon } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { useThemeColor } from '@registry/theme/theme';

import { CONTENT_MAX_WIDTH, SPACE_X } from '../layout';

const ACTION_SIZE = 44;

/**
 * Shared top chrome for every showcase route.
 *
 * Title row uses the same max-width column as PageBody so the heading lines up
 * with catalogue cards and demo content on every page.
 */
export function ScreenChrome({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const foreground = useThemeColor('foreground');
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View
        accessibilityRole="header"
        className="border-b border-border bg-background"
        style={{
          width: '100%',
          alignItems: 'center',
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: CONTENT_MAX_WIDTH,
            minHeight: 56,
            paddingHorizontal: SPACE_X,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {onBack ? (
            <View
              style={{
                width: ACTION_SIZE,
                height: ACTION_SIZE,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                accessibilityLabel="Go back"
                icon={<Icon name="chevron-left" size={22} color={foreground} weight="bold" />}
                onPress={onBack}
              />
            </View>
          ) : null}

          <View className="min-w-0 flex-1 justify-center" style={{ gap: 2 }}>
            <Text weight="semibold" size="lg" numberOfLines={1} accessibilityRole="header">
              {title}
            </Text>
            {subtitle ? (
              <Text variant="muted" size="xs" numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              width: ACTION_SIZE,
              height: ACTION_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outline"
              size="icon-sm"
              accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              icon={
                <Icon
                  name={isDark ? 'sun' : 'moon'}
                  size={20}
                  color={foreground}
                  weight="regular"
                />
              }
              onPress={toggleColorScheme}
            />
          </View>
        </View>
      </View>

      <View className="flex-1">{children}</View>
    </View>
  );
}
