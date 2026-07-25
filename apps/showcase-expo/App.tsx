import './global.css';

import { useState, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ScrollView, View } from 'react-native';

import { Button } from '@registry/button/button';
import { Text } from '@registry/text/text';
import { Input } from '@registry/input/input';
import { Checkbox } from '@registry/checkbox/checkbox';
import { Switch } from '@registry/switch/switch';
import { Card, CardHeader, CardContent, CardFooter } from '@registry/card/card';
import { Heading } from '@registry/heading/heading';
import { IconButton } from '@registry/icon-button/icon-button';
import { Textarea } from '@registry/textarea/textarea';
import { RadioGroup, RadioGroupItem } from '@registry/radio-group/radio-group';
import { Avatar } from '@registry/avatar/avatar';
import { Badge } from '@registry/badge/badge';
import { Separator } from '@registry/separator/separator';
import { Spinner } from '@registry/spinner/spinner';
import { Skeleton } from '@registry/skeleton/skeleton';
import { Progress } from '@registry/progress/progress';
import { Icon } from '@registry/icon/icon';
import { useThemeColor } from '@registry/theme/theme';
import { useUixvisorFonts } from '@registry/theme/use-uixvisor-fonts';
import { OTPInput } from '@registry/otp-input/otp-input';
import { SearchBar } from '@registry/search-bar/search-bar';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { ToastProvider, useToast } from '@registry/toast/toast';
import { EmptyState } from '@registry/empty-state/empty-state';
import { ErrorState } from '@registry/error-state/error-state';
import { BottomSheet } from '@registry/bottom-sheet/bottom-sheet';
import { SwipeableRow } from '@registry/swipeable-row/swipeable-row';

import { GestureRoot } from './gesture-root';

export default function App() {
  // Inter is the default face; the app still renders on the system font while
  // it loads, so there is no splash gate here.
  useUixvisorFonts();

  return (
    <GestureRoot>
      <ToastProvider>
        <Showcase />
      </ToastProvider>
    </GestureRoot>
  );
}

/** A labelled group so the showcase reads as a catalogue rather than a dump. */
function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View className="w-full gap-3">
      <View className="gap-0.5">
        <Heading level={4}>{title}</Heading>
        {hint ? (
          <Text variant="muted" size="sm">
            {hint}
          </Text>
        ) : null}
      </View>
      {children}
      <Separator className="mt-2" />
    </View>
  );
}

/** Labels a single specimen so variants can be told apart at a glance. */
function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Text variant="muted" size="xs">
        {label}
      </Text>
      {children}
    </View>
  );
}

function Showcase() {
  const toast = useToast();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const foreground = useThemeColor('foreground');
  const onPrimary = useThemeColor('primary-foreground');
  const mutedForeground = useThemeColor('muted-foreground');

  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('monthly');
  const [otp, setOtp] = useState('');
  const [query, setQuery] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-4 pb-16 pt-16"
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Heading level={2}>UIXVISOR</Heading>
          <Text variant="muted" size="sm">
            Monochrome by default. Colour carries meaning, never decoration.
          </Text>
        </View>
        {/* Half the token system lives in dark mode; without a toggle it is
            invisible to anyone evaluating the library. */}
        <IconButton
          variant="outline"
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          icon={<Icon name={isDark ? 'eye' : 'eye-off'} size={18} color={foreground} />}
          onPress={toggleColorScheme}
        />
      </View>

      <Section title="Button" hint="Six variants across three sizes.">
        <Specimen label="Variants">
          <View className="gap-2">
            <Button variant="primary" onPress={() => toast.show('Primary pressed')}>
              Primary
            </Button>
            <Button variant="secondary" onPress={() => {}}>
              Secondary
            </Button>
            <Button variant="outline" onPress={() => {}}>
              Outline
            </Button>
            <Button variant="ghost" onPress={() => {}}>
              Ghost
            </Button>
            <Button variant="destructive" onPress={() => {}}>
              Destructive
            </Button>
            <Button variant="link" onPress={() => {}}>
              Link
            </Button>
          </View>
        </Specimen>

        <Specimen label="Sizes">
          <View className="gap-2">
            <Button size="sm" variant="secondary" onPress={() => {}}>
              Small
            </Button>
            <Button size="default" variant="secondary" onPress={() => {}}>
              Default
            </Button>
            <Button size="lg" variant="secondary" onPress={() => {}}>
              Large
            </Button>
          </View>
        </Specimen>

        <Specimen label="States">
          <View className="gap-2">
            <Button loading onPress={() => {}}>
              Loading
            </Button>
            <Button disabled onPress={() => {}}>
              Disabled
            </Button>
            <Button
              variant="secondary"
              startIcon={<Icon name="plus" size={18} color={foreground} />}
              onPress={() => {}}
            >
              With icon
            </Button>
          </View>
        </Specimen>
      </Section>

      <Section title="Icon button" hint="48px target on every variant.">
        <View className="flex-row gap-2">
          <IconButton
            variant="primary"
            accessibilityLabel="Add"
            icon={<Icon name="plus" size={20} color={onPrimary} />}
            onPress={() => {}}
          />
          <IconButton
            variant="secondary"
            accessibilityLabel="Settings"
            icon={<Icon name="settings" size={20} color={foreground} />}
            onPress={() => {}}
          />
          <IconButton
            variant="outline"
            accessibilityLabel="Refresh"
            icon={<Icon name="refresh" size={20} color={foreground} />}
            onPress={() => {}}
          />
          <IconButton
            variant="ghost"
            accessibilityLabel="Delete"
            icon={<Icon name="trash" size={20} color={foreground} />}
            onPress={() => {}}
          />
        </View>
      </Section>

      <Section title="Typography" hint="Inter, with tracking tightened above 18px.">
        <View className="gap-1">
          <Heading level={1}>Heading one</Heading>
          <Heading level={2}>Heading two</Heading>
          <Heading level={3}>Heading three</Heading>
          <Heading level={4}>Heading four</Heading>
          <Text size="base">Body text at the 16px base step.</Text>
          <Text variant="muted" size="sm">
            Muted small text for secondary information.
          </Text>
          <Text variant="destructive" size="sm">
            Destructive text for error messaging.
          </Text>
        </View>
      </Section>

      <Section title="Inputs" hint="48px fields with icon slots.">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry={!passwordVisible}
          endIcon={
            <IconButton
              variant="ghost"
              className="h-8 w-8"
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              icon={
                <Icon
                  name={passwordVisible ? 'eye-off' : 'eye'}
                  size={18}
                  color={mutedForeground}
                />
              }
              onPress={() => setPasswordVisible((visible) => !visible)}
            />
          }
        />
        <Input label="With error" value="not-an-email" error="Enter a valid email address" />
        <Textarea label="Notes" placeholder="Anything else we should know?" />
        <SearchBar value={query} onChangeText={setQuery} />
      </Section>

      <Section title="Selection">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree to the terms" />
        <View className="h-12 flex-row items-center justify-between">
          <Text>Push notifications</Text>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </View>
        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioGroupItem value="monthly" label="Monthly" />
          <RadioGroupItem value="yearly" label="Yearly" />
        </RadioGroup>
      </Section>

      <Section title="Display">
        <View className="flex-row items-center gap-3">
          <Avatar size="sm" fallback="AL" />
          <Avatar size="md" fallback="AL" />
          <Avatar size="lg" fallback="AL" />
        </View>
        <View className="flex-row flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </View>
        <View className="flex-row items-center gap-3">
          <Spinner size="sm" />
          <Spinner size="lg" />
        </View>
        <Progress value={0.6} />
        <View className="gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </View>
      </Section>

      <Section title="Surfaces" hint="Shadow in light mode, lighter surface plus border in dark.">
        <Card>
          <CardHeader>
            <Text size="lg" weight="semibold">
              Account
            </Text>
            <Text variant="muted" size="sm">
              Manage your profile settings
            </Text>
          </CardHeader>
          <CardContent>
            <Text size="sm">
              Depth is mode dependent because shadows do not read on a dark background.
            </Text>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onPress={() => {}}>
              Cancel
            </Button>
            <Button size="sm" onPress={() => {}}>
              Save
            </Button>
          </CardFooter>
        </Card>

        <Button variant="secondary" onPress={() => setSheetVisible(true)}>
          Open bottom sheet
        </Button>
        <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
          <Heading level={4}>Sheet title</Heading>
          <Text variant="muted" size="sm">
            Sheet content goes here.
          </Text>
          <Button onPress={() => setSheetVisible(false)}>Close</Button>
        </BottomSheet>
      </Section>

      <Section title="Mobile patterns">
        <Specimen label="OTP input">
          <OTPInput value={otp} onChangeText={setOtp} />
        </Specimen>

        <Specimen label="Swipeable row (swipe left)">
          <SwipeableRow
            className="rounded-md border border-border px-4 py-3"
            onDelete={() => toast.show('Row deleted')}
          >
            <Text>Swipe me</Text>
          </SwipeableRow>
        </Specimen>

        <Specimen label="Empty state">
          <EmptyState
            title="No results"
            description="Try adjusting your search or filters."
            action={
              <Button variant="outline" size="sm" onPress={() => {}}>
                Clear filters
              </Button>
            }
          />
        </Specimen>

        <Specimen label="Error state">
          <ErrorState onRetry={() => {}} />
        </Specimen>

        <Specimen label="Keyboard aware form">
          <KeyboardAwareForm>
            <Input label="Full name" placeholder="Ada Lovelace" />
          </KeyboardAwareForm>
        </Specimen>
      </Section>

      <StatusBar style="auto" />
    </ScrollView>
  );
}
