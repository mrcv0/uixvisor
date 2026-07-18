/** @jsxImportSource react */
// Isolated from NativeWind's JSX transform on purpose: NativeWind's babel
// plugin wrapping react-native-gesture-handler's native view components
// breaks their native view resolution (known upstream friction, see
// nativewind/nativewind#1570). This pragma opts this file out of that
// transform so Swipeable is created via plain React.createElement.
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import type { Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export interface SwipeableNativeProps {
  children: ReactNode;
  renderRightActions?: (progress: Animated.AnimatedInterpolation<number>) => ReactNode;
}

export const SwipeableNative = forwardRef<ComponentRef<typeof Swipeable>, SwipeableNativeProps>(
  ({ children, renderRightActions }, ref) => (
    <Swipeable ref={ref} renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  ),
);

SwipeableNative.displayName = 'SwipeableNative';
