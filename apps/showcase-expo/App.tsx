import './global.css';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { Button } from '../../registry/primitives/button/button';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
      <Text className="mb-2 text-foreground">UIXVISOR showcase — Button</Text>
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
      <StatusBar style="auto" />
    </View>
  );
}
