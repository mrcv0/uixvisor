// UIXVISOR — https://uixvisor.dev/primitives/text
import { forwardRef, type ComponentRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type TextVariant = 'default' | 'muted' | 'destructive';
type TextSize = 'sm' | 'base' | 'lg';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  size?: TextSize;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
};

const sizeStyles: Record<TextSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Text = forwardRef<ComponentRef<typeof RNText>, TextProps>(
  ({ variant = 'default', size = 'base', className, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={cn(variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  },
);

Text.displayName = 'Text';
