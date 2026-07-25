// UIXVISOR — https://uixvisor.dev/primitives/theme
//
// shadcn's interaction language is built on hover, which does not exist on
// touch devices, so press feedback is defined from scratch here: a slight scale
// down plus an optional haptic tick.
//
// Uses React Native's core Animated rather than Reanimated - this is a two-value
// transition that does not need a worklet, and keeping it dependency-free means
// the primitives work in projects that never configure Reanimated.
import { useCallback, useMemo, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/** Matches `motion.pressScale` / `motion.duration` in @uixvisor/tokens. */
const PRESS_SCALE = 0.97;
const DURATION_IN = 120;
const DURATION_OUT = 180;

export type HapticStyle = 'none' | 'selection' | 'impact';

export interface PressFeedbackOptions {
  /** Set false for list rows and text links, which shift colour but must not move. */
  scale?: boolean;
  /**
   * Reserved for primary actions and destructive confirmations. Firing on every
   * pressable is noisy and quickly reads as a gimmick.
   */
  haptic?: HapticStyle;
  disabled?: boolean;
}

/**
 * Haptics are a no-op on web and can reject on devices without a taptic engine;
 * either way a failed tick must never surface as an unhandled rejection.
 */
function fireHaptic(style: HapticStyle): void {
  if (style === 'none' || Platform.OS === 'web') {
    return;
  }
  const run =
    style === 'selection'
      ? Haptics.selectionAsync()
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  void run.catch(() => undefined);
}

export function usePressFeedback(options: PressFeedbackOptions = {}) {
  const { scale = true, haptic = 'none', disabled = false } = options;
  const value = useRef(new Animated.Value(1)).current;

  const animate = useCallback(
    (to: number, duration: number) => {
      Animated.timing(value, {
        toValue: to,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [value],
  );

  const onPressIn = useCallback(() => {
    if (disabled) {
      return;
    }
    fireHaptic(haptic);
    if (scale) {
      animate(PRESS_SCALE, DURATION_IN);
    }
  }, [animate, disabled, haptic, scale]);

  const onPressOut = useCallback(() => {
    if (disabled || !scale) {
      return;
    }
    animate(1, DURATION_OUT);
  }, [animate, disabled, scale]);

  const style = useMemo(
    () => (scale ? { transform: [{ scale: value }] } : undefined),
    [scale, value],
  );

  return { onPressIn, onPressOut, style };
}
