// UIXVISOR — https://uixvisor.dev/screens/sign-up
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
import { signUpSchema, type SignUpValues } from '@registry/auth-schemas/auth-schemas';
import { Input } from '@registry/input/input';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { Text as UText } from '@registry/text/text';

export interface SignUpScreenProps extends ViewProps {
  onSubmit: (input: SignUpValues) => Promise<void> | void;
}

const FIELD_ORDER = ['name', 'email', 'password'] as const;

export const SignUpScreen = forwardRef<ComponentRef<typeof View>, SignUpScreenProps>(
  ({ onSubmit, className, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: signUpSchema,
      defaultValues: { name: '', email: '', password: '' },
    });
    const formRootError = useFormRootError(form);

    const handleSubmit = createFormSubmitHandler(form, onSubmit, {
      onPendingChange: setPending,
      fieldOrder: [...FIELD_ORDER],
    });

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign up"
        className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
        {...props}
      >
        <KeyboardAwareForm
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-semibold text-foreground">Create your account</Text>
          <UText variant="muted">Tell us who you are to get started.</UText>
          <FormRootError message={formRootError} />
          <ControlledFormField control={form.control} name="name" label="Name" required>
            {(field) => {
              const { ref: inputRef, ...inputProps } = bindTextInput(field);
              return (
                <Input
                  ref={inputRef}
                  label=""
                  {...inputProps}
                  textContentType="name"
                  autoComplete="name"
                  accessibilityLabel="Name"
                />
              );
            }}
          </ControlledFormField>
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
          <ControlledFormField
            control={form.control}
            name="password"
            label="Password"
            hint="Minimum 8 characters"
            required
          >
            {(field) => {
              const { ref: inputRef, ...inputProps } = bindTextInput(field);
              return (
                <Input
                  ref={inputRef}
                  label=""
                  {...inputProps}
                  secureTextEntry
                  textContentType="newPassword"
                  autoComplete="password-new"
                  accessibilityLabel="Password"
                />
              );
            }}
          </ControlledFormField>
          <Button loading={pending} onPress={handleSubmit}>
            Create account
          </Button>
        </KeyboardAwareForm>
      </View>
    );
  },
);
SignUpScreen.displayName = 'SignUpScreen';
