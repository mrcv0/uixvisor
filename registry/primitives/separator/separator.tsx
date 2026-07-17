// UIXVISOR — https://uixvisor.dev/primitives/separator
import { forwardRef, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends ViewProps {
  orientation?: SeparatorOrientation;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Separator = forwardRef<ComponentRef<typeof View>, SeparatorProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  ),
);

Separator.displayName = 'Separator';
