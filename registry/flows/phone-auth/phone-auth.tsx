// UIXVISOR — https://uixvisor.dev/flows/phone-auth
//
// Phone number → OTP verification skeleton. Host sends SMS and verifies codes.
import { forwardRef, useState, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import {
  bindTextInput,
  ControlledFormField,
  createFormSubmitHandler,
  FormRootError,
  useAppForm,
  useFormRootError,
} from '@registry/form-adapter/form-adapter';
import {
  phoneLoginSchema,
  type PhoneLoginValues,
} from '@registry/auth-schemas/auth-schemas';
import { Button } from '@registry/button/button';
import { Heading } from '@registry/heading/heading';
import { Input } from '@registry/input/input';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { OtpVerifyScreen } from '@registry/otp-verify/otp-verify';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export type PhoneAuthStep = 'phone' | 'otp';

export interface PhoneAuthFlowProps extends ViewProps {
  initialStep?: PhoneAuthStep;
  /** Called when the user submits a phone number; host sends the OTP. */
  onRequestCode: (input: PhoneLoginValues) => Promise<{ destinationLabel?: string } | void>;
  onVerifyOtp: (code: string, context: { phone: string }) => Promise<void>;
  onResendOtp?: (context: { phone: string }) => Promise<void>;
  onComplete: (result: { phone: string }) => void;
  onBackFromPhone?: () => void;
  className?: string;
}

export const PhoneAuthFlow = forwardRef<ComponentRef<typeof View>, PhoneAuthFlowProps>(
  (
    {
      initialStep = 'phone',
      onRequestCode,
      onVerifyOtp,
      onResendOtp,
      onComplete,
      onBackFromPhone,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<PhoneAuthStep>(initialStep);
    const [phone, setPhone] = useState('');
    const [destinationLabel, setDestinationLabel] = useState<string | undefined>();
    const [pending, setPending] = useState(false);

    const form = useAppForm({
      schema: phoneLoginSchema,
      defaultValues: { phone: '' },
    });
    const formRootError = useFormRootError(form);

    const handlePhoneSubmit = createFormSubmitHandler(
      form,
      async (values) => {
        const result = await onRequestCode(values);
        setPhone(values.phone);
        setDestinationLabel(result?.destinationLabel ?? maskPhone(values.phone));
        setStep('otp');
      },
      {
        onPendingChange: setPending,
        fieldOrder: ['phone'],
      },
    );

    return (
      <View
        ref={ref}
        accessibilityLabel="Phone authentication"
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        {step === 'phone' ? (
          <View className="flex-1">
            {onBackFromPhone ? (
              <AppHeader title="Phone sign in" onBack={onBackFromPhone} />
            ) : null}
            <KeyboardAwareForm
              className="flex-1"
              contentContainerClassName="gap-6 p-6"
              keyboardShouldPersistTaps="handled"
            >
              <View className="gap-1.5">
                <Heading level={2}>Enter your phone</Heading>
                <Text variant="muted" size="sm">
                  We will text you a one-time code to verify it is you.
                </Text>
              </View>
              <FormRootError message={formRootError} />
              <ControlledFormField
                control={form.control}
                name="phone"
                label="Phone number"
                required
                hint="Include country code, e.g. +1 555 0100"
              >
                {(field) => {
                  const { ref: inputRef, ...inputProps } = bindTextInput(field);
                  return (
                    <Input
                      ref={inputRef}
                      label=""
                      {...inputProps}
                      keyboardType="phone-pad"
                      textContentType="telephoneNumber"
                      autoComplete="tel"
                      accessibilityLabel="Phone number"
                      placeholder="+1 555 0100"
                    />
                  );
                }}
              </ControlledFormField>
              <Button
                testID="phone-auth-continue"
                loading={pending}
                onPress={handlePhoneSubmit}
              >
                Continue
              </Button>
            </KeyboardAwareForm>
          </View>
        ) : null}

        {step === 'otp' ? (
          <OtpVerifyScreen
            className="flex-1"
            destinationLabel={destinationLabel}
            headerTitle="Verify phone"
            onBack={() => setStep('phone')}
            onSubmit={async (code) => {
              await onVerifyOtp(code, { phone });
              onComplete({ phone });
            }}
            onResend={
              onResendOtp
                ? async () => {
                    await onResendOtp({ phone });
                  }
                : undefined
            }
          />
        ) : null}
      </View>
    );
  },
);
PhoneAuthFlow.displayName = 'PhoneAuthFlow';

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  const tail = digits.slice(-4);
  return `••• ••• ${tail}`;
}
