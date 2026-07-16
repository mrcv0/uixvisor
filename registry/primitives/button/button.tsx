// UIXVISOR — https://uixvisor.dev/primitives/button
import { forwardRef, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string; spinnerColor: string }
> = {
  primary: {
    container: 'bg-primary active:opacity-80',
    text: 'text-primary-foreground',
    spinnerColor: '#ffffff',
  },
  secondary: {
    container: 'border border-border bg-secondary active:opacity-80',
    text: 'text-secondary-foreground',
    spinnerColor: '#64748b',
  },
  destructive: {
    container: 'bg-destructive active:opacity-80',
    text: 'text-primary-foreground',
    spinnerColor: '#ffffff',
  },
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  ({ children, variant = 'primary', loading = false, disabled, className, ...props }, ref) => {
    const isDisabled = disabled || loading;
    const styles = variantStyles[variant];

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        className={cn(
          'min-h-[44px] flex-row items-center justify-center rounded-xl px-4',
          styles.container,
          isDisabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={styles.spinnerColor} />
        ) : (
          <Text className={cn('text-base font-medium', styles.text)}>{children}</Text>
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
