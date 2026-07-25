// UIXVISOR — https://uixvisor.dev/blocks/button-group
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

export interface ButtonGroupProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export const ButtonGroup = forwardRef<ComponentRef<typeof View>, ButtonGroupProps>(
  ({ children, className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityRole="group"
      className={`flex-row flex-wrap gap-2${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </View>
  ),
);
ButtonGroup.displayName = 'ButtonGroup';
