// UIXVISOR — https://uixvisor.dev/screens/sign-up
//
// Content-only screen: host owns navigation chrome and post-submit routing.
import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
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
import { Heading } from '@registry/heading/heading';
import { Input } from '@registry/input/input';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface SignUpScreenProps extends ViewProps {
  /** Called with Zod-parsed account fields. Host handles registration. */
  onSubmit: (input: SignUpValues) => Promise<void> | void;
  headerTitle?: string;
  onBack?: () => void;
  /** Navigate to sign-in (host routing). */
  onSignInPress?: () => void;
  /** Slot above the primary CTA — e.g. social login group. */
  social?: ReactNode;
  className?: string;
}

const FIELD_ORDER = ['name', 'email', 'password'] as const;

export const SignUpScreen = forwardRef<ComponentRef<typeof View>, SignUpScreenProps>(
  (
    { onSubmit, headerTitle, onBack, onSignInPress, social, className, ...props },
    ref,
  ) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: signUpSchema,
      defaultValues: { name: '', email: '', password: '' },
    });
    const formRootError = useFormRootError(form);
    const showHeader = Boolean(headerTitle || onBack);

    const handleSubmit = createFormSubmitHandler(form, onSubmit, {
      onPendingChange: setPending,
      fieldOrder: [...FIELD_ORDER],
    });

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign up"
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        {showHeader ? (
          <AppHeader title={headerTitle ?? 'Create account'} onBack={onBack} />
        ) : null}
        <KeyboardAwareForm
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1.5">
            <Heading level={2}>Create your account</Heading>
            <Text variant="muted" size="sm">
              Tell us who you are to get started.
            </Text>
          </View>
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
          {social}
          <Button loading={pending} onPress={handleSubmit}>
            Create account
          </Button>
          {onSignInPress ? (
            <Pressable
              onPress={onSignInPress}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              className="items-center py-1"
            >
              <Text size="sm" variant="muted">
                Already have an account?{' '}
                <Text size="sm" className="font-medium text-primary">
                  Sign in
                </Text>
              </Text>
            </Pressable>
          ) : null}
        </KeyboardAwareForm>
      </View>
    );
  },
);
SignUpScreen.displayName = 'SignUpScreen';
