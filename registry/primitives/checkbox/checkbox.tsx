// UIXVISOR — https://uixvisor.dev/primitives/checkbox
import { forwardRef, type ComponentRef } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';

import { Icon } from '@registry/icon/icon';
import { useThemeColor } from '@registry/theme/theme';
import { usePressFeedback } from '@registry/theme/press-feedback';

export interface CheckboxProps extends Omit<PressableProps, 'onPress' | 'children'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Checkbox = forwardRef<ComponentRef<typeof Pressable>, CheckboxProps>(
  ({ checked, onCheckedChange, label, disabled, className, ...props }, ref) => {
    const checkColor = useThemeColor('primary-foreground');
    // The row must not move when pressed; a selection tick is the right weight
    // of feedback for a toggle.
    const feedback = usePressFeedback({
      scale: false,
      haptic: 'selection',
      disabled: Boolean(disabled),
    });

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={() => onCheckedChange(!checked)}
        onPressIn={feedback.onPressIn}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        accessibilityLabel={label}
        className={cn('h-12 flex-row items-center gap-3', disabled && 'opacity-50', className)}
        {...props}
      >
        <View
          className={cn(
            'h-5 w-5 items-center justify-center rounded-sm border',
            checked ? 'border-primary bg-primary' : 'border-input bg-background',
          )}
        >
          {checked ? <Icon name="check" size={14} color={checkColor} weight="bold" /> : null}
        </View>
        {label ? <Text className="text-base text-foreground">{label}</Text> : null}
      </Pressable>
    );
  },
);

Checkbox.displayName = 'Checkbox';
