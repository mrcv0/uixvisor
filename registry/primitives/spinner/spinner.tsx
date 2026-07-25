// UIXVISOR — https://uixvisor.dev/primitives/spinner
import { forwardRef, type ComponentRef } from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

type SpinnerSize = 'sm' | 'lg';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'size'> {
  size?: SpinnerSize;
}

const sizeMap: Record<SpinnerSize, 'small' | 'large'> = {
  sm: 'small',
  lg: 'large',
};

export const Spinner = forwardRef<ComponentRef<typeof ActivityIndicator>, SpinnerProps>(
  ({ size = 'sm', color, accessibilityLabel = 'Loading', ...props }, ref) => (
    <ActivityIndicator
      ref={ref}
      size={sizeMap[size]}
      color={color ?? '#2563eb'}
      accessibilityLabel={accessibilityLabel}
      {...props}
    />
  ),
);

Spinner.displayName = 'Spinner';
