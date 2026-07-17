// UIXVISOR — https://uixvisor.dev/primitives/heading
import { forwardRef, type ComponentRef } from 'react';
import { Text, type TextProps } from 'react-native';

type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends TextProps {
  level?: HeadingLevel;
  className?: string;
}

const levelStyles: Record<HeadingLevel, string> = {
  1: 'text-3xl font-bold',
  2: 'text-2xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Heading = forwardRef<ComponentRef<typeof Text>, HeadingProps>(
  ({ level = 1, className, ...props }, ref) => (
    <Text
      ref={ref}
      accessibilityRole="header"
      className={cn('text-foreground', levelStyles[level], className)}
      {...props}
    />
  ),
);

Heading.displayName = 'Heading';
