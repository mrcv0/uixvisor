// UIXVISOR — https://uixvisor.dev/primitives/radio-group
import { createContext, forwardRef, useContext, type ComponentRef } from 'react';
import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { composePressHandlers, usePressFeedback } from '@registry/theme/press-feedback';

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends ViewProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<ComponentRef<typeof View>, RadioGroupProps>(
  ({ value, onValueChange, disabled, className, children, ...props }, ref) => (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View
        ref={ref}
        accessibilityRole="radiogroup"
        className={cn('w-full gap-1', className)}
        {...props}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  ),
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends Omit<PressableProps, 'onPress' | 'children'> {
  value: string;
  label?: string;
  /** Item-level disable; also respects the group `disabled` flag. */
  disabled?: boolean;
  className?: string;
}

export const RadioGroupItem = forwardRef<ComponentRef<typeof Pressable>, RadioGroupItemProps>(
  (
    {
      value,
      label,
      disabled: itemDisabled,
      className,
      onPressIn,
      onPressOut,
      accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup');
    }
    const { value: selectedValue, onValueChange, disabled: groupDisabled } = context;
    const checked = selectedValue === value;
    const disabled = Boolean(groupDisabled || itemDisabled);

    const feedback = usePressFeedback({
      scale: false,
      haptic: 'selection',
      disabled,
    });
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={() => onValueChange(value)}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="radio"
        accessibilityState={{ checked, disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        className={cn(
          'min-h-12 min-w-12 flex-row items-center gap-3',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        <View
          className={cn(
            'h-5 w-5 items-center justify-center rounded-full border',
            checked ? 'border-primary' : 'border-input',
          )}
        >
          {checked ? <View className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
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

RadioGroupItem.displayName = 'RadioGroupItem';
