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

import { DocIntro, DocSection } from '../shell/DocSection';

export function OtpInputDemo() {
  const [otp, setOtp] = useState('');
  return (
    <View className="gap-6">
      <DocIntro
        title="OTP input"
        description="Digit cells for one-time codes. Controlled value; optional resend affordance when the parent wires onResend."
      />
      <DocSection title="Default" description="Type or paste a 6-digit code.">
        <OTPInput value={otp} onChangeText={setOtp} />
        <Text size="xs" variant="muted">
          Current value: {otp.length > 0 ? otp : '—'}
        </Text>
      </DocSection>
    </View>
  );
}

export function SearchBarDemo() {
  const [query, setQuery] = useState('');
  return (
    <View className="gap-6">
      <DocIntro
        title="Search bar"
        description="Query field with clear control. Controlled value for filter screens and list headers."
      />
      <DocSection title="Default">
        <SearchBar value={query} onChangeText={setQuery} />
        {query.length > 0 ? (
          <Text size="xs" variant="muted">
            Query: {query}
          </Text>
        ) : null}
      </DocSection>
    </View>
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <View className="gap-6">
      <DocIntro
        title="Toast"
        description="Transient feedback above the safe area. Default is a dark snackbar; success and destructive use status colours. Icon matches the variant."
      />
      <DocSection title="Variants" description="Tap to fire. Stacks briefly at the bottom.">
        <View className="gap-2">
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
      </DocSection>
    </View>
  );
}

export function EmptyStateDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Empty state"
        description="When a list or search has nothing to show. Title, optional description, and an action slot."
      />
      <DocSection title="With action">
        <EmptyState
          title="No results"
          description="Try adjusting your search or filters."
          action={
            <Button variant="outline" size="sm" onPress={() => {}}>
              Clear filters
            </Button>
          }
        />
      </DocSection>
      <DocSection title="Title only">
        <EmptyState title="Nothing here yet" />
      </DocSection>
    </View>
  );
}

export function ErrorStateDemo() {
  const toast = useToast();
  return (
    <View className="gap-6">
      <DocIntro
        title="Error state"
        description="Recoverable failure. Wire onRetry to refetch or navigate back."
      />
      <DocSection title="With retry">
        <ErrorState onRetry={() => toast.show('Retrying…')} />
      </DocSection>
      <DocSection title="Custom copy">
        <ErrorState
          title="Could not load invoices"
          description="Check your connection and try again."
          onRetry={() => toast.show('Retrying…')}
        />
      </DocSection>
    </View>
  );
}

export function BottomSheetDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <View className="gap-6">
      <DocIntro
        title="Bottom sheet"
        description="Modal surface from the bottom edge. Host short actions or confirmations; keep tall forms in a full screen."
      />
      <DocSection title="Open" description="Dismiss via backdrop, close control, or the button inside.">
        <Button className="w-full" variant="secondary" onPress={() => setVisible(true)}>
          Open bottom sheet
        </Button>
        <BottomSheet visible={visible} onClose={() => setVisible(false)}>
          <View className="gap-3">
            <Heading level={4}>Sheet title</Heading>
            <Text variant="muted" size="sm">
              Sheet content goes here. Keep it short and scrollable if needed.
            </Text>
            <Button className="w-full" onPress={() => setVisible(false)}>
              Close
            </Button>
          </View>
        </BottomSheet>
      </DocSection>
    </View>
  );
}

export function SwipeableRowDemo() {
  const toast = useToast();
  return (
    <View className="gap-6">
      <DocIntro
        title="Swipeable row"
        description="Swipe left to reveal a destructive action. Use for list rows that support delete or archive."
      />
      <DocSection title="Swipe left" description="Gesture requires the app GestureRoot (already wired in the showcase).">
        <View className="gap-2">
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
      </DocSection>
    </View>
  );
}

export function KeyboardAwareFormDemo() {
  const [formVisible, setFormVisible] = useState(false);
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="gap-6">
      <DocIntro
        title="Keyboard-aware form"
        description="Full-height field stack that scrolls so the focused input stays above the keyboard. Open as its own surface — do not nest another scroll view inside."
      />
      <DocSection title="Open demo" description="Presented as a modal so keyboard behaviour is real.">
        <Button className="w-full" variant="secondary" onPress={() => setFormVisible(true)}>
          Open form
        </Button>
      </DocSection>

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
