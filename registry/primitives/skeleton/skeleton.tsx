// UIXVISOR — https://uixvisor.dev/primitives/skeleton
import { forwardRef, useEffect, useRef, type ComponentRef } from 'react';
import { Animated, View, type ViewProps } from 'react-native';

export interface SkeletonProps extends ViewProps {
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Skeleton = forwardRef<ComponentRef<typeof View>, SkeletonProps>(
  ({ className, ...props }, ref) => {
    const opacity = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }, [opacity]);

    return (
      <Animated.View
        style={{ opacity }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View ref={ref} className={cn('rounded-lg bg-skeleton', className)} {...props} />
      </Animated.View>
    );
  },
);

Skeleton.displayName = 'Skeleton';
