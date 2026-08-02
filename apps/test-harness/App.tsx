import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { EmailAuthFlow } from '../../registry/flows/email-auth/email-auth';
import { OnboardingFlow } from '../../registry/flows/onboarding/onboarding';
import { PhoneAuthFlow } from '../../registry/flows/phone-auth/phone-auth';
import { Button } from '../../registry/primitives/button/button';
import { Heading } from '../../registry/primitives/heading/heading';
import { Input } from '../../registry/primitives/input/input';
import { Text } from '../../registry/primitives/text/text';
import { BottomSheet } from '../../registry/mobile/bottom-sheet/bottom-sheet';
import { OTPInput } from '../../registry/mobile/otp-input/otp-input';

import './global.css';

type HarnessScreen = 'home' | 'email-auth' | 'phone-auth' | 'onboarding' | 'complete';

interface CompletionState {
  title: string;
  detail: string;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to UIXVISOR',
    description: 'Build native product flows from source you own.',
  },
  {
    id: 'theme',
    title: 'Choose your theme',
    description: 'Start with Default or Fintech, then tune semantic tokens.',
  },
  {
    id: 'ship',
    title: 'Ready to ship',
    description: 'Validate the flow on iOS and Android before release.',
  },
];

export default function App() {
  const [screen, setScreen] = useState<HarnessScreen>('home');
  const [completion, setCompletion] = useState<CompletionState | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);

  const finishFlow = (title: string, detail: string) => {
    setCompletion({ title, detail });
    setScreen('complete');
  };

  const returnHome = () => {
    setCompletion(null);
    setScreen('home');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" />
        {screen === 'home' ? (
          <>
            <ScrollView
              contentContainerClassName="gap-6 p-6"
              keyboardShouldPersistTaps="handled"
            >
              <View className="gap-2">
                <Heading>UIXVISOR test harness</Heading>
                <Text variant="muted">Expo SDK 57 registry integration surface</Text>
              </View>

              <View className="gap-3">
                <Heading level={2}>Critical flows</Heading>
                <Button
                  className="w-full"
                  testID="flow-email-auth"
                  onPress={() => setScreen('email-auth')}
                >
                  Test email auth
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  testID="flow-phone-auth"
                  onPress={() => setScreen('phone-auth')}
                >
                  Test phone auth
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  testID="flow-onboarding"
                  onPress={() => setScreen('onboarding')}
                >
                  Test onboarding
                </Button>
              </View>

              <View className="gap-4">
                <Heading level={2}>Component smoke tests</Heading>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <OTPInput
                  testID="otp-code-input"
                  value={code}
                  onChangeText={setCode}
                  onResend={() => setCode('')}
                />

                <Button testID="open-sheet" onPress={() => setSheetVisible(true)}>
                  Open sheet
                </Button>
              </View>
            </ScrollView>

            <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
              <Heading level={3}>Sheet title</Heading>
              <Text>This screen exercises registry primitives and mobile components.</Text>
              <Button variant="secondary" onPress={() => setSheetVisible(false)}>
                Close sheet
              </Button>
            </BottomSheet>
          </>
        ) : null}

        {screen === 'email-auth' ? (
          <EmailAuthFlow
            testID="email-auth-flow"
            requireOtpAfterSignIn
            onSignIn={async () => ({
              needsOtp: true,
              destinationLabel: 'a***@example.com',
            })}
            onSignUp={async () => ({
              needsOtp: true,
              destinationLabel: 'a***@example.com',
            })}
            onVerifyOtp={async () => undefined}
            onResendOtp={async () => undefined}
            onComplete={({ mode }) =>
              finishFlow('Email auth complete', `Completed ${mode} with OTP verification.`)
            }
          />
        ) : null}

        {screen === 'phone-auth' ? (
          <PhoneAuthFlow
            testID="phone-auth-flow"
            onRequestCode={async () => ({ destinationLabel: '••• ••• 0100' })}
            onVerifyOtp={async () => undefined}
            onResendOtp={async () => undefined}
            onComplete={({ phone }) =>
              finishFlow('Phone auth complete', `Verified ${phone.slice(-4)} with OTP.`)
            }
            onBackFromPhone={returnHome}
          />
        ) : null}

        {screen === 'onboarding' ? (
          <OnboardingFlow
            testID="onboarding-flow"
            steps={onboardingSteps}
            onSkip={() => finishFlow('Onboarding skipped', 'Skip callback completed.')}
            onComplete={() =>
              finishFlow('Onboarding complete', 'Completed all three onboarding steps.')
            }
          />
        ) : null}

        {screen === 'complete' && completion ? (
          <View
            testID="flow-complete"
            accessibilityLabel={completion.title}
            className="flex-1 items-center justify-center gap-4 p-6"
          >
            <Heading level={2} className="text-center">
              {completion.title}
            </Heading>
            <Text variant="muted" className="text-center">
              {completion.detail}
            </Text>
            <Button testID="back-to-harness" onPress={returnHome}>
              Back to harness
            </Button>
          </View>
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
