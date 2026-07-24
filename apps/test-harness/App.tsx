import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Button } from '../../registry/primitives/button/button';
import { Heading } from '../../registry/primitives/heading/heading';
import { Input } from '../../registry/primitives/input/input';
import { Text } from '../../registry/primitives/text/text';
import { BottomSheet } from '../../registry/mobile/bottom-sheet/bottom-sheet';
import { OTPInput } from '../../registry/mobile/otp-input/otp-input';

import './global.css';

export default function App() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" />
        <ScrollView contentContainerClassName="gap-6 p-6" keyboardShouldPersistTaps="handled">
          <View className="gap-2">
            <Heading>UIXVISOR test harness</Heading>
            <Text variant="muted">Expo SDK 57 registry integration surface</Text>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <OTPInput value={code} onChangeText={setCode} onResend={() => setCode('')} />

          <Button testID="open-sheet" onPress={() => setSheetVisible(true)}>
            Open sheet
          </Button>
        </ScrollView>

        <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
          <Heading level={3}>Sheet title</Heading>
          <Text>This screen exercises registry primitives and mobile components.</Text>
          <Button variant="secondary" onPress={() => setSheetVisible(false)}>
            Close sheet
          </Button>
        </BottomSheet>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
