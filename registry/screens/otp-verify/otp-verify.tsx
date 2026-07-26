// UIXVISOR — https://uixvisor.dev/screens/otp-verify
import { forwardRef, useState, type ComponentRef } from 'react';
import { Controller } from 'react-hook-form';
import { Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { rootError, useAppForm } from '@registry/form-adapter/form-adapter';
import { otpVerifySchema } from '@registry/auth-schemas/auth-schemas';
import { OTPInput } from '@registry/otp-input/otp-input';
import { Text as UText } from '@registry/text/text';

export interface OtpVerifyScreenProps extends ViewProps {
  onSubmit: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
}

export const OtpVerifyScreen = forwardRef<ComponentRef<typeof View>, OtpVerifyScreenProps>(
  ({ onSubmit, onResend, className, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: otpVerifySchema,
      defaultValues: { code: '' },
    });
    const formRootError = rootError(form);

    return (
      <View
        ref={ref}
        accessibilityLabel="OTP verification"
        className={`flex-1 gap-6 bg-background p-6${className ? ` ${className}` : ''}`}
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Verify your code</Text>
        <UText variant="muted">Enter the 6-digit code we sent to your inbox.</UText>
        {formRootError ? (
          <UText variant="destructive" size="sm" accessibilityLiveRegion="polite">
            {formRootError}
          </UText>
        ) : null}
        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <OTPInput
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              onResend={onResend}
            />
          )}
        />
        <Button
          loading={pending}
          onPress={form.handleSubmit(async (values) => {
            try {
              setPending(true);
              form.clearErrors('root');
              await onSubmit(values.code);
            } catch (error) {
              form.setError('root', { message: (error as Error).message });
            } finally {
              setPending(false);
            }
          })}
        >
          Verify
        </Button>
      </View>
    );
  },
);
OtpVerifyScreen.displayName = 'OtpVerifyScreen';
