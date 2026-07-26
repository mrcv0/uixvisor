// UIXVISOR — https://uixvisor.dev/blocks/list-item
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { composePressHandlers, usePressFeedback } from '@registry/theme/press-feedback';

export interface ListItemProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  className?: string;
}

export const ListItem = forwardRef<ComponentRef<typeof Pressable>, ListItemProps>(
  (
    {
      title,
      description,
      leading,
      trailing,
      onPress,
      disabled,
      accessibilityLabel,
      className,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const interactive = Boolean(onPress) && !disabled;
    const feedback = usePressFeedback({
      scale: false,
      haptic: interactive ? 'selection' : 'none',
      disabled: Boolean(disabled) || !onPress,
    });
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled || !onPress}
        accessibilityRole={onPress ? 'button' : 'text'}
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: Boolean(disabled) }}
        onPressIn={onPress ? press.onPressIn : undefined}
        onPressOut={onPress ? press.onPressOut : undefined}
        className={cn(
          'min-h-14 w-full flex-row items-center gap-3 border-b border-border bg-background px-4 active:bg-accent',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {leading ? (
          <View className="shrink-0 items-center justify-center py-3">{leading}</View>
        ) : null}
        <View className="min-w-0 flex-1 gap-0.5 py-3">
          <Text size="base" weight="medium" numberOfLines={1}>
            {title}
          </Text>
          {description ? (
            <Text size="sm" variant="muted" numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
        {trailing ? (
          <View className="shrink-0 items-center justify-center py-3">{trailing}</View>
        ) : null}
      </Pressable>
    );
  },
);
ListItem.displayName = 'ListItem';
