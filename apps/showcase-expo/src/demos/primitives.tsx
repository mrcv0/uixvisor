import { useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@registry/avatar/avatar';
import { Badge } from '@registry/badge/badge';
import { Button } from '@registry/button/button';
import { Card, CardContent, CardFooter, CardHeader } from '@registry/card/card';
import { Checkbox } from '@registry/checkbox/checkbox';
import { Heading } from '@registry/heading/heading';
import { Icon } from '@registry/icon/icon';
import { IconButton } from '@registry/icon-button/icon-button';
import { Input } from '@registry/input/input';
import { Progress } from '@registry/progress/progress';
import { RadioGroup, RadioGroupItem } from '@registry/radio-group/radio-group';
import { Separator } from '@registry/separator/separator';
import { SkeletonCard, SkeletonText } from '@registry/skeleton/skeleton';
import { Spinner } from '@registry/spinner/spinner';
import { Switch } from '@registry/switch/switch';
import { Text } from '@registry/text/text';
import { Textarea } from '@registry/textarea/textarea';
import {
  themeColors,
  useElevation,
  useThemeColor,
  useThemeMode,
  type ThemeColorName,
} from '@registry/theme/theme';
import { useToast } from '@registry/toast/toast';

import { Section } from '../shell/Section';

const SWATCH_NAMES: ThemeColorName[] = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'muted',
  'border',
  'destructive',
  'success',
  'warning',
  'card',
  'surface-elevated',
  'skeleton',
];

export function ThemeDemo() {
  const mode = useThemeMode();
  const raised = useElevation('raised');
  const colors = themeColors[mode];

  return (
    <View className="gap-4">
      <Text variant="muted" size="sm">
        Active mode: {mode}. Shadows only apply in light mode.
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {SWATCH_NAMES.map((name) => (
          <View key={name} className="w-[30%] items-center gap-1">
            <View
              className="h-12 w-full rounded-md border border-border"
              style={[{ backgroundColor: colors[name] }, name === 'card' ? raised : undefined]}
            />
            <Text size="xs" variant="muted" numberOfLines={1}>
              {name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function TextDemo() {
  return (
    <View className="gap-3">
      <Text size="3xl" weight="bold">
        3xl bold
      </Text>
      <Text size="2xl" weight="bold">
        2xl bold
      </Text>
      <Text size="xl" weight="semibold">
        xl semibold
      </Text>
      <Text size="lg" weight="semibold">
        Large semibold
      </Text>
      <Text size="base">Body text at the 16px base step.</Text>
      <Text size="sm" weight="medium">
        Small medium
      </Text>
      <Text size="xs">Extra small</Text>
      <Text variant="muted" size="sm">
        Muted small text for secondary information.
      </Text>
      <Text variant="destructive" size="sm">
        Destructive text for error messaging.
      </Text>
      <Text variant="success" size="sm">
        Success text for positive status.
      </Text>
      <Text variant="warning" size="sm">
        Warning text for caution.
      </Text>
    </View>
  );
}

export function HeadingDemo() {
  return (
    <View className="gap-2">
      <Heading level={1}>Heading one</Heading>
      <Heading level={2}>Heading two</Heading>
      <Heading level={3}>Heading three</Heading>
      <Heading level={4}>Heading four</Heading>
      <Text variant="muted" size="sm">
        Levels share the Text type ramp and Inter weight families.
      </Text>
    </View>
  );
}

export function ButtonDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="gap-5">
      <Section title="Variants" hint="Six variants." showSeparator={false}>
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
      </Section>

      <Section title="Sizes" showSeparator={false}>
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
      </Section>

      <Section title="States" showSeparator={false}>
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
      </Section>
    </View>
  );
}

export function IconButtonDemo() {
  const foreground = useThemeColor('foreground');
  const onPrimary = useThemeColor('primary-foreground');

  return (
    <View className="flex-row flex-wrap gap-2">
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
  );
}

export function IconDemo() {
  const foreground = useThemeColor('foreground');
  const names = [
    'check',
    'close',
    'search',
    'sun',
    'moon',
    'user',
    'settings',
    'stack',
    'device',
    'package',
    'window',
    'path',
    'plus',
    'trash',
    'inbox',
    'warning',
    'success',
    'chevron-right',
  ] as const;

  return (
    <View className="flex-row flex-wrap gap-3">
      {names.map((name) => (
        <View key={name} className="w-[22%] min-w-[64px] items-center gap-1.5 py-1">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <Icon name={name} size={22} color={foreground} weight="regular" />
          </View>
          <Text size="xs" variant="muted" numberOfLines={1}>
            {name}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function InputDemo() {
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const mutedForeground = useThemeColor('muted-foreground');

  return (
    <View className="gap-3">
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        hint="We'll never share your email."
      />
      <Input
        label="Password"
        placeholder="••••••••"
        secureTextEntry={!passwordVisible}
        endIcon={
          <IconButton
            variant="ghost"
            size="sm"
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
      <Input label="Disabled" value="Locked value" disabled />
    </View>
  );
}

export function TextareaDemo() {
  return (
    <View className="gap-3">
      <Textarea
        label="Notes"
        placeholder="Anything else we should know?"
        hint="Optional — max a short paragraph."
      />
      <Textarea label="With error" value="Too short" error="Please write at least 20 characters." />
      <Textarea label="Disabled" value="Cannot edit" disabled />
    </View>
  );
}

export function CheckboxDemo() {
  const [agreed, setAgreed] = useState(false);
  return <Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree to the terms" />;
}

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('monthly');
  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <RadioGroupItem value="monthly" label="Monthly" />
      <RadioGroupItem value="yearly" label="Yearly" />
    </RadioGroup>
  );
}

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <View className="h-12 flex-row items-center justify-between">
      <Text>Push notifications</Text>
      <Switch checked={on} onCheckedChange={setOn} />
    </View>
  );
}

export function CardDemo() {
  return (
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
  );
}

export function AvatarDemo() {
  return (
    <View className="flex-row items-center gap-3">
      <Avatar size="sm" fallback="AL" />
      <Avatar size="md" fallback="AL" />
      <Avatar size="lg" fallback="AL" />
    </View>
  );
}

export function BadgeDemo() {
  return (
    <View className="flex-row flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </View>
  );
}

export function SeparatorDemo() {
  return (
    <View className="gap-3">
      <Text>Above</Text>
      <Separator />
      <Text>Below</Text>
    </View>
  );
}

export function SpinnerDemo() {
  return (
    <View className="flex-row items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="lg" />
    </View>
  );
}

export function SkeletonDemo() {
  return (
    <View className="gap-4">
      <SkeletonCard />
      <SkeletonText lines={3} />
    </View>
  );
}

export function ProgressDemo() {
  return (
    <View className="gap-3">
      <Progress value={25} />
      <Progress value={60} />
      <Progress value={100} />
    </View>
  );
}
