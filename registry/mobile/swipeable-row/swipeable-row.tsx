// UIXVISOR — https://uixvisor.dev/mobile/swipeable-row
// Uses the classic (non-Reanimated) Swipeable from react-native-gesture-handler.
// It is marked deprecated upstream in favor of ReanimatedSwipeable, but is kept
// here deliberately: this project does not configure the Reanimated babel
// plugin, and the classic implementation needs no extra setup. The actual
// <Swipeable> element lives in ./swipeable-native, isolated from NativeWind's
// JSX transform (see the comment there) - keep that split when editing.
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Text } from '@registry/text/text';
import { SwipeableNative } from './swipeable-native';

export interface SwipeableRowProps {
  children: ReactNode;
  onDelete?: () => void;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const SwipeableRow = forwardRef<ComponentRef<typeof SwipeableNative>, SwipeableRowProps>(
  ({ children, onDelete, className }, ref) => {
    const renderRightActions = onDelete
      ? (progress: Animated.AnimatedInterpolation<number>) => {
          const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [96, 0],
          });

          return (
            <Animated.View style={{ transform: [{ translateX }] }} className="w-24">
              <Pressable
                onPress={onDelete}
                accessibilityRole="button"
                accessibilityLabel="Delete"
                className="flex-1 items-center justify-center bg-destructive"
              >
                <Text className="font-medium text-primary-foreground">Delete</Text>
              </Pressable>
            </Animated.View>
          );
        }
      : undefined;

    return (
      <SwipeableNative ref={ref} renderRightActions={renderRightActions}>
        <View className={cn('bg-background', className)}>{children}</View>
      </SwipeableNative>
    );
  },
);

SwipeableRow.displayName = 'SwipeableRow';
