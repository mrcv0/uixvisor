import { useState } from 'react';
import { View } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Avatar } from '@registry/avatar/avatar';
import { Badge } from '@registry/badge/badge';
import { Button } from '@registry/button/button';
import { ButtonGroup } from '@registry/button-group/button-group';
import { ControlledFormField, useAppForm } from '@registry/form-adapter/form-adapter';
import { FormField } from '@registry/form-field/form-field';
import { Icon } from '@registry/icon/icon';
import { Input } from '@registry/input/input';
import { ListItem } from '@registry/list-item/list-item';
import { Separator } from '@registry/separator/separator';
import { Switch } from '@registry/switch/switch';
import { Text } from '@registry/text/text';
import { Textarea } from '@registry/textarea/textarea';
import { useThemeColor } from '@registry/theme/theme';
import { useToast } from '@registry/toast/toast';
import { z } from 'zod';

import { DocIntro, DocSection } from '../shell/DocSection';

/** Thin label above a full-width specimen (no card frame). */
function Sample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="w-full gap-1.5">
      <Text size="xs" variant="muted" weight="medium">
        {label}
      </Text>
      {children}
    </View>
  );
}

/**
 * Single surface for a stack of ListItems.
 * Rows stay transparent — only this wrapper has border/bg (no double box).
 */
function ListGroup({ children }: { children: React.ReactNode }) {
  return (
    <View className="w-full overflow-hidden rounded-xl border border-border bg-card">
      {children}
    </View>
  );
}

export function AppHeaderDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');
  const onPrimary = useThemeColor('primary-foreground');

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="App header"
        description="Built from Button, Icon, and Text. Equal side slots keep the title centred."
      />

      <Sample label="Title only">
        <AppHeader title="Inbox" />
      </Sample>

      <Sample label="Back + subtitle">
        <AppHeader
          title="Message"
          subtitle="Ada Lovelace"
          onBack={() => toast.show('Back pressed')}
        />
      </Sample>

      <Sample label="Back + trailing icon">
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
      </Sample>

      <Sample label="Custom leading">
        <AppHeader
          title="Compose"
          leading={
            <Button
              variant="ghost"
              size="icon-sm"
              accessibilityLabel="Close"
              icon={<Icon name="close" size={20} color={foreground} />}
              onPress={() => toast.show('Closed')}
            />
          }
          trailing={
            <Button
              size="icon-sm"
              accessibilityLabel="Send"
              icon={<Icon name="check" size={20} color={onPrimary} weight="bold" />}
              onPress={() => toast.show('Sent')}
            />
          }
        />
      </Sample>
    </View>
  );
}

export function ButtonGroupDemo() {
  const toast = useToast();
  const foreground = useThemeColor('foreground');
  const onPrimary = useThemeColor('primary-foreground');

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="Button group"
        description="Composes Button primitives. Horizontal wrap, alignment, or vertical stack."
      />

      <Sample label="Confirm pair · end">
        <ButtonGroup align="end">
          <Button variant="outline" size="sm" onPress={() => toast.show('Cancelled')}>
            Cancel
          </Button>
          <Button size="sm" onPress={() => toast.show('Saved')}>
            Save
          </Button>
        </ButtonGroup>
      </Sample>

      <Sample label="Between (space-between)">
        <ButtonGroup align="between">
          <Button variant="ghost" size="sm" onPress={() => {}}>
            Back
          </Button>
          <Button size="sm" onPress={() => {}}>
            Next
          </Button>
        </ButtonGroup>
      </Sample>

      <Sample label="Wrap">
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
      </Sample>

      <Sample label="Icon strip">
        <ButtonGroup>
          <Button
            size="icon-sm"
            variant="outline"
            accessibilityLabel="Search"
            icon={<Icon name="search" size={18} color={foreground} />}
            onPress={() => {}}
          />
          <Button
            size="icon-sm"
            variant="outline"
            accessibilityLabel="Filter"
            icon={<Icon name="settings" size={18} color={foreground} />}
            onPress={() => {}}
          />
          <Button
            size="icon-sm"
            accessibilityLabel="Add"
            icon={<Icon name="plus" size={18} color={onPrimary} />}
            onPress={() => {}}
          />
        </ButtonGroup>
      </Sample>

      <Sample label="Vertical">
        <ButtonGroup orientation="vertical">
          <Button className="w-full" onPress={() => {}}>
            Continue
          </Button>
          <Button className="w-full" variant="outline" onPress={() => {}}>
            Not now
          </Button>
        </ButtonGroup>
      </Sample>
    </View>
  );
}

const formFieldLiveSchema = z.object({
  name: z.string().trim().min(1, 'Display name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  bio: z.string().optional(),
});

export function FormFieldDemo() {
  const [notes] = useState('');
  const form = useAppForm({
    schema: formFieldLiveSchema,
    defaultValues: { name: 'Ada', email: 'not-an-email', bio: '' },
  });

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="Form field"
        description="Label, control slot, hint, and error. With the form adapter, errors come from Zod on blur/submit — not hardcoded props."
      />

      <DocSection title="Live (adapter)" description="Submit to validate. Label lives on FormField; Input keeps label empty to avoid double chrome.">
        <ControlledFormField
          control={form.control}
          name="name"
          label="Display name"
          hint="Shown on your public profile"
          required
        >
          {(field) => (
            <Input
              label=""
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              accessibilityLabel="Display name"
            />
          )}
        </ControlledFormField>
        <ControlledFormField control={form.control} name="email" label="Email" required>
          {(field) => (
            <Input
              label=""
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              accessibilityLabel="Email"
            />
          )}
        </ControlledFormField>
        <ControlledFormField control={form.control} name="bio" label="Bio" hint="Optional short intro">
          {(field) => (
            <Textarea
              label=""
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Tell people about yourself"
              accessibilityLabel="Bio"
              rows={3}
            />
          )}
        </ControlledFormField>
        <Button onPress={form.handleSubmit(() => undefined)}>Validate fields</Button>
      </DocSection>

      <DocSection title="Static error chrome" description="Without the adapter, pass error as a string prop (docs / design review).">
        <FormField label="Internal notes" error="Notes are required for review">
          <Textarea
            label=""
            value={notes}
            accessibilityLabel="Internal notes"
            rows={3}
          />
        </FormField>
      </DocSection>
    </View>
  );
}

export function ListItemDemo() {
  const toast = useToast();
  const [alerts, setAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const muted = useThemeColor('muted-foreground');
  const foreground = useThemeColor('foreground');

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="List item"
        description="Built on Text. Stack rows in a grouped surface; use Separator between items. Switch rows omit onPress so the control stays tappable."
      />

      <Sample label="Navigation group">
        <ListGroup>
          <ListItem
            title="Profile"
            description="Name, photo, and bio"
            leading={<Avatar size="sm" fallback="Ada Lovelace" />}
            trailing={<Icon name="chevron-right" size={18} color={muted} />}
            onPress={() => toast.show('Profile')}
          />
          <Separator />
          <ListItem
            title="Notifications"
            description="Email and push preferences"
            leading={
              <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Icon name="inbox" size={16} color={foreground} />
              </View>
            }
            trailing={<Icon name="chevron-right" size={18} color={muted} />}
            onPress={() => toast.show('Notifications')}
          />
          <Separator />
          <ListItem
            title="Privacy"
            leading={
              <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Icon name="user" size={16} color={foreground} />
              </View>
            }
            trailing={
              <View className="flex-row items-center gap-2">
                <Badge appearance="soft" variant="secondary">
                  New
                </Badge>
                <Icon name="chevron-right" size={18} color={muted} />
              </View>
            }
            onPress={() => toast.show('Privacy')}
          />
        </ListGroup>
      </Sample>

      <Sample label="Toggles (no row press)">
        <ListGroup>
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
          <Separator />
          <ListItem
            title="Dark mode"
            description="Use system appearance when off"
            trailing={
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                accessibilityLabel="Toggle dark mode"
              />
            }
          />
        </ListGroup>
      </Sample>

      <Sample label="Title only + destructive">
        <ListGroup>
          <ListItem title="Language" trailing={<Text size="sm" variant="muted">English</Text>} onPress={() => {}} />
          <Separator />
          <ListItem
            title="Sign out"
            description="End this session on this device"
            onPress={() => toast.show('Signed out')}
          />
          <Separator />
          <ListItem
            title="Delete account"
            description="This cannot be undone"
            disabled
            onPress={() => {}}
          />
        </ListGroup>
      </Sample>
    </View>
  );
}
