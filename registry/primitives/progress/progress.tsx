// UIXVISOR — https://uixvisor.dev/primitives/progress
import { forwardRef, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

export interface ProgressProps extends ViewProps {
  value: number;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Progress = forwardRef<ComponentRef<typeof View>, ProgressProps>(
  ({ value, className, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));

    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clamped }}
        className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
        {...props}
      >
        <View className="h-full rounded-full bg-primary" style={{ width: `${clamped}%` }} />
      </View>
    );
  },
);

Progress.displayName = 'Progress';
