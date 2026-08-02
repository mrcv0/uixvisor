// UIXVISOR — https://uixvisor.dev/screens/sign-in
//
// Content-only screen: host owns navigation chrome. Optional onBack/headerTitle
// render an in-screen AppHeader when the host does not provide its own.
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
import { signInSchema, type SignInValues } from '@registry/auth-schemas/auth-schemas';
import { Heading } from '@registry/heading/heading';
import { Input } from '@registry/input/input';
import { KeyboardAwareForm } from '@registry/keyboard-aware-form/keyboard-aware-form';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface SignInScreenProps extends ViewProps {
  /** Called with Zod-parsed credentials. Host handles auth side-effects. */
  onSubmit: (input: SignInValues) => Promise<void> | void;
  /** Optional in-screen header title (also enables AppHeader when set with onBack). */
  headerTitle?: string;
  onBack?: () => void;
  onSignUpPress?: () => void;
  onForgotPasswordPress?: () => void;
  /** Slot above the primary CTA — e.g. social login group. */
  social?: ReactNode;
  className?: string;
}

const FIELD_ORDER = ['email', 'password'] as const;

export const SignInScreen = forwardRef<ComponentRef<typeof View>, SignInScreenProps>(
  (
    {
      onSubmit,
      headerTitle,
      onBack,
      onSignUpPress,
      onForgotPasswordPress,
      social,
      className,
      ...props
    },
    ref,
  ) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: signInSchema,
      defaultValues: { email: '', password: '' },
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
        accessibilityLabel="Sign in"
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        {showHeader ? (
          <AppHeader title={headerTitle ?? 'Sign in'} onBack={onBack} />
        ) : null}
        <KeyboardAwareForm
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1.5">
            <Heading level={2}>Sign in</Heading>
            <Text variant="muted" size="sm">
              Welcome back. Enter your credentials to continue.
            </Text>
          </View>
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
          {onForgotPasswordPress ? (
            <Pressable
              onPress={onForgotPasswordPress}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              className="self-start py-1"
            >
              <Text size="sm" className="font-medium text-primary">
                Forgot password?
              </Text>
            </Pressable>
          ) : null}
          {social}
          <Button
            testID="sign-in-continue"
            loading={pending}
            onPress={handleSubmit}
          >
            Continue
          </Button>
          {onSignUpPress ? (
            <Pressable
              onPress={onSignUpPress}
              accessibilityRole="button"
              accessibilityLabel="Create account"
              className="items-center py-1"
            >
              <Text size="sm" variant="muted">
                Don&apos;t have an account?{' '}
                <Text size="sm" className="font-medium text-primary">
                  Create account
                </Text>
              </Text>
            </Pressable>
          ) : null}
        </KeyboardAwareForm>
      </View>
    );
  },
);
SignInScreen.displayName = 'SignInScreen';
