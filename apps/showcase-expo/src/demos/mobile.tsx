import { useState } from 'react';
import { Modal, View } from 'react-native';

import { BottomSheet } from '@registry/bottom-sheet/bottom-sheet';
import { Button } from '@registry/button/button';
import { EmptyState } from '@registry/empty-state/empty-state';
import { ErrorState } from '@registry/error-state/error-state';
import { Heading } from '@registry/heading/heading';
import { Icon } from '@registry/icon/icon';
import { Input } from '@registry/input/input';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { OTPInput } from '@registry/otp-input/otp-input';
import { SearchBar } from '@registry/search-bar/search-bar';
import { SwipeableRow } from '@registry/swipeable-row/swipeable-row';
import { Text } from '@registry/text/text';
import { Textarea } from '@registry/textarea/textarea';
import { useThemeColor } from '@registry/theme/theme';
import { useToast } from '@registry/toast/toast';

export function OtpInputDemo() {
  const [otp, setOtp] = useState('');
  return <OTPInput value={otp} onChangeText={setOtp} />;
}

export function SearchBarDemo() {
  const [query, setQuery] = useState('');
  return <SearchBar value={query} onChangeText={setQuery} />;
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <View className="gap-2">
      <Text variant="muted" size="sm">
        Toasts sit above the safe area. Default, success and destructive each
        keep readable contrast in light and dark mode.
      </Text>
      <Button onPress={() => toast.show('Saved successfully')}>Default</Button>
      <Button variant="secondary" onPress={() => toast.show('Payment confirmed', 'success')}>
        Success
      </Button>
      <Button variant="destructive" onPress={() => toast.show('Something went wrong', 'destructive')}>
        Destructive
      </Button>
    </View>
  );
}

export function EmptyStateDemo() {
  return (
    <EmptyState
      title="No results"
      description="Try adjusting your search or filters."
      action={
        <Button variant="outline" size="sm" onPress={() => {}}>
          Clear filters
        </Button>
      }
    />
  );
}

export function ErrorStateDemo() {
  const toast = useToast();
  return <ErrorState onRetry={() => toast.show('Retrying…')} />;
}

export function BottomSheetDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <View className="gap-2">
      <Button variant="secondary" onPress={() => setVisible(true)}>
        Open bottom sheet
      </Button>
      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <Heading level={4}>Sheet title</Heading>
        <Text variant="muted" size="sm">
          Sheet content goes here.
        </Text>
        <Button onPress={() => setVisible(false)}>Close</Button>
      </BottomSheet>
    </View>
  );
}

export function SwipeableRowDemo() {
  const toast = useToast();
  return (
    <View className="gap-2">
      <Text variant="muted" size="sm">
        Swipe left on a row to reveal delete.
      </Text>
      <SwipeableRow onDelete={() => toast.show('Invoice deleted')}>
        <Text weight="medium">Invoice #1042</Text>
        <Text variant="muted" size="sm">
          Due in 3 days
        </Text>
      </SwipeableRow>
      <SwipeableRow onDelete={() => toast.show('Invoice deleted')}>
        <Text weight="medium">Invoice #1041</Text>
        <Text variant="muted" size="sm">
          Paid
        </Text>
      </SwipeableRow>
    </View>
  );
}

export function KeyboardAwareFormDemo() {
  const [formVisible, setFormVisible] = useState(false);
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="gap-2">
      <Text variant="muted" size="sm">
        Opens as its own screen so keyboard behaviour is real — the field list
        scrolls and the focused input stays above the keyboard.
      </Text>
      <Button variant="secondary" onPress={() => setFormVisible(true)}>
        Open form
      </Button>

      <Modal
        visible={formVisible}
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        <View className="flex-1 bg-background">
          <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <Heading level={4}>Shipping details</Heading>
            <Button
              variant="ghost"
              size="icon-sm"
              accessibilityLabel="Close form"
              icon={<Icon name="close" size={20} color={foreground} />}
              onPress={() => setFormVisible(false)}
            />
          </View>
          <KeyboardAwareForm>
            <Input label="Full name" placeholder="Ada Lovelace" />
            <Input label="Address line 1" placeholder="12 Analytical Way" />
            <Input label="Address line 2" placeholder="Apt 4" />
            <Input label="City" placeholder="London" />
            <Input label="Postcode" placeholder="EC1A 1BB" autoCapitalize="characters" />
            <Input label="Phone" placeholder="+44 20 7946 0000" keyboardType="phone-pad" />
            <Textarea label="Delivery notes" placeholder="Leave with the neighbour" />
            <Button
              onPress={() => {
                setFormVisible(false);
                toast.show('Details saved');
              }}
            >
              Save details
            </Button>
          </KeyboardAwareForm>
        </View>
      </Modal>
    </View>
  );
}
