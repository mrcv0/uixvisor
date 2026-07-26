import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@registry/button/button';
import { DashboardScreen } from '@registry/dashboard/dashboard';
import { OtpVerifyScreen } from '@registry/otp-verify/otp-verify';
import { ProfileScreen } from '@registry/profile/profile';
import { SettingsScreen } from '@registry/settings/settings';
import { SignInScreen } from '@registry/sign-in/sign-in';
import { SignUpScreen } from '@registry/sign-up/sign-up';
import { useToast } from '@registry/toast/toast';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Fullscreen demos fill the remaining viewport under chrome (or as full root). */
export function SignInDemo() {
  const toast = useToast();
  return (
    <SignInScreen
      className="flex-1"
      onSubmit={async ({ email }) => {
        await delay(600);
        toast.show(`Signed in as ${email || 'user'}`);
      }}
    />
  );
}

export function SignUpDemo() {
  const toast = useToast();
  return (
    <SignUpScreen
      className="flex-1"
      onSubmit={async ({ name }) => {
        await delay(600);
        toast.show(`Welcome, ${name || 'friend'}`);
      }}
    />
  );
}

export function OtpVerifyDemo() {
  const toast = useToast();
  return (
    <OtpVerifyScreen
      className="flex-1"
      onSubmit={async (code) => {
        await delay(500);
        toast.show(`Verified ${code || 'code'}`);
      }}
      onResend={async () => {
        await delay(300);
        toast.show('Code resent');
      }}
    />
  );
}

export function DashboardDemo() {
  return (
    <DashboardScreen
      className="flex-1"
      greeting="Good morning, Ada"
      highlights={[
        { id: 'rev', title: 'Revenue', value: '$24,800' },
        { id: 'users', title: 'Active users', value: '1,284' },
        { id: 'conv', title: 'Conversion', value: '3.8%' },
      ]}
    >
      <Button variant="secondary" onPress={() => {}}>
        View reports
      </Button>
    </DashboardScreen>
  );
}

export function ProfileDemo() {
  const toast = useToast();
  return (
    <ProfileScreen
      className="flex-1"
      name="Ada Lovelace"
      email="ada@analytical.engine"
      bio="Mathematician. Writer of the first algorithm intended for a machine."
    >
      <View className="w-full gap-2 pt-2">
        <Button onPress={() => toast.show('Edit profile')}>Edit profile</Button>
        <Button variant="outline" onPress={() => toast.show('Share')}>
          Share
        </Button>
      </View>
    </ProfileScreen>
  );
}

export function SettingsDemo() {
  const toast = useToast();
  const insets = useSafeAreaInsets();

  return (
    <SettingsScreen
      className="flex-1"
      style={{ paddingBottom: insets.bottom }}
      initialNotifications
      initialBiometrics={false}
      onChange={(settings) => {
        toast.show(
          `Notifications ${settings.notifications ? 'on' : 'off'} · Biometrics ${
            settings.biometrics ? 'on' : 'off'
          }`,
        );
      }}
    />
  );
}
