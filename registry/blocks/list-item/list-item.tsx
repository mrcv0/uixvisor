// UIXVISOR — https://uixvisor.dev/blocks/list-item
//
// Built on Text + theme press feedback. Transparent row surface so a parent
// group can own the card background — rows stay wide and flush, not double-boxed.
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
          <View className="mr-3.5 shrink-0 items-center justify-center">{leading}</View>
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

        {trailing ? (
          <View className="ml-3 shrink-0 items-center justify-center" pointerEvents="box-none">
            {trailing}
          </View>
        ) : null}
      </>
    );

    // Transparent fill — parent group supplies bg-card. Avoids a “card in a card”
    // that reads as a narrow inset slab.
    const surface = cn(
      'min-h-[60px] w-full flex-row items-center px-5',
      disabled && 'opacity-50',
      className,
    );

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
