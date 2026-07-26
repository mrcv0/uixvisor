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

import { Specimen } from '../shell/Specimen';

export function AppHeaderDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');

  return (
    <View className="gap-4">
      <Specimen label="Title only">
        <View className="overflow-hidden rounded-lg border border-border">
          <AppHeader title="Inbox" />
        </View>
      </Specimen>

      <Specimen label="With back action">
        <View className="overflow-hidden rounded-lg border border-border">
          <AppHeader title="Message" onBack={() => toast.show('Back pressed')} />
        </View>
      </Specimen>

      <Specimen label="With trailing action">
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
      </Specimen>
    </View>
  );
}

export function ButtonGroupDemo() {
  return (
    <View className="gap-4">
      <Specimen label="Primary pair">
        <ButtonGroup>
          <Button variant="outline" size="sm" onPress={() => {}}>
            Cancel
          </Button>
          <Button size="sm" onPress={() => {}}>
            Save
          </Button>
        </ButtonGroup>
      </Specimen>

      <Specimen label="Wraps on narrow widths">
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
      </Specimen>
    </View>
  );
}

export function FormFieldDemo() {
  const [name, setName] = useState('Ada');
  const [email, setEmail] = useState('not-an-email');

  return (
    <View className="gap-4">
      <FormField label="Display name" hint="Shown on your public profile">
        <Input label="" value={name} onChangeText={setName} accessibilityLabel="Display name" />
      </FormField>
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
    </View>
  );
}

export function ListItemDemo() {
  const toast = useToast();
  const [alerts, setAlerts] = useState(true);
  const muted = useThemeColor('muted-foreground');

  return (
    <View className="gap-2">
      <ListItem
        title="Profile"
        description="Name, photo, and bio"
        leading={<Avatar size="sm" fallback="AL" />}
        trailing={<Icon name="chevron-right" size={18} color={muted} />}
        onPress={() => toast.show('Profile')}
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
      />
      <ListItem
        title="Sign out"
        description="End this session on this device"
        onPress={() => toast.show('Signed out')}
      />
    </View>
  );
}
