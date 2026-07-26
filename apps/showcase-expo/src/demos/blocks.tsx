import { useState } from 'react';
import { View } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Avatar } from '@registry/avatar/avatar';
import { Button } from '@registry/button/button';
import { ButtonGroup } from '@registry/button-group/button-group';
import { FormField } from '@registry/form-field/form-field';
import { Icon } from '@registry/icon/icon';
import { Input } from '@registry/input/input';
import { ListItem } from '@registry/list-item/list-item';
import { Switch } from '@registry/switch/switch';
import { Text } from '@registry/text/text';
import { useThemeColor } from '@registry/theme/theme';
import { useToast } from '@registry/toast/toast';

import { DocIntro } from '../shell/DocSection';

/**
 * Blocks demos: full-width, no card frames — headers and list rows read as real chrome.
 */

export function AppHeaderDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="App header"
        description="Stack chrome: title, optional back, optional trailing. Shown full width."
      />

      <View className="w-full gap-4">
        <View className="w-full gap-1">
          <Text size="xs" variant="muted" weight="medium">
            Title only
          </Text>
          <AppHeader title="Inbox" />
        </View>

        <View className="w-full gap-1">
          <Text size="xs" variant="muted" weight="medium">
            Back + subtitle
          </Text>
          <AppHeader
            title="Message"
            subtitle="Ada Lovelace"
            onBack={() => toast.show('Back pressed')}
          />
        </View>

        <View className="w-full gap-1">
          <Text size="xs" variant="muted" weight="medium">
            Back + trailing
          </Text>
          <AppHeader
            title="Account"
            onBack={() => toast.show('Back pressed')}
            trailing={
              <Button
                variant="ghost"
                size="icon-sm"
                accessibilityLabel="Settings"
                icon={<Icon name="settings" size={20} color={foreground} />}
                onPress={() => toast.show('Settings')}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}

export function ButtonGroupDemo() {
  return (
    <View className="w-full gap-6">
      <DocIntro
        title="Button group"
        description="Related actions in a row or column. Horizontal wraps; vertical stacks full-width buttons."
      />

      <View className="w-full gap-1">
        <Text size="xs" variant="muted" weight="medium">
          Pair · end aligned
        </Text>
        <ButtonGroup align="end">
          <Button variant="outline" size="sm" onPress={() => {}}>
            Cancel
          </Button>
          <Button size="sm" onPress={() => {}}>
            Save
          </Button>
        </ButtonGroup>
      </View>

      <View className="w-full gap-1">
        <Text size="xs" variant="muted" weight="medium">
          Wrap
        </Text>
        <ButtonGroup>
          <Button variant="secondary" size="sm" onPress={() => {}}>
            Edit
          </Button>
          <Button variant="secondary" size="sm" onPress={() => {}}>
            Share
          </Button>
          <Button variant="outline" size="sm" onPress={() => {}}>
            Archive
          </Button>
          <Button variant="destructive" size="sm" onPress={() => {}}>
            Delete
          </Button>
        </ButtonGroup>
      </View>

      <View className="w-full gap-1">
        <Text size="xs" variant="muted" weight="medium">
          Vertical
        </Text>
        <ButtonGroup orientation="vertical">
          <Button className="w-full" onPress={() => {}}>
            Continue
          </Button>
          <Button className="w-full" variant="outline" onPress={() => {}}>
            Not now
          </Button>
        </ButtonGroup>
      </View>
    </View>
  );
}

export function FormFieldDemo() {
  const [name, setName] = useState('Ada');
  const [email, setEmail] = useState('not-an-email');

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="Form field"
        description="Label, control, hint, and error around any child. Use Input with an empty label when FormField owns the label."
      />

      <FormField label="Display name" hint="Shown on your public profile" required>
        <Input label="" value={name} onChangeText={setName} accessibilityLabel="Display name" />
      </FormField>

      <FormField label="Email" error="Enter a valid email address" required>
        <Input
          label=""
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Email"
        />
      </FormField>
    </View>
  );
}

export function ListItemDemo() {
  const toast = useToast();
  const [alerts, setAlerts] = useState(true);
  const muted = useThemeColor('muted-foreground');

  return (
    <View className="w-full gap-4">
      <DocIntro
        title="List item"
        description="Full-width rows for settings and menus. Stack several for a grouped list."
      />

      {/* Negative horizontal margin is not used — list is already edge-aware via PageBody padding.
          Rows use full width of the content column with hairline separators. */}
      <View className="w-full overflow-hidden rounded-xl border border-border">
        <ListItem
          title="Profile"
          description="Name, photo, and bio"
          leading={<Avatar size="sm" fallback="Ada Lovelace" />}
          trailing={<Icon name="chevron-right" size={18} color={muted} />}
          onPress={() => toast.show('Profile')}
          className="border-b border-border"
        />
        <ListItem
          title="Security alerts"
          description="Email me about unusual sign-ins"
          trailing={
            <Switch
              checked={alerts}
              onCheckedChange={setAlerts}
              accessibilityLabel="Toggle security alerts"
            />
          }
          className="border-b border-border"
        />
        <ListItem
          title="Sign out"
          description="End this session on this device"
          onPress={() => toast.show('Signed out')}
          className="border-b-0"
        />
      </View>
    </View>
  );
}
