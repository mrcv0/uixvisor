// UIXVISOR — https://uixvisor.dev/primitives/input
import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useThemeColor } from '@registry/theme/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Rendered inside the field before the text, typically an <Icon />. */
  startIcon?: ReactNode;
  /** Rendered inside the field after the text, typically a pressable <Icon />. */
  endIcon?: ReactNode;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  (
    { label, error, startIcon, endIcon, editable = true, className, onFocus, onBlur, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isDisabled = !editable;
    // placeholderTextColor is a native prop and cannot take a class.
    const placeholderColor = useThemeColor('muted-foreground');

    return (
      <View className="gap-1.5">
        {label ? <Text className="font-medium text-sm text-foreground">{label}</Text> : null}
        <View
          className={cn(
            'h-12 flex-row items-center gap-2 rounded-md border bg-background px-4',
            error ? 'border-destructive' : isFocused ? 'border-ring' : 'border-input',
            isDisabled && 'opacity-50',
            className,
          )}
        >
          {startIcon}
          <TextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={placeholderColor}
            accessibilityLabel={label}
            accessibilityState={{ disabled: isDisabled }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            className="h-full flex-1 font-sans text-base text-foreground"
            {...props}
          />
          {endIcon}
        </View>
        {error ? (
          <Text accessibilityLiveRegion="polite" className="text-sm text-destructive">
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';
