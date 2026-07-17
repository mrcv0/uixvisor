// UIXVISOR — https://uixvisor.dev/primitives/card
import { forwardRef, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Card = forwardRef<ComponentRef<typeof View>, CardProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('gap-3 rounded-xl border border-border bg-surface-elevated p-4', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<ComponentRef<typeof View>, CardProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('gap-1', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<ComponentRef<typeof View>, CardProps>(
  ({ className, ...props }, ref) => <View ref={ref} className={cn('gap-2', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<ComponentRef<typeof View>, CardProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('flex-row items-center gap-2', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';
