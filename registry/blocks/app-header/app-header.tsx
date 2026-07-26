// UIXVISOR — https://uixvisor.dev/blocks/app-header
//
// Composes Icon + Text + Button (back) so the header stays on the primitive stack.
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { Icon } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export interface AppHeaderProps extends ViewProps {
  title: string;
  /** Optional secondary line under the title. */
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

const SIDE = 44;

export const AppHeader = forwardRef<ComponentRef<typeof View>, AppHeaderProps>(
  (
    {
      title,
      subtitle,
      leading,
      trailing,
      onBack,
      backLabel = 'Go back',
      className,
      ...props
    },
    ref,
  ) => {
    const foreground = useThemeColor('foreground');
    const showBack = Boolean(onBack) && leading === undefined;

    return (
      <View
        ref={ref}
        accessibilityRole="header"
        className={cn(
          'min-h-14 w-full flex-row items-center border-b border-border bg-background px-2 py-1.5',
          className,
        )}
        {...props}
      >
        <View style={{ width: SIDE, height: SIDE }} className="items-center justify-center">
          {leading ??
            (showBack ? (
              <Button
                variant="ghost"
                size="icon-sm"
                accessibilityLabel={backLabel}
                icon={<Icon name="chevron-left" size={22} color={foreground} weight="bold" />}
                onPress={onBack}
              />
            ) : null)}
        </View>

        <View className="min-w-0 flex-1 justify-center gap-0.5 px-1 py-1">
          <Text
            accessibilityRole="header"
            size="lg"
            weight="semibold"
            numberOfLines={1}
            className="text-center"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text variant="muted" size="xs" numberOfLines={1} className="text-center">
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={{ width: SIDE, height: SIDE }} className="items-center justify-center">
          {trailing ?? null}
        </View>
      </View>
    );
  },
);
AppHeader.displayName = 'AppHeader';
