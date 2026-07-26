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

import { DocIntro, DocSection } from '../shell/DocSection';

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
        description="One component for labelled actions and icon toolbars. Icon-only uses size icon, icon-sm, or icon-lg."
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
        description="startIcon and endIcon for labelled actions."
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
    <View className="gap-6">
      <DocIntro
        title="Icon"
        description="Semantic names, not library glyphs. Components call Icon by name; one adapter file maps them to Phosphor so the library can change without touching every screen."
      />

      <DocSection
        title="Vocabulary"
        description="Colour defaults to theme foreground. Pass color when the icon sits on a filled surface (for example primary buttons)."
      >
        <View className="flex-row flex-wrap gap-3">
          {names.map((name) => (
            <View key={name} className="w-[22%] min-w-[64px] items-center gap-1.5 py-1">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <Icon name={name} size={22} weight="regular" />
              </View>
              <Text size="xs" variant="muted" numberOfLines={1}>
                {name}
              </Text>
            </View>
          ))}
        </View>
      </DocSection>

      <DocSection title="Weights" description="regular and bold cover most UI. Decorative icons stay unlabelled for assistive tech.">
        <View className="flex-row items-center gap-4">
          <View className="items-center gap-1">
            <Icon name="check" size={28} weight="regular" />
            <Text size="xs" variant="muted">
              regular
            </Text>
          </View>
          <View className="items-center gap-1">
            <Icon name="check" size={28} weight="bold" />
            <Text size="xs" variant="muted">
              bold
            </Text>
          </View>
        </View>
      </DocSection>
    </View>
  );
}

export function InputDemo() {
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const mutedForeground = useThemeColor('muted-foreground');

  return (
    <View className="gap-6">
      <DocIntro
        title="Input"
        description="Single-line field with label, hint, error, and optional icon slots. Focus ring and destructive border follow the theme tokens."
      />

      <DocSection title="Default" description="Label + hint under the field.">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          hint="We'll never share your email."
        />
      </DocSection>

      <DocSection title="With end icon" description="Compose a ghost icon button inside endIcon.">
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
      </DocSection>

      <DocSection title="Error" description="error replaces hint and is exposed to assistive tech.">
        <Input label="With error" value="not-an-email" error="Enter a valid email address" />
      </DocSection>

      <DocSection title="Disabled" description="disabled (or editable=false) dims the control and blocks input.">
        <Input label="Disabled" value="Locked value" disabled />
      </DocSection>
    </View>
  );
}

export function TextareaDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Textarea"
        description="Same field contract as Input — label, hint, error, disabled — for multi-line copy."
      />

      <DocSection title="Default" description="Hint shows when there is no error.">
        <Textarea
          label="Notes"
          placeholder="Anything else we should know?"
          hint="Optional — keep it to a short paragraph."
        />
      </DocSection>

      <DocSection title="Error">
        <Textarea
          label="With error"
          value="Too short"
          error="Please write at least 20 characters."
        />
      </DocSection>

      <DocSection title="Disabled">
        <Textarea label="Disabled" value="Cannot edit" disabled />
      </DocSection>
    </View>
  );
}

export function CheckboxDemo() {
  const [agreed, setAgreed] = useState(false);

  return (
    <View className="gap-6">
      <DocIntro
        title="Checkbox"
        description="Controlled boolean. Row height keeps a 48pt target even without a label."
      />

      <DocSection title="With label">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree to the terms" />
      </DocSection>

      <DocSection title="Disabled">
        <Checkbox checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
      </DocSection>

      <DocSection
        title="Unlabeled"
        description="Pass accessibilityLabel when there is no visible label."
      >
        <View className="flex-row items-center gap-3">
          <Checkbox
            checked={agreed}
            onCheckedChange={setAgreed}
            accessibilityLabel="Unlabeled checkbox"
          />
          <Text variant="muted" size="sm" className="flex-1">
            Hit area stays at least 48×48.
          </Text>
        </View>
      </DocSection>
    </View>
  );
}

export function RadioGroupDemo() {
  const [plan, setPlan] = useState('monthly');
  return (
    <View className="gap-6">
      <DocIntro
        title="Radio group"
        description="Single selection. Items inherit group disabled, or take their own disabled flag."
      />

      <DocSection title="Options" description="Selection haptic matches Checkbox.">
        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioGroupItem value="monthly" label="Monthly" />
          <RadioGroupItem value="yearly" label="Yearly" />
          <RadioGroupItem value="lifetime" label="Lifetime (disabled)" disabled />
        </RadioGroup>
      </DocSection>

      <DocSection title="Group disabled">
        <RadioGroup value="a" onValueChange={() => {}} disabled>
          <RadioGroupItem value="a" label="Group disabled" />
          <RadioGroupItem value="b" label="Also disabled" />
        </RadioGroup>
      </DocSection>
    </View>
  );
}

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  const [wifi, setWifi] = useState(false);

  return (
    <View className="gap-6">
      <DocIntro
        title="Switch"
        description="On/off control. Optional label makes the whole row pressable and names the control for assistive tech."
      />

      <DocSection title="With label">
        <View className="gap-1">
          <Switch label="Push notifications" checked={on} onCheckedChange={setOn} />
          <Switch label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />
        </View>
      </DocSection>

      <DocSection title="Disabled">
        <Switch label="Disabled setting" checked disabled onCheckedChange={() => {}} />
      </DocSection>

      <DocSection
        title="Bare control"
        description="No label prop — pair with your own layout and accessibilityLabel."
      >
        <View className="flex-row items-center justify-between">
          <Text variant="muted" size="sm">
            Compact row
          </Text>
          <Switch checked={on} onCheckedChange={setOn} accessibilityLabel="Bare switch" />
        </View>
      </DocSection>
    </View>
  );
}

export function CardDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Card"
        description="Elevated surface with header, content, and footer slots. Light mode uses shadow; dark mode uses a lifted surface colour plus border."
      />

      <DocSection title="Composition" description="CardTitle and CardDescription sit in the header.">
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
      </DocSection>

      <DocSection
        title="Flat elevation"
        description='elevation="surface" drops the raised shadow for nested or dense layouts.'
      >
        <Card elevation="surface">
          <CardHeader>
            <CardTitle>Flat card</CardTitle>
            <CardDescription>No raised shadow in light mode.</CardDescription>
          </CardHeader>
        </Card>
      </DocSection>
    </View>
  );
}

export function AvatarDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Avatar"
        description="Photo or initials. Multi-word fallbacks become first+last initials; broken images fall back to the glyph."
      />

      <DocSection title="Sizes" description="sm · md · lg">
        <View className="flex-row items-center gap-3">
          <Avatar size="sm" fallback="Ada Lovelace" />
          <Avatar size="md" fallback="Ada Lovelace" />
          <Avatar size="lg" fallback="Ada Lovelace" />
        </View>
      </DocSection>

      <DocSection title="Image and fallback">
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
      </DocSection>
    </View>
  );
}

export function BadgeDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Badge"
        description="Compact status label. Solid fills the chip; soft uses a tinted surface with coloured type."
      />

      <DocSection title="Solid" description="default · secondary · destructive · success · warning">
        <View className="flex-row flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </View>
      </DocSection>

      <DocSection title="Soft" description='appearance="soft" for quieter chips on dense screens.'>
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
      </DocSection>
    </View>
  );
}

export function SeparatorDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Separator"
        description="Decorative divider. Hidden from assistive tech. Vertical needs a parent with a defined height."
      />

      <DocSection title="Horizontal">
        <View className="gap-3">
          <Text>Above</Text>
          <Separator />
          <Text>Below</Text>
        </View>
      </DocSection>

      <DocSection title="Vertical" description="Use inside a row with fixed height.">
        <View className="h-12 flex-row items-center gap-3">
          <Text>Left</Text>
          <Separator orientation="vertical" />
          <Text>Right</Text>
          <Separator orientation="vertical" hairline />
          <Text variant="muted" size="sm">
            hairline
          </Text>
        </View>
      </DocSection>
    </View>
  );
}

export function SpinnerDemo() {
  const foreground = useThemeColor('foreground');
  const primary = useThemeColor('primary');

  return (
    <View className="gap-6">
      <DocIntro
        title="Spinner"
        description="Loading indicator. Colour defaults to theme foreground; override for filled surfaces."
      />

      <DocSection title="Sizes" description="sm · lg">
        <View className="flex-row items-center gap-6">
          <View className="items-center gap-1">
            <Spinner size="sm" />
            <Text size="xs" variant="muted">
              sm
            </Text>
          </View>
          <View className="items-center gap-1">
            <Spinner size="lg" />
            <Text size="xs" variant="muted">
              lg
            </Text>
          </View>
        </View>
      </DocSection>

      <DocSection title="Custom colour">
        <View className="flex-row items-center gap-4">
          <Spinner size="lg" color={foreground} />
          <Spinner size="lg" color={primary} />
        </View>
      </DocSection>
    </View>
  );
}

export function SkeletonDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Skeleton"
        description="Placeholder while content loads. Respects reduce motion (static block when motion is reduced). Bare Skeleton defaults to a full-width bar."
      />

      <DocSection title="Base">
        <View className="gap-3">
          <Skeleton />
          <Skeleton className="h-24 w-full rounded-lg" />
        </View>
      </DocSection>

      <DocSection title="Composed" description="SkeletonCard and SkeletonText for common layouts.">
        <View className="gap-4">
          <SkeletonCard />
          <SkeletonText lines={3} />
        </View>
      </DocSection>
    </View>
  );
}

export function ProgressDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Progress"
        description="Determinate 0–100 bar, or indeterminate while duration is unknown. Optional value label and status colours."
      />

      <DocSection title="Determinate" description="Animated fill when reduce motion is off.">
        <View className="gap-4">
          <Progress value={25} showValueLabel />
          <Progress value={60} variant="success" size="lg" showValueLabel />
          <Progress value={100} variant="destructive" size="sm" />
        </View>
      </DocSection>

      <DocSection
        title="Indeterminate"
        description="Use when progress percentage is not available yet."
      >
        <Progress indeterminate />
      </DocSection>
    </View>
  );
}
