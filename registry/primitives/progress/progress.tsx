// UIXVISOR — https://uixvisor.dev/primitives/progress
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  View,
  type ViewProps,
} from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

type ProgressVariant = 'default' | 'success' | 'destructive';
type ProgressSize = 'sm' | 'default' | 'lg';

export interface ProgressProps extends ViewProps {
  /**
   * 0–100 fill amount. Ignored when `indeterminate` is true.
   */
  value?: number;
  /** Animated sliding indicator with no specific value. */
  indeterminate?: boolean;
  variant?: ProgressVariant;
  size?: ProgressSize;
  /** Renders a percentage label above the track. */
  showValueLabel?: boolean;
  className?: string;
}

const fillStyles: Record<ProgressVariant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  destructive: 'bg-destructive',
};

const trackHeights: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  default: 'h-2',
  lg: 'h-3',
};

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

export const Progress = forwardRef<ComponentRef<typeof View>, ProgressProps>(
  (
    {
      value = 0,
      indeterminate = false,
      variant = 'default',
      size = 'default',
      showValueLabel = false,
      className,
      ...props
    },
    ref,
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const reduceMotion = useReduceMotion();
    const [trackWidth, setTrackWidth] = useState(0);
    const slide = useRef(new Animated.Value(0)).current;
    const widthAnim = useRef(new Animated.Value(clamped)).current;

    useEffect(() => {
      if (indeterminate) {
        if (reduceMotion === false && trackWidth > 0) {
          slide.setValue(0);
          const loop = Animated.loop(
            Animated.timing(slide, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          );
          loop.start();
          return () => loop.stop();
        }
        slide.setValue(0);
        return;
      }

      if (reduceMotion === false) {
        Animated.timing(widthAnim, {
          toValue: clamped,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      } else {
        widthAnim.setValue(clamped);
      }
    }, [clamped, indeterminate, reduceMotion, slide, trackWidth, widthAnim]);

    const fillWidth = widthAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    const barWidth = Math.max(trackWidth * 0.35, 24);
    const indeterminateTranslate = slide.interpolate({
      inputRange: [0, 1],
      outputRange: [-barWidth, trackWidth],
    });

    return (
      <View ref={ref} className={cn('w-full gap-1.5', className)} {...props}>
        {showValueLabel && !indeterminate ? (
          <Text size="xs" variant="muted" className="self-end">
            {Math.round(clamped)}%
          </Text>
        ) : null}
        <View
          accessibilityRole="progressbar"
          accessibilityValue={
            indeterminate
              ? { min: 0, max: 100, text: 'Loading' }
              : { min: 0, max: 100, now: clamped }
          }
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          className={cn(
            'w-full overflow-hidden rounded-full bg-muted',
            trackHeights[size],
          )}
        >
          {indeterminate ? (
            <Animated.View
              className={cn('h-full rounded-full', fillStyles[variant])}
              style={{
                width: barWidth,
                transform: [{ translateX: indeterminateTranslate }],
              }}
            />
          ) : (
            <Animated.View
              className={cn('h-full rounded-full', fillStyles[variant])}
              style={{ width: fillWidth }}
            />
          )}
        </View>
      </View>
    );
  },
);

Progress.displayName = 'Progress';
