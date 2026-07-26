// UIXVISOR — https://uixvisor.dev/blocks/list-item
//
// Built on Text + theme press feedback. No baked-in group chrome — parent
// provides rounded card / separators so stacks stay flexible.
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
      disabled: !interactive,
    });
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    const body = (
      <>
        {leading ? (
          <View className="mr-3 shrink-0 items-center justify-center">{leading}</View>
        ) : null}

        <View className="min-w-0 flex-1 justify-center py-3.5">
          <Text size="base" weight="medium" numberOfLines={1}>
            {title}
          </Text>
          {description ? (
            <Text size="sm" variant="muted" numberOfLines={2} className="mt-0.5">
              {description}
            </Text>
          ) : null}
        </View>

        {/* box-none so Switch / icon buttons inside trailing still receive touches */}
        {trailing ? (
          <View className="ml-3 shrink-0 items-center justify-center" pointerEvents="box-none">
            {trailing}
          </View>
        ) : null}
      </>
    );

    const surface = cn(
      'min-h-[56px] w-full flex-row items-center bg-card px-4',
      disabled && 'opacity-50',
      className,
    );

    // Non-interactive row (e.g. switch only): Pressable without onPress still
    // lays out the same, but we leave it enabled for trailing controls via box-none.
    if (!onPress) {
      return (
        <Pressable
          ref={ref}
          disabled
          accessibilityRole="none"
          accessibilityLabel={accessibilityLabel ?? title}
          className={surface}
          {...props}
        >
          {body}
        </Pressable>
      );
    }

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: Boolean(disabled) }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        className={cn(surface, 'active:bg-accent')}
        {...props}
      >
        {body}
      </Pressable>
    );
  },
);
ListItem.displayName = 'ListItem';
