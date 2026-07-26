// UIXVISOR — https://uixvisor.dev/screens/sign-in
import { forwardRef, useState, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import {
  bindTextInput,
  ControlledFormField,
  createFormSubmitHandler,
  FormRootError,
  useAppForm,
  useFormRootError,
} from '@registry/form-adapter/form-adapter';
import { signInSchema, type SignInValues } from '@registry/auth-schemas/auth-schemas';
import { Input } from '@registry/input/input';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { Text as UText } from '@registry/text/text';

export interface SignInScreenProps extends ViewProps {
  onSubmit: (input: SignInValues) => Promise<void> | void;
}

const FIELD_ORDER = ['email', 'password'] as const;

export const SignInScreen = forwardRef<ComponentRef<typeof View>, SignInScreenProps>(
  ({ onSubmit, className, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: signInSchema,
      defaultValues: { email: '', password: '' },
    });
    const formRootError = useFormRootError(form);

    const handleSubmit = createFormSubmitHandler(form, onSubmit, {
      onPendingChange: setPending,
      fieldOrder: [...FIELD_ORDER],
    });

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign in"
        className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
        {...props}
      >
        <KeyboardAwareForm
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-semibold text-foreground">Sign in</Text>
          <UText variant="muted">Welcome back. Enter your credentials to continue.</UText>
          <FormRootError message={formRootError} />
          <ControlledFormField control={form.control} name="email" label="Email" required>
            {(field) => {
              const { ref: inputRef, ...inputProps } = bindTextInput(field);
              return (
                <Input
                  ref={inputRef}
                  label=""
                  {...inputProps}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  accessibilityLabel="Email"
                />
              );
            }}
          </ControlledFormField>
          <ControlledFormField control={form.control} name="password" label="Password" required>
            {(field) => {
              const { ref: inputRef, ...inputProps } = bindTextInput(field);
              return (
                <Input
                  ref={inputRef}
                  label=""
                  {...inputProps}
                  secureTextEntry
                  textContentType="password"
                  autoComplete="password"
                  accessibilityLabel="Password"
                />
              );
            }}
          </ControlledFormField>
          <Button loading={pending} onPress={handleSubmit}>
            Continue
          </Button>
        </KeyboardAwareForm>
      </View>
    );
  },
);
SignInScreen.displayName = 'SignInScreen';
