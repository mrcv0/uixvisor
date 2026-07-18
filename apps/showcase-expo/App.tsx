import './global.css';

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Button } from '../../registry/primitives/button/button';
import { Text } from '../../registry/primitives/text/text';
import { Input } from '../../registry/primitives/input/input';
import { Checkbox } from '../../registry/primitives/checkbox/checkbox';
import { Switch } from '../../registry/primitives/switch/switch';
import { Card, CardHeader, CardContent, CardFooter } from '../../registry/primitives/card/card';
import { Heading } from '../../registry/primitives/heading/heading';
import { IconButton } from '../../registry/primitives/icon-button/icon-button';
import { Textarea } from '../../registry/primitives/textarea/textarea';
import { RadioGroup, RadioGroupItem } from '../../registry/primitives/radio-group/radio-group';
import { Avatar } from '../../registry/primitives/avatar/avatar';
import { Badge } from '../../registry/primitives/badge/badge';
import { Separator } from '../../registry/primitives/separator/separator';
import { Spinner } from '../../registry/primitives/spinner/spinner';
import { Skeleton } from '../../registry/primitives/skeleton/skeleton';
import { Progress } from '../../registry/primitives/progress/progress';
import { OTPInput } from '../../registry/mobile/otp-input/otp-input';
import { SearchBar } from '../../registry/mobile/search-bar/search-bar';
import { KeyboardAwareForm } from '../../registry/mobile/keyboard-aware-form/keyboard-aware-form';
import { ToastProvider, useToast } from '../../registry/mobile/toast/toast';
import { EmptyState } from '../../registry/mobile/empty-state/empty-state';
import { ErrorState } from '../../registry/mobile/error-state/error-state';
import { SwipeableRow } from '../../registry/mobile/swipeable-row/swipeable-row';
import { BottomSheet } from '../../registry/mobile/bottom-sheet/bottom-sheet';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <ShowcaseContent />
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

function ShowcaseContent() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('monthly');
  const [otp, setOtp] = useState('');
  const [query, setQuery] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="items-center gap-3 px-6 py-16"
    >
      <Heading level={2} className="mb-2">
        UIXVISOR showcase
      </Heading>

      <Button variant="primary" onPress={() => {}}>
        Primary
      </Button>
      <Button variant="secondary" onPress={() => {}}>
        Secondary
      </Button>
      <Button variant="destructive" onPress={() => {}}>
        Destructive
      </Button>
      <Button variant="primary" loading onPress={() => {}}>
        Loading
      </Button>
      <Button variant="primary" disabled onPress={() => {}}>
        Disabled
      </Button>

      <View className="flex-row gap-3">
        <IconButton
          variant="primary"
          accessibilityLabel="Add"
          icon={<Text className="text-lg text-primary-foreground">＋</Text>}
          onPress={() => {}}
        />
        <IconButton
          variant="secondary"
          accessibilityLabel="Settings"
          icon={<Text className="text-lg text-secondary-foreground">⚙</Text>}
          onPress={() => {}}
        />
        <IconButton
          variant="ghost"
          accessibilityLabel="More"
          icon={<Text className="text-lg text-foreground">⋯</Text>}
          onPress={() => {}}
        />
      </View>

      <Text variant="muted" size="sm" className="mt-4">
        Muted text
      </Text>
      <Text variant="destructive" size="sm">
        Destructive text
      </Text>

      <View className="w-full gap-3 mt-4">
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <Input label="Password" placeholder="••••••••" secureTextEntry />
        <Input label="Username" error="This field is required" />
        <Input label="Disabled" editable={false} value="Read only" />
        <Textarea label="Bio" placeholder="Tell us about yourself" />
      </View>

      <View className="w-full gap-2 mt-4">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree to the terms" />
        <Checkbox checked disabled onCheckedChange={() => {}} label="Disabled, checked" />
        <View className="flex-row items-center justify-between">
          <Text>Push notifications</Text>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </View>
      </View>

      <RadioGroup value={plan} onValueChange={setPlan} className="w-full mt-4">
        <RadioGroupItem value="monthly" label="Monthly" />
        <RadioGroupItem value="yearly" label="Yearly" />
      </RadioGroup>

      <View className="flex-row items-center gap-3 mt-4">
        <Avatar size="sm" fallback="Ada Lovelace" />
        <Avatar size="md" fallback="Grace Hopper" />
        <Avatar size="lg" fallback="Alan Turing" />
      </View>

      <View className="flex-row flex-wrap gap-2 mt-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
      </View>

      <Separator className="w-full mt-4" />

      <View className="flex-row items-center gap-4 mt-4">
        <Spinner size="sm" />
        <Spinner size="lg" />
      </View>

      <View className="w-full gap-2 mt-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-11 rounded-full" />
      </View>

      <View className="w-full gap-2 mt-4">
        <Progress value={30} />
        <Progress value={70} />
      </View>

      <View className="w-full mt-4">
        <OTPInput value={otp} onChangeText={setOtp} onResend={() => {}} />
      </View>

      <View className="w-full mt-4">
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <View className="h-40 w-full mt-4 rounded-xl border border-border">
        <KeyboardAwareForm contentContainerClassName="gap-2 p-3">
          <Input label="Field A" placeholder="A" />
          <Input label="Field B" placeholder="B" />
        </KeyboardAwareForm>
      </View>

      <Button variant="secondary" onPress={() => toast.show('Saved successfully', 'success')}>
        Show toast
      </Button>

      <EmptyState
        className="w-full"
        title="No results"
        description="Try adjusting your search or filters."
        action={
          <Button variant="secondary" onPress={() => {}} className="mt-2">
            Clear filters
          </Button>
        }
      />

      <ErrorState className="w-full" onRetry={() => {}} />

      <SwipeableRow className="w-full border-b border-border py-3" onDelete={() => {}}>
        <Text>Swipe me left</Text>
      </SwipeableRow>

      <Button variant="secondary" onPress={() => setSheetVisible(true)}>
        Open bottom sheet
      </Button>
      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Heading level={4}>Sheet title</Heading>
        <Text variant="muted" size="sm">
          Sheet content goes here.
        </Text>
        <Button variant="primary" onPress={() => setSheetVisible(false)}>
          Close
        </Button>
      </BottomSheet>

      <Card className="w-full mt-4">
        <CardHeader>
          <Text size="lg" className="font-medium">
            Account
          </Text>
          <Text variant="muted" size="sm">
            Manage your profile settings
          </Text>
        </CardHeader>
        <CardContent>
          <Text size="sm">Card content goes here.</Text>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onPress={() => {}}>
            Cancel
          </Button>
          <Button variant="primary" onPress={() => {}}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <StatusBar style="auto" />
    </ScrollView>
  );
}
