// UIXVISOR — https://uixvisor.dev/blocks/button-group
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@registry/theme/cn';

export interface ButtonGroupProps extends ViewProps {
  children: ReactNode;
  /** Horizontal wrap (default) or a vertical stack of full-width actions. */
  orientation?: 'horizontal' | 'vertical';
  /** Align the group when horizontal. */
  align?: 'start' | 'center' | 'end' | 'between';
  className?: string;
}

const alignClass: Record<NonNullable<ButtonGroupProps['align']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const ButtonGroup = forwardRef<ComponentRef<typeof View>, ButtonGroupProps>(
  ({ children, orientation = 'horizontal', align = 'start', className, ...props }, ref) => (
    <View
      ref={ref}
      accessible
      accessibilityLabel="Button group"
      className={cn(
        orientation === 'vertical' ? 'w-full flex-col gap-2' : 'w-full flex-row flex-wrap gap-2',
        orientation === 'horizontal' && alignClass[align],
        className,
      )}
      {...props}
    >
      {children}
    </View>
  ),
);
ButtonGroup.displayName = 'ButtonGroup';
