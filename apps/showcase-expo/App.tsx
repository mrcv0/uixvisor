import './global.css';

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';

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

export default function App() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('monthly');

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
