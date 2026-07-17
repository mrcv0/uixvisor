// UIXVISOR — https://uixvisor.dev/primitives/radio-group
import { createContext, forwardRef, useContext, type ComponentRef } from 'react';
import { Pressable, Text, View, type PressableProps, type ViewProps } from 'react-native';

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export interface RadioGroupProps extends ViewProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<ComponentRef<typeof View>, RadioGroupProps>(
  ({ value, onValueChange, disabled, className, children, ...props }, ref) => (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View ref={ref} accessibilityRole="radiogroup" className={cn('gap-2', className)} {...props}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  ),
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends Omit<PressableProps, 'onPress' | 'children'> {
  value: string;
  label?: string;
  className?: string;
}

export const RadioGroupItem = forwardRef<ComponentRef<typeof Pressable>, RadioGroupItemProps>(
  ({ value, label, className, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup');
    }
    const { value: selectedValue, onValueChange, disabled } = context;
    const checked = selectedValue === value;

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={() => onValueChange(value)}
        accessibilityRole="radio"
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        accessibilityLabel={label}
        className={cn(
          'min-h-[44px] flex-row items-center gap-2',
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
        {label ? <Text className="text-base text-foreground">{label}</Text> : null}
      </Pressable>
    );
  },
);

RadioGroupItem.displayName = 'RadioGroupItem';
