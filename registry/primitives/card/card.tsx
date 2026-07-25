// UIXVISOR — https://uixvisor.dev/primitives/card
import { forwardRef, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { useElevation } from '@registry/theme/theme';

export interface CardProps extends ViewProps {
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Card = forwardRef<ComponentRef<typeof View>, CardProps>(
  ({ className, style, ...props }, ref) => {
    // Light mode lifts the card with a soft shadow; dark mode drops the shadow
    // and relies on the lighter `card` colour, because shadows do not read on a
    // dark background. The hairline border is present in both modes: it is what
    // keeps the edge crisp when a platform renders the shadow more faintly than
    // intended.
    const elevation = useElevation('raised');

    return (
      <View
        ref={ref}
        style={[elevation, style]}
        className={cn('gap-3 rounded-md border border-border bg-card p-4', className)}
        {...props}
      />
    );
  },
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
