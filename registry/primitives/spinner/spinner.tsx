// UIXVISOR — https://uixvisor.dev/primitives/spinner
import { forwardRef, type ComponentRef } from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

import { useThemeColor } from '@registry/theme/theme';

type SpinnerSize = 'sm' | 'lg';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'size'> {
  size?: SpinnerSize;
}

const sizeMap: Record<SpinnerSize, 'small' | 'large'> = {
  sm: 'small',
  lg: 'large',
};

export const Spinner = forwardRef<ComponentRef<typeof ActivityIndicator>, SpinnerProps>(
  ({ size = 'sm', color, accessibilityLabel = 'Loading', ...props }, ref) => {
    // ActivityIndicator takes a native colour prop and cannot use a class.
    const defaultColor = useThemeColor('foreground');

    return (
      <ActivityIndicator
        ref={ref}
        size={sizeMap[size]}
        color={color ?? defaultColor}
        accessibilityLabel={accessibilityLabel}
        {...props}
      />
    );
  },
);

Spinner.displayName = 'Spinner';
