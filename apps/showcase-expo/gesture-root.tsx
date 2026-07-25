/** @jsxImportSource react */
// Same isolation rationale as registry/mobile/swipeable-row/swipeable-native.tsx:
// GestureHandlerRootView is a native view component, and NativeWind's JSX
// transform wrapping those breaks native view resolution. This pragma opts the
// file out of that transform, so styling here uses a plain style object rather
// than className.
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function GestureRoot({ children }: { children: ReactNode }) {
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
}
