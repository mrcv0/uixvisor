// UIXVISOR — https://uixvisor.dev/primitives/textarea
//
// Same field contract as Input (label / hint / error / disabled / className
// split) so forms can swap single-line and multi-line without relearning props.
import { forwardRef, useState, type ComponentRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export interface TextareaProps extends Omit<TextInputProps, 'editable'> {
  label?: string;
  /** Shown under the field; also exposed via accessibilityHint. */
  error?: string;
  /** Helper text when there is no error. */
  hint?: string;
  /** Convenience alias for `editable={false}`. */
  disabled?: boolean;
  /**
   * Hint for Android's numberOfLines. Height is primarily driven by min-height
   * and content growth on both platforms.
   */
  rows?: number;
  /**
   * Styles the outer stack (gap). Prefer `containerClassName`; `className` is
   * an alias for the bordered field (historical).
   */
  className?: string;
  containerClassName?: string;
  /** Styles the multiline TextInput (border, padding, font). */
  inputClassName?: string;
  editable?: boolean;
}

export const Textarea = forwardRef<ComponentRef<typeof TextInput>, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      disabled,
      rows = 4,
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
      <View className={cn('w-full gap-1.5', containerClassName)}>
        {label ? (
          <Text size="sm" weight="medium">
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          multiline
          numberOfLines={rows}
          textAlignVertical="top"
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
          className={cn(
            'min-h-[96px] rounded-md border bg-background px-4 py-3 font-sans text-base text-foreground',
            error ? 'border-destructive' : isFocused ? 'border-ring' : 'border-input',
            isDisabled && 'opacity-50',
            className,
            inputClassName,
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
