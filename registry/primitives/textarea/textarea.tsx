// UIXVISOR — https://uixvisor.dev/primitives/textarea
import { forwardRef, useState, type ComponentRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  rows?: number;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Textarea = forwardRef<ComponentRef<typeof TextInput>, TextareaProps>(
  ({ label, error, rows = 4, editable = true, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const isDisabled = !editable;

    return (
      <View className="gap-1.5">
        {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
        <TextInput
          ref={ref}
          multiline
          numberOfLines={rows}
          textAlignVertical="top"
          editable={editable}
          placeholderTextColor="#94a3b8"
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
          className={cn(
            'min-h-[88px] rounded-xl border bg-background px-4 py-3 text-base text-foreground',
            error ? 'border-destructive' : isFocused ? 'border-ring' : 'border-input',
            isDisabled && 'opacity-50',
            className,
          )}
          {...props}
        />
        {error ? (
          <Text accessibilityLiveRegion="polite" className="text-sm text-destructive">
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

Textarea.displayName = 'Textarea';
