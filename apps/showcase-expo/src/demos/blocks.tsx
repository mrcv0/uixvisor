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
import { useThemeColor } from '@registry/theme/theme';
import { useToast } from '@registry/toast/toast';

import { DocIntro, DocSection } from '../shell/DocSection';

export function AppHeaderDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="gap-6">
      <DocIntro
        title="App header"
        description="Top bar for stack screens: title, optional back, optional trailing actions. Previewed inside a clipped frame so the bar reads as a real chrome strip."
      />

      <DocSection title="Title only">
        <View className="overflow-hidden rounded-lg border border-border">
          <AppHeader title="Inbox" />
        </View>
      </DocSection>

      <DocSection title="With back" description="onBack wires navigation.pop in a real stack.">
        <View className="overflow-hidden rounded-lg border border-border">
          <AppHeader title="Message" onBack={() => toast.show('Back pressed')} />
        </View>
      </DocSection>

      <DocSection title="Trailing action" description="Pass icon buttons or any node in trailing.">
        <View className="overflow-hidden rounded-lg border border-border">
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
      </DocSection>
    </View>
  );
}

export function ButtonGroupDemo() {
  return (
    <View className="gap-6">
      <DocIntro
        title="Button group"
        description="Horizontal wrap of related actions. Prefer sm buttons so pairs and tool strips stay compact."
      />

      <DocSection title="Primary pair" description="Cancel + confirm is the usual pattern.">
        <ButtonGroup>
          <Button variant="outline" size="sm" onPress={() => {}}>
            Cancel
          </Button>
          <Button size="sm" onPress={() => {}}>
            Save
          </Button>
        </ButtonGroup>
      </DocSection>

      <DocSection title="Wrap" description="Extra actions flow to the next line on narrow widths.">
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
      </DocSection>
    </View>
  );
}

export function FormFieldDemo() {
  const [name, setName] = useState('Ada');
  const [email, setEmail] = useState('not-an-email');

  return (
    <View className="gap-6">
      <DocIntro
        title="Form field"
        description="Label, control slot, hint, and error around any control. Pair with Input (label empty) when the field owns the label."
      />

      <DocSection title="Hint" description="Hint shows when there is no error.">
        <FormField label="Display name" hint="Shown on your public profile">
          <Input label="" value={name} onChangeText={setName} accessibilityLabel="Display name" />
        </FormField>
      </DocSection>

      <DocSection title="Error" description="Error replaces hint and surfaces to assistive tech.">
        <FormField label="Email" error="Enter a valid email address">
          <Input
            label=""
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email"
          />
        </FormField>
      </DocSection>
    </View>
  );
}

export function ListItemDemo() {
  const toast = useToast();
  const [alerts, setAlerts] = useState(true);
  const muted = useThemeColor('muted-foreground');

  return (
    <View className="gap-6">
      <DocIntro
        title="List item"
        description="Pressable row with leading, title, description, and trailing slots. Building block for settings and menus."
      />

      <DocSection title="Navigation row">
        <ListItem
          title="Profile"
          description="Name, photo, and bio"
          leading={<Avatar size="sm" fallback="AL" />}
          trailing={<Icon name="chevron-right" size={18} color={muted} />}
          onPress={() => toast.show('Profile')}
        />
      </DocSection>

      <DocSection title="With switch" description="Trailing can host Switch or other controls.">
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
        />
      </DocSection>

      <DocSection title="Destructive action">
        <ListItem
          title="Sign out"
          description="End this session on this device"
          onPress={() => toast.show('Signed out')}
        />
      </DocSection>
    </View>
  );
}
