// UIXVISOR — https://uixvisor.dev/mobile/swipeable-row
// Uses the classic (non-Reanimated) Swipeable from react-native-gesture-handler.
// It is marked deprecated upstream in favor of ReanimatedSwipeable, but is kept
// here deliberately: this project does not configure the Reanimated babel
// plugin, and the classic implementation needs no extra setup. The actual
// <Swipeable> element lives in ./swipeable-native, isolated from NativeWind's
// JSX transform (see the comment there) - keep that split when editing.
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Icon } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { useThemeColor } from '@registry/theme/theme';
import { SwipeableNative } from './swipeable-native';

const ACTION_WIDTH = 88;

export interface SwipeableRowProps {
  children: ReactNode;
  onDelete?: () => void;
  /** Label under the delete icon. */
  deleteLabel?: string;
  /** Applied to the row content, not the container. */
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const SwipeableRow = forwardRef<ComponentRef<typeof SwipeableNative>, SwipeableRowProps>(
  ({ children, onDelete, deleteLabel = 'Delete', className }, ref) => {
    const onDestructive = useThemeColor('destructive-foreground');

    const renderRightActions = onDelete
      ? (progress: Animated.AnimatedInterpolation<number>) => {
          const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [ACTION_WIDTH, 0],
            // Progress exceeds 1 while the row is still settling. Without
            // clamping, the panel slides past its resting position and opens a
            // gap along the right edge.
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={{ transform: [{ translateX }], width: ACTION_WIDTH }}>
              <Pressable
                onPress={onDelete}
                accessibilityRole="button"
                accessibilityLabel={deleteLabel}
                className="flex-1 items-center justify-center gap-1 bg-destructive active:bg-destructive/90"
              >
                <Icon name="trash" size={20} color={onDestructive} />
                <Text size="xs" weight="medium" className="text-destructive-foreground">
                  {deleteLabel}
                </Text>
              </Pressable>
            </Animated.View>
          );
        }
      : undefined;

    return (
      // The container owns the radius and clips its children, so the action
      // panel is cut to the same corners as the row instead of sitting behind it
      // as a square block.
      <View className="overflow-hidden rounded-md border border-border bg-card">
        <SwipeableNative ref={ref} renderRightActions={renderRightActions}>
          <View className={cn('bg-card px-4 py-3', className)}>{children}</View>
        </SwipeableNative>
      </View>
    );
  },
);

SwipeableRow.displayName = 'SwipeableRow';
