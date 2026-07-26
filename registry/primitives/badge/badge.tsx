// UIXVISOR — https://uixvisor.dev/primitives/badge
import { forwardRef, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { cn } from '@registry/theme/cn';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning';
type BadgeAppearance = 'solid' | 'soft';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  /** Solid fills the surface; soft uses a tinted background + coloured label. */
  appearance?: BadgeAppearance;
  children: string;
  className?: string;
}

const solidStyles: Record<BadgeVariant, { container: string; text: string }> = {
  default: { container: 'bg-primary', text: 'text-primary-foreground' },
  secondary: { container: 'bg-secondary', text: 'text-secondary-foreground' },
  destructive: { container: 'bg-destructive', text: 'text-destructive-foreground' },
  // Success/warning have no dedicated on-colour tokens; white reads on both.
  success: { container: 'bg-success', text: 'text-white' },
  warning: { container: 'bg-warning', text: 'text-white' },
};

const softStyles: Record<BadgeVariant, { container: string; text: string }> = {
  default: { container: 'bg-primary/10', text: 'text-foreground' },
  secondary: { container: 'bg-secondary', text: 'text-secondary-foreground' },
  destructive: { container: 'bg-destructive/10', text: 'text-destructive' },
  success: { container: 'bg-success/15', text: 'text-success' },
  warning: { container: 'bg-warning/15', text: 'text-warning' },
};

export const Badge = forwardRef<ComponentRef<typeof View>, BadgeProps>(
  ({ variant = 'default', appearance = 'solid', children, className, ...props }, ref) => {
    const table = appearance === 'soft' ? softStyles : solidStyles;
    const styles = table[variant] ?? table.default;

    return (
      <View
        ref={ref}
        accessibilityRole="text"
        className={cn('self-start rounded-full px-2.5 py-0.5', styles.container, className)}
        {...props}
      >
        {/* Raw RN Text so badge colours are not overridden by Text's default variant. */}
        <Text className={cn('text-xs font-medium', styles.text)}>{children}</Text>
      </View>
    );
  },
);

Badge.displayName = 'Badge';
