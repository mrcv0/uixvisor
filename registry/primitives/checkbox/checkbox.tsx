// UIXVISOR — https://uixvisor.dev/primitives/checkbox
import { forwardRef, type ComponentRef } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';

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
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={() => onCheckedChange(!checked)}
        accessibilityRole="checkbox"
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
            'h-5 w-5 items-center justify-center rounded-md border',
            checked ? 'border-primary bg-primary' : 'border-input bg-background',
          )}
        >
          {checked ? <Text className="text-xs font-bold text-primary-foreground">✓</Text> : null}
        </View>
        {label ? <Text className="text-base text-foreground">{label}</Text> : null}
      </Pressable>
    );
  },
);

Checkbox.displayName = 'Checkbox';
