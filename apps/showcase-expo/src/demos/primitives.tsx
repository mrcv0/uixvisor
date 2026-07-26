import { useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@registry/avatar/avatar';
import { Badge } from '@registry/badge/badge';
import { Button } from '@registry/button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@registry/card/card';
import { Checkbox } from '@registry/checkbox/checkbox';
import { Heading } from '@registry/heading/heading';
import { Icon } from '@registry/icon/icon';
import { Input } from '@registry/input/input';
import { Progress } from '@registry/progress/progress';
import { RadioGroup, RadioGroupItem } from '@registry/radio-group/radio-group';
import { Separator } from '@registry/separator/separator';
import { Skeleton, SkeletonCard, SkeletonText } from '@registry/skeleton/skeleton';
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

import { DocIntro, DocLabel, DocSection } from '../shell/DocSection';
import { Section } from '../shell/Section';

type SwatchGroup = { title: string; description: string; names: ThemeColorName[] };

const SWATCH_GROUPS: SwatchGroup[] = [
  {
    title: 'Base',
    description: 'Page canvas and default type colour.',
    names: ['background', 'foreground'],
  },
  {
    title: 'Surfaces',
    description: 'Cards, elevated sheets, and muted chrome.',
    names: ['card', 'card-foreground', 'surface', 'surface-elevated', 'muted', 'muted-foreground'],
  },
  {
    title: 'Interactive',
    description: 'Primary actions, secondary fills, accents, focus ring.',
    names: [
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
      'accent',
      'accent-foreground',
      'ring',
    ],
  },
  {
    title: 'Borders & inputs',
    description: 'Hairlines, field borders, skeleton placeholders.',
    names: ['border', 'input', 'skeleton'],
  },
  {
    title: 'Status',
    description: 'Colour carries meaning, not decoration.',
    names: ['destructive', 'destructive-foreground', 'success', 'warning'],
  },
  {
    title: 'Overlay',
    description: 'Sheets, tab bars, and dimmers.',
    names: ['overlay', 'sheet', 'tab-bar'],
  },
];

function ColorSwatch({
  name,
  hex,
  elevated,
}: {
  name: string;
  hex: string;
  elevated?: object;
}) {
  return (
    <View className="w-[31%] gap-1.5">
      <View
        className="h-14 w-full rounded-lg border border-border"
        style={[{ backgroundColor: hex }, elevated]}
      />
      <Text size="xs" weight="medium" numberOfLines={1}>
        {name}
      </Text>
      <Text size="xs" variant="muted" numberOfLines={1}>
        {hex}
      </Text>
    </View>
  );
}

export function ThemeDemo() {
  const mode = useThemeMode();
  const raised = useElevation('raised');
  const colors = themeColors[mode];

  return (
    <View className="gap-6">
      <DocIntro
        title="Theme"
        description="Semantic tokens — not raw greys in components. Change a token once; every primitive follows. Toggle light/dark from the header."
      />

      <DocSection
        title="How it works"
        description="NativeWind classes (bg-primary, text-muted-foreground) read CSS variables. useThemeColor() returns the same hex for SVG, Switch tracks, and ActivityIndicator."
      >
        <View className="gap-2">
          <Text size="sm">
            Active mode: <Text size="sm" weight="semibold">{mode}</Text>
          </Text>
          <Text size="sm" variant="muted">
            Shadows (useElevation) apply in light mode only. Dark mode lifts surfaces with
            surface-elevated + border instead.
          </Text>
        </View>
      </DocSection>

      {SWATCH_GROUPS.map((group) => (
        <DocSection key={group.title} title={group.title} description={group.description}>
          <View className="flex-row flex-wrap gap-2">
            {group.names.map((name) => (
              <ColorSwatch
                key={name}
                name={name}
                hex={colors[name]}
                elevated={name === 'card' || name === 'surface-elevated' ? raised : undefined}
              />
            ))}
          </View>
        </DocSection>
      ))}
    </View>
  );
}

export function TextDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Text"
        description="Body type system. Sizes map to the design scale; weights map to Inter families (Android cannot fake weight on a single font file)."
      />

      <DocSection
        title="Type scale"
        description="From dense UI captions to display. Headings reuse the upper steps."
      >
        <View className="gap-3">
          {(
            [
              ['3xl', 'bold', 'Display / page title'],
              ['2xl', 'bold', 'Section title'],
              ['xl', 'semibold', 'Card title'],
              ['lg', 'semibold', 'Emphasised body'],
              ['base', 'regular', 'Default body (16)'],
              ['sm', 'medium', 'Secondary / labels'],
              ['xs', 'regular', 'Captions / meta'],
            ] as const
          ).map(([size, weight, note]) => (
            <View key={size} className="gap-0.5 border-b border-border pb-3 last:border-b-0 last:pb-0">
              <Text size={size} weight={weight}>
                The quick brown fox
              </Text>
              <Text size="xs" variant="muted">
                size={size} · weight={weight} — {note}
              </Text>
            </View>
          ))}
        </View>
      </DocSection>

      <DocSection
        title="Variants"
        description="Semantic colour on type. Prefer variant over one-off className colours."
      >
        <View className="gap-2">
          <Text variant="default">Default — primary reading colour.</Text>
          <Text variant="muted">Muted — secondary descriptions and hints.</Text>
          <Text variant="destructive">Destructive — errors and irreversible actions.</Text>
          <Text variant="success">Success — confirmations and positive status.</Text>
          <Text variant="warning">Warning — caution without a hard stop.</Text>
        </View>
      </DocSection>

      <DocSection title="Weights" description="regular · medium · semibold · bold">
        <View className="gap-1">
          <Text weight="regular">Regular — body copy</Text>
          <Text weight="medium">Medium — labels and buttons</Text>
          <Text weight="semibold">Semibold — emphasis</Text>
          <Text weight="bold">Bold — display</Text>
        </View>
      </DocSection>
    </View>
  );
}

export function HeadingDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Heading"
        description="Four visual ranks built on Text. Use for page structure; keep body copy on Text."
      />

      <DocSection
        title="Levels"
        description="level maps to size + weight on the shared type ramp (1 = largest)."
      >
        <View className="gap-4">
          <View className="gap-1">
            <Heading level={1}>Heading one</Heading>
            <Text size="xs" variant="muted">
              level=1 · 3xl bold
            </Text>
          </View>
          <View className="gap-1">
            <Heading level={2}>Heading two</Heading>
            <Text size="xs" variant="muted">
              level=2 · 2xl bold
            </Text>
          </View>
          <View className="gap-1">
            <Heading level={3}>Heading three</Heading>
            <Text size="xs" variant="muted">
              level=3 · xl semibold
            </Text>
          </View>
          <View className="gap-1">
            <Heading level={4}>Heading four</Heading>
            <Text size="xs" variant="muted">
              level=4 · lg semibold
            </Text>
          </View>
        </View>
      </DocSection>

      <DocSection title="In context" description="Heading + supporting Text (typeset pattern).">
        <View className="gap-2">
          <Heading level={3}>Payment methods</Heading>
          <Text variant="muted" size="sm">
            Add a card or bank account. We never store full PAN on device.
          </Text>
        </View>
      </DocSection>
    </View>
  );
}

export function ButtonDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');
  const onPrimary = useThemeColor('primary-foreground');

  return (
    <View className="gap-6">
      <DocIntro
        title="Button"
        description="One component for labelled actions and icon toolbars. Icon-only uses size icon / icon-sm / icon-lg (no separate IconButton primitive)."
      />

      <DocSection title="Variants" description="primary · secondary · outline · ghost · destructive · link">
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
      </DocSection>

      <DocSection title="Sizes" description="sm · default · lg for labels; keep labels short on sm.">
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
      </DocSection>

      <DocSection
        title="With icons"
        description="startIcon / endIcon for labelled buttons — same pattern as shadcn icon+label."
      >
        <View className="gap-2">
          <Button
            startIcon={<Icon name="plus" size={18} color={onPrimary} />}
            onPress={() => {}}
          >
            Add item
          </Button>
          <Button
            variant="outline"
            endIcon={<Icon name="chevron-right" size={18} color={foreground} />}
            onPress={() => {}}
          >
            Continue
          </Button>
        </View>
      </DocSection>

      <DocSection
        title="Icon only"
        description="size=&quot;icon&quot; | icon-sm | icon-lg. Always pass accessibilityLabel."
      >
        <View className="flex-row flex-wrap gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            accessibilityLabel="Search"
            icon={<Icon name="search" size={18} color={foreground} />}
            onPress={() => {}}
          />
          <Button
            size="icon"
            variant="secondary"
            accessibilityLabel="Settings"
            icon={<Icon name="settings" size={20} color={foreground} />}
            onPress={() => {}}
          />
          <Button
            size="icon-lg"
            accessibilityLabel="Add"
            icon={<Icon name="plus" size={22} color={onPrimary} />}
            onPress={() => {}}
          />
          <Button
            size="icon"
            variant="destructive"
            accessibilityLabel="Delete"
            icon={<Icon name="trash" size={20} color={onPrimary} />}
            onPress={() => {}}
          />
          <Button
            size="icon"
            variant="ghost"
            accessibilityLabel="More"
            icon={<Icon name="chevron-down" size={20} color={foreground} />}
            onPress={() => {}}
          />
        </View>
      </DocSection>

      <DocSection title="States" description="loading keeps the accessible name; disabled blocks press.">
        <View className="gap-2">
          <Button loading onPress={() => {}}>
            Loading
          </Button>
          <Button disabled onPress={() => {}}>
            Disabled
          </Button>
        </View>
      </DocSection>
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
          <Button
            variant="ghost"
            size="icon-sm"
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

  return (
    <View className="gap-3">
      <Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree to the terms" />
      <Checkbox checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
      <View className="flex-row items-center gap-3">
        <Checkbox
          checked={agreed}
          onCheckedChange={setAgreed}
          accessibilityLabel="Unlabeled checkbox"
        />
        <Text variant="muted" size="sm">
          Unlabeled control still keeps a 48pt hit area.
        </Text>
      </View>
    </View>
  );
}

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('monthly');
  return (
    <View className="gap-4">
      <RadioGroup value={plan} onValueChange={setPlan}>
        <RadioGroupItem value="monthly" label="Monthly" />
        <RadioGroupItem value="yearly" label="Yearly" />
        <RadioGroupItem value="lifetime" label="Lifetime (disabled)" disabled />
      </RadioGroup>
      <RadioGroup value="a" onValueChange={() => {}} disabled>
        <RadioGroupItem value="a" label="Group disabled" />
        <RadioGroupItem value="b" label="Also disabled" />
      </RadioGroup>
    </View>
  );
}

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  const [wifi, setWifi] = useState(false);

  return (
    <View className="gap-3">
      <Switch label="Push notifications" checked={on} onCheckedChange={setOn} />
      <Switch label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />
      <Switch label="Disabled setting" checked disabled onCheckedChange={() => {}} />
      <View className="flex-row items-center justify-between">
        <Text variant="muted" size="sm">
          Bare switch (no label prop)
        </Text>
        <Switch checked={on} onCheckedChange={setOn} accessibilityLabel="Bare switch" />
      </View>
    </View>
  );
}

export function CardDemo() {
  return (
    <View className="gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your profile settings</CardDescription>
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
      <Card elevation="surface">
        <CardHeader>
          <CardTitle>Flat card</CardTitle>
          <CardDescription>elevation=&quot;surface&quot; — no raised shadow</CardDescription>
        </CardHeader>
      </Card>
    </View>
  );
}

export function AvatarDemo() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <Avatar size="sm" fallback="Ada Lovelace" />
        <Avatar size="md" fallback="Ada Lovelace" />
        <Avatar size="lg" fallback="Ada Lovelace" />
      </View>
      <View className="flex-row items-center gap-3">
        <Avatar
          size="md"
          fallback="With photo"
          source={{ uri: 'https://i.pravatar.cc/128?u=uixvisor' }}
        />
        <Avatar
          size="md"
          fallback="Broken image"
          source={{ uri: 'https://example.invalid/missing.png' }}
        />
        <Avatar size="md" fallback="Single" initials="UX" />
      </View>
      <Text variant="muted" size="sm">
        Multi-word fallback → initials; broken URI falls back to glyph.
      </Text>
    </View>
  );
}

export function BadgeDemo() {
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
      </View>
      <View className="flex-row flex-wrap items-center gap-2">
        <Badge appearance="soft">Soft</Badge>
        <Badge appearance="soft" variant="destructive">
          Soft destructive
        </Badge>
        <Badge appearance="soft" variant="success">
          Soft success
        </Badge>
        <Badge appearance="soft" variant="warning">
          Soft warning
        </Badge>
      </View>
    </View>
  );
}

export function SeparatorDemo() {
  return (
    <View className="gap-4">
      <View className="gap-3">
        <Text>Above</Text>
        <Separator />
        <Text>Below</Text>
      </View>
      <View className="h-12 flex-row items-center gap-3">
        <Text>Left</Text>
        <Separator orientation="vertical" />
        <Text>Right</Text>
        <Separator orientation="vertical" hairline />
        <Text variant="muted" size="sm">
          hairline
        </Text>
      </View>
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
      <Skeleton />
      <Skeleton className="h-24 w-full rounded-lg" />
      <SkeletonCard />
      <SkeletonText lines={3} />
    </View>
  );
}

export function ProgressDemo() {
  return (
    <View className="gap-4">
      <Progress value={25} showValueLabel />
      <Progress value={60} variant="success" size="lg" showValueLabel />
      <Progress value={100} variant="destructive" size="sm" />
      <View className="gap-1">
        <Text size="sm" variant="muted">
          Indeterminate
        </Text>
        <Progress indeterminate />
      </View>
    </View>
  );
}
