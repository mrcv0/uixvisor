// UIXVISOR — https://uixvisor.dev/mobile/bottom-sheet
// A minimal, dependency-free adapter: no @gorhom/bottom-sheet, since that
// library requires react-native-reanimated's babel plugin, which this
// project does not configure. Single snap point, no drag gesture - good
// enough for simple confirm/menu sheets; swap for a gesture-driven library
// later if multi-snap-point dragging is needed.
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const SHEET_OFFSCREEN_OFFSET = 320;

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function BottomSheet({ visible, onClose, children, className }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SHEET_OFFSCREEN_OFFSET)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_OFFSCREEN_OFFSET,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          testID="bottom-sheet-backdrop"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="absolute inset-0 bg-overlay/40"
        />
        <Animated.View
          testID="bottom-sheet"
          accessibilityViewIsModal
          style={{ transform: [{ translateY }] }}
        >
          <View
            className={cn(
              'gap-3 rounded-t-lg bg-sheet p-4 dark:border-t dark:border-border',
              className,
            )}
          >
            <View className="h-1 w-10 self-center rounded-full bg-border" />
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
