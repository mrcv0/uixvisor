// UIXVISOR — https://uixvisor.dev/primitives/card
import { forwardRef, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { Heading } from '@registry/heading/heading';
import { Text, type TextProps } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useElevation, type ElevationLevel } from '@registry/theme/theme';

export interface CardProps extends ViewProps {
  className?: string;
  /**
   * Shadow/elevation level in light mode. Dark mode still drops shadows and
   * relies on surface colour + border. Pass `surface` for a flat card.
   */
  elevation?: ElevationLevel;
}

export const Card = forwardRef<ComponentRef<typeof View>, CardProps>(
  ({ className, style, elevation: elevationLevel = 'raised', ...props }, ref) => {
    // Light mode lifts the card with a soft shadow; dark mode drops the shadow
    // and relies on the lighter `card` colour, because shadows do not read on a
    // dark background. The hairline border is present in both modes: it is what
    // keeps the edge crisp when a platform renders the shadow more faintly than
    // intended.
    const elevation = useElevation(elevationLevel);

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

export interface CardSectionProps extends ViewProps {
  className?: string;
}

export const CardHeader = forwardRef<ComponentRef<typeof View>, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('gap-1', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<ComponentRef<typeof View>, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('gap-2', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<ComponentRef<typeof View>, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('flex-row items-center gap-2', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export interface CardTitleProps extends Omit<TextProps, 'size' | 'weight' | 'variant'> {
  className?: string;
}

export const CardTitle = forwardRef<ComponentRef<typeof Heading>, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <Heading ref={ref} level={4} className={className} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends Omit<TextProps, 'size' | 'variant'> {
  className?: string;
}

export const CardDescription = forwardRef<ComponentRef<typeof Text>, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} size="sm" variant="muted" className={className} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';
