// UIXVISOR — https://uixvisor.dev/primitives/skeleton
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import { AccessibilityInfo, Animated, Easing, View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeMode } from '@registry/theme/theme';

export interface SkeletonProps extends ViewProps {
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Reports the platform's reduce-motion preference. Returns null until the first
 * async read resolves, so callers can avoid starting an animation they may
 * immediately have to stop.
 */
function useReduceMotion(): boolean | null {
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

  return reduceMotion;
}

export const Skeleton = forwardRef<ComponentRef<typeof View>, SkeletonProps>(
  ({ className, ...props }, ref) => {
    const progress = useRef(new Animated.Value(0)).current;
    const [width, setWidth] = useState(0);
    const reduceMotion = useReduceMotion();
    const isDark = useThemeMode() === 'dark';

    useEffect(() => {
      if (reduceMotion !== false || width === 0) {
        progress.stopAnimation();
        return;
      }

      const animation = Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: 1400,
          // Linear would make the highlight restart with a visible jolt; easing
          // out lets it decelerate before the loop wraps.
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => animation.stop();
    }, [progress, reduceMotion, width]);

    // The highlight travels a full width past each edge so it enters and leaves
    // completely rather than appearing mid-surface.
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    const highlight = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)';

    return (
      <View
        ref={ref}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={cn('overflow-hidden rounded-sm bg-skeleton', className)}
        {...props}
      >
        {reduceMotion === false && width > 0 ? (
          <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
            <LinearGradient
              colors={['transparent', highlight, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        ) : null}
      </View>
    );
  },
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps {
  /** Number of lines to render. */
  lines?: number;
  className?: string;
}

/**
 * A paragraph placeholder. The final line is short so the block reads as text
 * rather than as a stack of identical bars.
 */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <View className={cn('gap-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 ? 'w-1/2' : 'w-full')}
        />
      ))}
    </View>
  );
}

export interface SkeletonCardProps {
  className?: string;
}

/** Avatar, title and body placeholder matching the shape of a loaded list row. */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <View className={cn('gap-3 rounded-md border border-border bg-card p-4', className)}>
      <View className="flex-row items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </View>
      </View>
      <SkeletonText lines={2} />
    </View>
  );
}
