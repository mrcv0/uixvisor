// UIXVISOR — https://uixvisor.dev/screens/otp-verify
import { forwardRef, useState, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

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
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
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
    const formRootError = useFormRootError(form);

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

    return (
      <View
        ref={ref}
        accessibilityLabel="OTP verification"
        className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
        {...props}
      >
        <KeyboardAwareForm
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-semibold text-foreground">Verify your code</Text>
          <UText variant="muted">Enter the 6-digit code we sent to your inbox.</UText>
          <FormRootError message={formRootError} />
          <ControlledField control={form.control} name="code">
            {(field) => {
              const { ref: inputRef, ...inputProps } = bindTextInput(field);
              return (
                <OTPInput
                  ref={inputRef}
                  {...inputProps}
                  error={field.error}
                  onResend={onResend}
                />
              );
            }}
          </ControlledField>
          <Button loading={pending} onPress={handleSubmit}>
            Verify
          </Button>
        </KeyboardAwareForm>
      </View>
    );
  },
);
OtpVerifyScreen.displayName = 'OtpVerifyScreen';
