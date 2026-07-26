import { View } from 'react-native';

import { AuthenticatedHomeFlow } from '@registry/authenticated-home/authenticated-home';
import { EmailAuthFlow } from '@registry/email-auth/email-auth';
import { Icon } from '@registry/icon/icon';
import { OnboardingFlow } from '@registry/onboarding/onboarding';
import { PhoneAuthFlow } from '@registry/phone-auth/phone-auth';
import { useToast } from '@registry/toast/toast';
import { useThemeColor } from '@registry/theme/theme';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Flows are multi-step skeletons with adapter callbacks.
 * Live fullscreen — toasts stand in for real routers and backends.
 */

export function AuthenticatedHomeDemo() {
  const toast = useToast();

  return (
    <AuthenticatedHomeFlow
      className="flex-1"
      userName="Ada"
      onNavigate={(target) => {
        toast.show(`Navigate → ${target}`);
      }}
      onSignOut={async () => {
        await delay(500);
        toast.show('Signed out');
      }}
    />
  );
}

export function EmailAuthDemo() {
  const toast = useToast();

  return (
    <EmailAuthFlow
      className="flex-1"
      requireOtpAfterSignIn
      requireOtpAfterSignUp
      onSignIn={async ({ email }) => {
        await delay(500);
        toast.show(`Signed in ${email} — verify email`);
        return { needsOtp: true };
      }}
      onSignUp={async ({ email }) => {
        await delay(500);
        toast.show(`Account created for ${email}`);
        return { needsOtp: true };
      }}
      onVerifyOtp={async (code) => {
        await delay(400);
        toast.show(`OTP ${code} accepted`);
      }}
      onResendOtp={async () => {
        await delay(400);
        toast.show('Code resent');
      }}
      onComplete={({ mode }) => {
        toast.show(`Email auth complete (${mode})`);
      }}
      onForgotPasswordPress={() => toast.show('Forgot password')}
    />
  );
}

export function PhoneAuthDemo() {
  const toast = useToast();

  return (
    <PhoneAuthFlow
      className="flex-1"
      onRequestCode={async ({ phone }) => {
        await delay(500);
        toast.show(`Code sent to ${phone}`);
        return {};
      }}
      onVerifyOtp={async (code, { phone }) => {
        await delay(400);
        toast.show(`Verified ${code} for ${phone}`);
      }}
      onResendOtp={async ({ phone }) => {
        await delay(400);
        toast.show(`Resent to ${phone}`);
      }}
      onComplete={({ phone }) => {
        toast.show(`Phone auth complete (${phone})`);
      }}
    />
  );
}

export function OnboardingDemo() {
  const toast = useToast();
  const primary = useThemeColor('primary');

  return (
    <OnboardingFlow
      className="flex-1"
      steps={[
        {
          id: 'welcome',
          title: 'Welcome to UIXVISOR',
          description: 'Copy-and-own mobile UI blocks for Expo — tokens, primitives, screens, flows.',
          media: (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Icon name="package" size={36} color={primary} />
            </View>
          ),
        },
        {
          id: 'theme',
          title: 'Theme-aware by default',
          description: 'Semantic tokens keep light and dark mode consistent without hard-coded colours.',
          media: (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Icon name="sun" size={36} color={primary} />
            </View>
          ),
        },
        {
          id: 'ship',
          title: 'Ship faster',
          description: 'Compose auth, profile, and settings from registry screens — then own the code.',
          media: (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Icon name="check" size={36} color={primary} />
            </View>
          ),
        },
      ]}
      onComplete={() => toast.show('Onboarding complete')}
      onSkip={() => toast.show('Onboarding skipped')}
    />
  );
}
