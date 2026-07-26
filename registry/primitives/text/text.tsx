// UIXVISOR — https://uixvisor.dev/primitives/text
import { forwardRef, type ComponentRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@registry/theme/cn';

export type TextVariant = 'default' | 'muted' | 'destructive' | 'success' | 'warning';
/** Full type ramp — headings reuse the upper steps. */
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
};

const sizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

// Weights select a font family rather than a numeric weight: React Native on
// Android cannot synthesise weights for a custom font, so each weight ships as
// its own registered family.
const weightStyles: Record<TextWeight, string> = {
  regular: 'font-sans',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Text = forwardRef<ComponentRef<typeof RNText>, TextProps>(
  ({ variant = 'default', size = 'base', weight = 'regular', className, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={cn(
          variantStyles[variant],
          sizeStyles[size],
          weightStyles[weight],
          className,
        )}
        {...props}
      />
    );
  },
);

Text.displayName = 'Text';
