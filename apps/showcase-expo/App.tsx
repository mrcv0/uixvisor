import './global.css';

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';

import { Button } from '../../registry/primitives/button/button';
import { Text } from '../../registry/primitives/text/text';
import { Input } from '../../registry/primitives/input/input';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="items-center gap-3 px-6 py-16"
    >
      <Text size="lg" className="mb-2 font-medium">
        UIXVISOR showcase
      </Text>

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
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}
