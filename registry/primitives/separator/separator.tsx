// UIXVISOR — https://uixvisor.dev/primitives/separator
import { forwardRef, type ComponentRef } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { cn } from '@registry/theme/cn';

type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends ViewProps {
  orientation?: SeparatorOrientation;
  /**
   * Use the platform hairline (thinner than 1px on high-DPI screens).
   * Defaults to false so className height/width utilities stay predictable.
   */
  hairline?: boolean;
  className?: string;
}

export const Separator = forwardRef<ComponentRef<typeof View>, SeparatorProps>(
  ({ orientation = 'horizontal', hairline = false, className, style, ...props }, ref) => {
    const hairlineStyle =
      hairline && orientation === 'horizontal'
        ? { height: StyleSheet.hairlineWidth }
        : hairline && orientation === 'vertical'
          ? { width: StyleSheet.hairlineWidth }
          : undefined;

    return (
      <View
        ref={ref}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[hairlineStyle, style]}
        className={cn(
          'bg-border',
          // Vertical needs a parent with defined height (e.g. flex-row h-12).
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = 'Separator';
