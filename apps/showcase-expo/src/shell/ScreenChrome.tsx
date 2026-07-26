import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { Icon } from '@registry/icon/icon';
import { IconButton } from '@registry/icon-button/icon-button';
import { Text } from '@registry/text/text';
import { useThemeColor } from '@registry/theme/theme';

import { usePageLayout } from '../layout';

const ACTION_SIZE = 44;

/**
 * Shared top chrome for every showcase route.
 *
 * Horizontal padding matches PageBody (`sideGutter`) so the home title lines
 * up with catalogue cards. No empty left slot when back is absent — that was
 * pushing "UIXVISOR" inward while the theme control sat tight on the right.
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
  const { sideGutter } = usePageLayout();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const foreground = useThemeColor('foreground');
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View
        accessibilityRole="header"
        className="border-b border-border bg-background"
        style={{
          minHeight: 56,
          paddingLeft: sideGutter,
          paddingRight: sideGutter,
          paddingVertical: 8,
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
            <IconButton
              variant="ghost"
              accessibilityLabel="Go back"
              className="h-11 w-11 rounded-xl"
              icon={<Icon name="chevron-left" size={22} color={foreground} weight="bold" />}
              onPress={onBack}
            />
          </View>
        ) : null}

        {/* Title — starts at the same gutter as page content when there is no back */}
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
          <IconButton
            variant="outline"
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-11 w-11 rounded-xl"
            icon={
              <Icon name={isDark ? 'sun' : 'moon'} size={20} color={foreground} weight="regular" />
            }
            onPress={toggleColorScheme}
          />
        </View>
      </View>

      <View className="flex-1">{children}</View>
    </View>
  );
}
