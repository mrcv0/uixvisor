// UIXVISOR — https://uixvisor.dev/screens/otp-verify
//
// Content-only screen: host owns delivery channel and verification backend.
import { forwardRef, useState, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Button } from '@registry/button/button';
import {
  bindTextInput,
  ControlledField,
  createFormSubmitHandler,
  FormRootError,
  useAppForm,
  useFormRootError,
} from '@registry/form-adapter/form-adapter';
import { otpVerifySchema } from '@registry/auth-schemas/auth-schemas';
import { Heading } from '@registry/heading/heading';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { OTPInput } from '@registry/otp-input/otp-input';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface OtpVerifyScreenProps extends ViewProps {
  onSubmit: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  /** e.g. "a***@example.com" or "+1 ••• ••• 1234" — shown under the subtitle. */
  destinationLabel?: string;
  headerTitle?: string;
  onBack?: () => void;
  className?: string;
}

export const OtpVerifyScreen = forwardRef<ComponentRef<typeof View>, OtpVerifyScreenProps>(
  (
    { onSubmit, onResend, destinationLabel, headerTitle, onBack, className, ...props },
    ref,
  ) => {
    const [pending, setPending] = useState(false);
    const [resendPending, setResendPending] = useState(false);
    const form = useAppForm({
      schema: otpVerifySchema,
      defaultValues: { code: '' },
    });
    const formRootError = useFormRootError(form);
    const showHeader = Boolean(headerTitle || onBack);

    const handleSubmit = createFormSubmitHandler(
      form,
      async (values) => {
        await onSubmit(values.code);
      },
      {
        onPendingChange: setPending,
        fieldOrder: ['code'],
      },
    );

    const handleResend =
      onResend &&
      (async () => {
        if (resendPending) return;
        try {
          setResendPending(true);
          await onResend();
        } finally {
          setResendPending(false);
        }
      });

    return (
      <View
        ref={ref}
        accessibilityLabel="OTP verification"
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        {showHeader ? (
          <AppHeader title={headerTitle ?? 'Verify'} onBack={onBack} />
        ) : null}
        <KeyboardAwareForm
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1.5">
            <Heading level={2}>Verify your code</Heading>
            <Text variant="muted" size="sm">
              Enter the 6-digit code we sent
              {destinationLabel ? (
                <>
                  {' '}
                  to{' '}
                  <Text size="sm" weight="medium">
                    {destinationLabel}
                  </Text>
                </>
              ) : (
                ' to your inbox'
              )}
              .
            </Text>
          </View>
          <FormRootError message={formRootError} />
          <ControlledField control={form.control} name="code">
            {(field) => {
              const { ref: inputRef, ...inputProps } = bindTextInput(field);
              return (
                <OTPInput
                  ref={inputRef}
                  {...inputProps}
                  error={field.error}
                  onResend={handleResend || undefined}
                />
              );
            }}
          </ControlledField>
          {resendPending ? (
            <Text size="xs" variant="muted" accessibilityLiveRegion="polite">
              Sending a new code…
            </Text>
          ) : null}
          <Button loading={pending} onPress={handleSubmit}>
            Verify
          </Button>
        </KeyboardAwareForm>
      </View>
    );
  },
);
OtpVerifyScreen.displayName = 'OtpVerifyScreen';
