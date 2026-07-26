// UIXVISOR — https://uixvisor.dev/primitives/checkbox
import { forwardRef, type ComponentRef } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { Icon } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { composePressHandlers, usePressFeedback } from '@registry/theme/press-feedback';
import { useThemeColor } from '@registry/theme/theme';

export interface CheckboxProps extends Omit<PressableProps, 'onPress' | 'children'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /**
   * Mixed state for "select some" trees. Takes visual priority over `checked`
   * and reports `accessibilityState.checked = 'mixed'`.
   */
  indeterminate?: boolean;
  label?: string;
  className?: string;
}

export const Checkbox = forwardRef<ComponentRef<typeof Pressable>, CheckboxProps>(
  (
    {
      checked,
      onCheckedChange,
      indeterminate = false,
      label,
      disabled,
      className,
      onPressIn,
      onPressOut,
      accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const checkColor = useThemeColor('primary-foreground');
    // The row must not move when pressed; a selection tick is the right weight
    // of feedback for a toggle.
    const feedback = usePressFeedback({
      scale: false,
      haptic: 'selection',
      disabled: Boolean(disabled),
    });
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    const isOn = indeterminate || checked;
    const a11yChecked = indeterminate ? ('mixed' as const) : checked;

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={() => {
          if (indeterminate) {
            onCheckedChange(true);
            return;
          }
          onCheckedChange(!checked);
        }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: a11yChecked, disabled: Boolean(disabled) }}
        accessibilityLabel={accessibilityLabel ?? label}
        // min-w-12 keeps a 48pt hit area when there is no label text.
        className={cn(
          'min-h-12 min-w-12 flex-row items-center gap-3',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        <View
          className={cn(
            'h-5 w-5 items-center justify-center rounded-sm border',
            isOn ? 'border-primary bg-primary' : 'border-input bg-background',
          )}
        >
          {indeterminate ? (
            <Icon name="minus" size={14} color={checkColor} weight="bold" />
          ) : checked ? (
            <Icon name="check" size={14} color={checkColor} weight="bold" />
          ) : null}
        </View>
        {label ? (
          <Text size="base" className="flex-1">
            {label}
          </Text>
        ) : null}
      </Pressable>
    );
  },
);

Checkbox.displayName = 'Checkbox';
