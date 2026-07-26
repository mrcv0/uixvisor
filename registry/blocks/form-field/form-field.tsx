// UIXVISOR — https://uixvisor.dev/blocks/form-field
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';

export interface FormFieldProps extends ViewProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const FormField = forwardRef<ComponentRef<typeof View>, FormFieldProps>(
  ({ label, hint, error, children, className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityLabel={label}
      className={`gap-1.5${className ? ` ${className}` : ''}`}
      {...props}
    >
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      {children}
      {hint && !error ? <Text className="text-xs text-muted-foreground">{hint}</Text> : null}
      {error ? (
        <Text accessibilityLiveRegion="polite" className="text-xs text-destructive">
          {error}
        </Text>
      ) : null}
    </View>
  ),
);
FormField.displayName = 'FormField';
