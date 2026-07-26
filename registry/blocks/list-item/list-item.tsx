// UIXVISOR — https://uixvisor.dev/blocks/list-item
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';

export interface ListItemProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
}

export const ListItem = forwardRef<ComponentRef<typeof Pressable>, ListItemProps>(
  ({ title, description, leading, trailing, onPress, disabled, accessibilityLabel, ...props }, ref) => (
    <Pressable
      ref={ref}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: Boolean(disabled) }}
      className="min-h-[56px] flex-row items-center gap-3 rounded-md bg-card px-4 active:bg-accent dark:border dark:border-border"
      {...props}
    >
      {leading ? <View className="items-center justify-center">{leading}</View> : null}
      <View className="flex-1 gap-0.5 py-3">
        <Text className="text-sm font-medium text-foreground">{title}</Text>
        {description ? (
          <Text className="text-xs text-muted-foreground">{description}</Text>
        ) : null}
      </View>
      {trailing ? <View className="items-center justify-center">{trailing}</View> : null}
    </Pressable>
  ),
);
ListItem.displayName = 'ListItem';
