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
    <Swipeable
      ref={ref}
      renderRightActions={renderRightActions}
      // Without this the row keeps travelling past the action panel and the
      // panel stretches to fill the gap, which leaves the delete button
      // off-centre and its edges torn. Capping the drag at the action width
      // keeps the open state identical no matter how hard the row is flung.
      overshootRight={false}
      overshootLeft={false}
      // Slightly heavier than the default 1 so the row does not fly open on a
      // flick; the action still opens well before the finger leaves the screen.
      friction={1.5}
      rightThreshold={40}
    >
      {children}
    </Swipeable>
  ),
);

SwipeableNative.displayName = 'SwipeableNative';
