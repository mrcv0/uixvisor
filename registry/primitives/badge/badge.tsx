// UIXVISOR — https://uixvisor.dev/primitives/badge
import { forwardRef, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  default: { container: 'bg-primary', text: 'text-primary-foreground' },
  secondary: { container: 'bg-secondary', text: 'text-secondary-foreground' },
  destructive: { container: 'bg-destructive', text: 'text-primary-foreground' },
  success: { container: 'bg-success', text: 'text-primary-foreground' },
  warning: { container: 'bg-warning', text: 'text-primary-foreground' },
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Badge = forwardRef<ComponentRef<typeof View>, BadgeProps>(
  ({ variant = 'default', children, className, ...props }, ref) => {
    const styles = variantStyles[variant];

    return (
      <View
        ref={ref}
        className={cn('self-start rounded-full px-2.5 py-0.5', styles.container, className)}
        {...props}
      >
        <Text className={cn('text-xs font-medium', styles.text)}>{children}</Text>
      </View>
    );
  },
);

Badge.displayName = 'Badge';
