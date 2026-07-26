// UIXVISOR — https://uixvisor.dev/blocks/form-field
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface FormFieldProps extends ViewProps {
  label: string;
  hint?: string;
  error?: string;
  /** Optional mark for required fields (visual only). */
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormField = forwardRef<ComponentRef<typeof View>, FormFieldProps>(
  ({ label, hint, error, required, children, className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityLabel={label}
      className={cn('w-full gap-1.5', className)}
      {...props}
    >
      <View className="flex-row items-center gap-1">
        <Text size="sm" weight="medium">
          {label}
        </Text>
        {required ? (
          <Text size="sm" variant="destructive" accessibilityLabel="required">
            *
          </Text>
        ) : null}
      </View>
      {children}
      {error ? (
        <Text size="xs" variant="destructive" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text size="xs" variant="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  ),
);
FormField.displayName = 'FormField';
