// UIXVISOR — https://uixvisor.dev/blocks/app-header
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Pressable, Text, View, type ViewProps } from 'react-native';

import { Icon } from '@registry/icon/icon';
import { useThemeColor } from '@registry/theme/theme';

export interface AppHeaderProps extends ViewProps {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export const AppHeader = forwardRef<ComponentRef<typeof View>, AppHeaderProps>(
  ({ title, leading, trailing, onBack, backLabel = 'Go back', className, ...props }, ref) => {
    const foreground = useThemeColor('foreground');

    return (
      <View
        ref={ref}
        accessibilityRole="header"
        className={`min-h-14 flex-row items-center gap-2 border-b border-border bg-background px-3 py-2${className ? ` ${className}` : ''}`}
        {...props}
      >
        {leading ??
          (onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={backLabel}
              onPress={onBack}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-lg active:bg-muted"
            >
              <Icon name="chevron-left" size={22} color={foreground} weight="bold" />
            </Pressable>
          ) : (
            <View className="w-1" />
          ))}
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="min-w-0 flex-1 text-lg font-semibold text-foreground"
        >
          {title}
        </Text>
        {trailing ? (
          <View className="shrink-0 items-center justify-center">{trailing}</View>
        ) : (
          <View className="w-1" />
        )}
      </View>
    );
  },
);
AppHeader.displayName = 'AppHeader';
