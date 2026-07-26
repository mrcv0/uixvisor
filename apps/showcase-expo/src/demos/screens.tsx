import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@registry/button/button';
import { DashboardScreen } from '@registry/dashboard/dashboard';
import { ListItem } from '@registry/list-item/list-item';
import { OtpVerifyScreen } from '@registry/otp-verify/otp-verify';
import { ProfileScreen } from '@registry/profile/profile';
import { Separator } from '@registry/separator/separator';
import { SettingsScreen } from '@registry/settings/settings';
import { SignInScreen } from '@registry/sign-in/sign-in';
import { SignUpScreen } from '@registry/sign-up/sign-up';
import { Switch } from '@registry/switch/switch';
import { Text } from '@registry/text/text';
import { useToast } from '@registry/toast/toast';
import { useState } from 'react';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Screens are fullscreen live previews under the showcase chrome.
 * Callbacks are mocked with toast — host owns real navigation and backends.
 */

export function SignInDemo() {
  const toast = useToast();
  return (
    <SignInScreen
      className="flex-1"
      onSubmit={async ({ email }) => {
        await delay(600);
        toast.show(`Signed in as ${email}`);
      }}
      onForgotPasswordPress={() => toast.show('Forgot password')}
      onSignUpPress={() => toast.show('Navigate to sign up')}
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
        toast.show(`Welcome, ${name}`);
      }}
      onSignInPress={() => toast.show('Navigate to sign in')}
    />
  );
}

export function OtpVerifyDemo() {
  const toast = useToast();
  return (
    <OtpVerifyScreen
      className="flex-1"
      destinationLabel="a***@example.com"
      onSubmit={async (code) => {
        await delay(500);
        toast.show(`Verified ${code}`);
      }}
      onResend={async () => {
        await delay(800);
        toast.show('Code resent');
      }}
    />
  );
}

export function DashboardDemo() {
  const toast = useToast();
  return (
    <DashboardScreen
      className="flex-1"
      greeting="Good morning, Ada"
      subtitle="Here is what changed since yesterday."
      highlights={[
        { id: 'rev', title: 'Revenue', value: '$24,800', hint: '+12% vs last week' },
        { id: 'users', title: 'Active users', value: '1,284' },
        { id: 'conv', title: 'Conversion', value: '3.8%' },
      ]}
    >
      <Button
        className="w-full"
        variant="secondary"
        onPress={() => toast.show('View reports')}
      >
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
      actions={
        <>
          <Button className="w-full" onPress={() => toast.show('Edit profile')}>
            Edit profile
          </Button>
          <Button className="w-full" variant="outline" onPress={() => toast.show('Share')}>
            Share
          </Button>
        </>
      }
    />
  );
}

export function SettingsDemo() {
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const [marketing, setMarketing] = useState(false);

  return (
    <SettingsScreen
      className="flex-1"
      style={{ paddingBottom: insets.bottom }}
      defaultNotifications
      defaultBiometrics={false}
      onChange={(settings) => {
        toast.show(
          `Notifications ${settings.notifications ? 'on' : 'off'} · Biometrics ${
            settings.biometrics ? 'on' : 'off'
          }`,
        );
      }}
    >
      <View className="gap-2">
        <Text size="sm" weight="medium">
          More
        </Text>
        <View className="overflow-hidden rounded-xl border border-border bg-card">
          <ListItem
            title="Marketing emails"
            description="Occasional product news"
            trailing={
              <Switch
                checked={marketing}
                onCheckedChange={setMarketing}
                accessibilityLabel="Toggle marketing emails"
              />
            }
          />
          <Separator className="ml-4" />
          <ListItem
            title="Privacy policy"
            description="How we handle your data"
            onPress={() => toast.show('Open privacy policy')}
          />
        </View>
      </View>
    </SettingsScreen>
  );
}
