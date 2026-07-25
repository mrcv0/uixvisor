// UIXVISOR — https://uixvisor.dev/primitives/skeleton
import { forwardRef, useEffect, useRef, useState, type ComponentRef } from 'react';
import { AccessibilityInfo, Animated, View, type ViewProps } from 'react-native';

export interface SkeletonProps extends ViewProps {
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Skeleton = forwardRef<ComponentRef<typeof View>, SkeletonProps>(
  ({ className, ...props }, ref) => {
    const opacity = useRef(new Animated.Value(0.7)).current;
    const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

    useEffect(() => {
      let mounted = true;
      void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
        if (mounted) {
          setReduceMotion(enabled);
        }
      });
      const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
      return () => {
        mounted = false;
        subscription.remove();
      };
    }, []);

    useEffect(() => {
      if (reduceMotion !== false) {
        opacity.stopAnimation();
        opacity.setValue(0.7);
        return;
      }

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }, [opacity, reduceMotion]);

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
