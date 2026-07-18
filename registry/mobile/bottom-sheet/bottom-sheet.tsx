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
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close"
        className="flex-1 justify-end bg-black/40"
      >
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Pressable onPress={() => {}}>
            <View className={cn('gap-3 rounded-t-2xl bg-surface-elevated p-4', className)}>
              <View className="h-1 w-10 self-center rounded-full bg-border" />
              {children}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
