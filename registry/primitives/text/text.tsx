// UIXVISOR — https://uixvisor.dev/primitives/text
import { forwardRef, type ComponentRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type TextVariant = 'default' | 'muted' | 'destructive';
type TextSize = 'xs' | 'sm' | 'base' | 'lg';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

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
};

const sizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
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

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

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
