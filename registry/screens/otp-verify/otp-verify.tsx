// UIXVISOR — https://uixvisor.dev/screens/otp-verify
import { forwardRef, useState, type ComponentRef } from 'react';
import { Alert, Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { OTPInput } from '@registry/otp-input/otp-input';
import { Text as UText } from '@registry/text/text';

export interface OtpVerifyScreenProps extends ViewProps {
  onSubmit: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
}

export const OtpVerifyScreen = forwardRef<ComponentRef<typeof View>, OtpVerifyScreenProps>(
  ({ onSubmit, onResend, className, ...props }, ref) => {
    const [code, setCode] = useState('');
    const [pending, setPending] = useState(false);

    return (
      <View
        ref={ref}
        accessibilityLabel="OTP verification"
        className={`flex-1 gap-6 bg-background p-6${className ? ` ${className}` : ''}`}
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Verify your code</Text>
        <UText variant="muted">Enter the 6-digit code we sent to your inbox.</UText>
        <OTPInput value={code} onChangeText={setCode} onResend={onResend} />
        <Button
          loading={pending}
          onPress={async () => {
            try {
              setPending(true);
              await onSubmit(code);
            } catch (error) {
              Alert.alert('Verification failed', (error as Error).message);
            } finally {
              setPending(false);
            }
          }}
        >
          Verify
        </Button>
      </View>
    );
  },
);
OtpVerifyScreen.displayName = 'OtpVerifyScreen';
