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

import { DocIntro } from '../shell/DocSection';

/**
 * Mobile demos intentionally avoid DocSection card frames.
 * Device behaviours must read at full width, as they would in a real screen.
 */

export function OtpInputDemo() {
  const [otp, setOtp] = useState('');
  return (
    <View className="w-full gap-4">
      <DocIntro
        title="OTP input"
        description="Digit cells for one-time codes. Controlled value from the parent."
      />
      <OTPInput value={otp} onChangeText={setOtp} />
      <Text size="xs" variant="muted">
        Value: {otp.length > 0 ? otp : '—'}
      </Text>
    </View>
  );
}

export function SearchBarDemo() {
  const [query, setQuery] = useState('');
  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Search bar"
        description="Query field with clear control. Full width, like a list header."
      />
      <SearchBar value={query} onChangeText={setQuery} />
    </View>
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Toast"
        description="Fires over the whole app, above the safe area — not inside a card. Tap a variant."
      />
      <View className="w-full gap-2">
        <Button className="w-full" onPress={() => toast.show('Saved successfully')}>
          Default
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onPress={() => toast.show('Payment confirmed', 'success')}
        >
          Success
        </Button>
        <Button
          className="w-full"
          variant="destructive"
          onPress={() => toast.show('Something went wrong', 'destructive')}
        >
          Destructive
        </Button>
      </View>
    </View>
  );
}

export function EmptyStateDemo() {
  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Empty state"
        description="How a blank list or search looks on a real screen."
      />
      <EmptyState
        title="No results"
        description="Try adjusting your search or filters."
        action={
          <Button variant="outline" size="sm" onPress={() => {}}>
            Clear filters
          </Button>
        }
      />
    </View>
  );
}

export function ErrorStateDemo() {
  const toast = useToast();
  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Error state"
        description="Recoverable failure. Retry is wired to a toast in this demo."
      />
      <ErrorState
        title="Could not load invoices"
        description="Check your connection and try again."
        onRetry={() => toast.show('Retrying…')}
      />
    </View>
  );
}

export function BottomSheetDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Bottom sheet"
        description="Overlays the full window — not framed in a card. Open it to see real edge-to-edge behaviour."
      />
      <Button className="w-full" variant="secondary" onPress={() => setVisible(true)}>
        Open bottom sheet
      </Button>
      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <View className="gap-3">
          <Heading level={4}>Sheet title</Heading>
          <Text variant="muted" size="sm">
            Sheet content. Keep short actions here; tall forms belong on a full screen.
          </Text>
          <Button className="w-full" onPress={() => setVisible(false)}>
            Close
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}

export function SwipeableRowDemo() {
  const toast = useToast();
  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Swipeable row"
        description="Edge-to-edge list rows. Swipe left to reveal delete."
      />
      <View className="w-full gap-2">
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
    </View>
  );
}

export function KeyboardAwareFormDemo() {
  const [formVisible, setFormVisible] = useState(false);
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="w-full gap-4">
      <DocIntro
        title="Keyboard-aware form"
        description="Opens as a full screen so keyboard behaviour is real — not nested in a card scroll."
      />
      <Button className="w-full" variant="secondary" onPress={() => setFormVisible(true)}>
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
              className="w-full"
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
