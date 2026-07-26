// UIXVISOR — https://uixvisor.dev/primitives/heading
//
// Built on the Text primitive so display sizes share the same weight families
// and colour tokens as body copy.
import { forwardRef, type ComponentRef } from 'react';

import { Text, type TextProps, type TextSize, type TextWeight } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends Omit<TextProps, 'size' | 'weight' | 'variant'> {
  /** Visual rank 1–4. Defaults to 1 (largest). */
  level?: HeadingLevel;
  className?: string;
}

// Negative tracking for display sizes lives in the Tailwind theme (lg+ steps).
const levelStyles: Record<HeadingLevel, { size: TextSize; weight: TextWeight }> = {
  1: { size: '3xl', weight: 'bold' },
  2: { size: '2xl', weight: 'bold' },
  3: { size: 'xl', weight: 'semibold' },
  4: { size: 'lg', weight: 'semibold' },
};

export const Heading = forwardRef<ComponentRef<typeof Text>, HeadingProps>(
  ({ level = 1, className, ...props }, ref) => {
    const styles = levelStyles[level];

    return (
      <Text
        ref={ref}
        accessibilityRole="header"
        size={styles.size}
        weight={styles.weight}
        variant="default"
        className={cn(className)}
        {...props}
      />
    );
  },
);

Heading.displayName = 'Heading';
