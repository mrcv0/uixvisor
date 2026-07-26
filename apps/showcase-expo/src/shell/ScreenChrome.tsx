import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { Icon } from '@registry/icon/icon';
import { IconButton } from '@registry/icon-button/icon-button';
import { Text } from '@registry/text/text';
import { useThemeColor } from '@registry/theme/theme';

import { SPACE_X } from '../layout';

const ACTION_SIZE = 44;

/**
 * Shared top chrome for every showcase route.
 *
 * Layout: [ leading 44 ] [ title flex ] [ trailing 44 ]
 * Equal side slots keep the title column stable whether back is present or not.
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
          minHeight: 56,
          paddingHorizontal: SPACE_X,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Leading — fixed slot so title never jumps when back appears */}
        <View style={{ width: ACTION_SIZE, height: ACTION_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          {onBack ? (
            <IconButton
              variant="ghost"
              accessibilityLabel="Go back"
              className="h-11 w-11 rounded-xl"
              icon={<Icon name="chevron-left" size={22} color={foreground} weight="bold" />}
              onPress={onBack}
            />
          ) : null}
        </View>

        {/* Title column */}
        <View className="min-w-0 flex-1 justify-center" style={{ gap: 2 }}>
          <Text
            weight="semibold"
            size="lg"
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text variant="muted" size="xs" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Trailing — theme toggle via proper Phosphor sun/moon */}
        <View style={{ width: ACTION_SIZE, height: ACTION_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            variant="outline"
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-11 w-11 rounded-xl"
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

      <View className="flex-1">{children}</View>
    </View>
  );
}
