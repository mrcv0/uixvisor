// UIXVISOR — https://uixvisor.dev/primitives/input
import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export interface InputProps extends Omit<TextInputProps, 'editable'> {
  label?: string;
  /** Shown under the field; also exposed via accessibilityHint. */
  error?: string;
  /** Helper text when there is no error. */
  hint?: string;
  /** Convenience alias for `editable={false}`. */
  disabled?: boolean;
  /** Rendered inside the field before the text, typically an <Icon />. */
  startIcon?: ReactNode;
  /** Rendered inside the field after the text, typically a pressable <Icon />. */
  endIcon?: ReactNode;
  /**
   * Styles the bordered shell (height, border, padding).
   * Prefer `containerClassName`; `className` is kept as an alias.
   */
  className?: string;
  containerClassName?: string;
  /** Styles the inner TextInput (font, colour). */
  inputClassName?: string;
  editable?: boolean;
}

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  (
    {
      label,
      error,
      hint,
      disabled,
      startIcon,
      endIcon,
      editable = true,
      className,
      containerClassName,
      inputClassName,
      onFocus,
      onBlur,
      accessibilityLabel,
      accessibilityHint,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isDisabled = disabled || !editable;
    // placeholderTextColor is a native prop and cannot take a class.
    const placeholderColor = useThemeColor('muted-foreground');
    const a11yLabel = accessibilityLabel ?? label;
    const a11yHint = accessibilityHint ?? error ?? hint;

    return (
      <View className="w-full gap-1.5">
        {label ? (
          <Text size="sm" weight="medium">
            {label}
          </Text>
        ) : null}
        <View
          className={cn(
            'h-12 flex-row items-center gap-2 rounded-md border bg-background px-4',
            error ? 'border-destructive' : isFocused ? 'border-ring' : 'border-input',
            isDisabled && 'opacity-50',
            className,
            containerClassName,
          )}
        >
          {startIcon}
          <TextInput
            ref={ref}
            editable={!isDisabled}
            placeholderTextColor={placeholderColor}
            accessibilityLabel={a11yLabel}
            accessibilityHint={a11yHint}
            accessibilityState={{ disabled: isDisabled }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            className={cn('h-full flex-1 font-sans text-base text-foreground', inputClassName)}
            {...props}
          />
          {endIcon}
        </View>
        {error ? (
          <Text variant="destructive" size="sm" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : hint ? (
          <Text variant="muted" size="sm">
            {hint}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';
