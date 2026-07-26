// UIXVISOR — https://uixvisor.dev/screens/sign-in
import { forwardRef, useState, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import {
  ControlledFormField,
  rootError,
  useAppForm,
} from '@registry/form-adapter/form-adapter';
import { signInSchema, type SignInValues } from '@registry/auth-schemas/auth-schemas';
import { Input } from '@registry/input/input';
import { Text as UText } from '@registry/text/text';

export interface SignInScreenProps extends ViewProps {
  onSubmit: (input: SignInValues) => Promise<void> | void;
}

export const SignInScreen = forwardRef<ComponentRef<typeof View>, SignInScreenProps>(
  ({ onSubmit, className, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: signInSchema,
      defaultValues: { email: '', password: '' },
    });
    const formRootError = rootError(form);

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign in"
        className={`flex-1 gap-6 bg-background p-6${className ? ` ${className}` : ''}`}
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Sign in</Text>
        <UText variant="muted">Welcome back. Enter your credentials to continue.</UText>
        {formRootError ? (
          <UText variant="destructive" size="sm" accessibilityLiveRegion="polite">
            {formRootError}
          </UText>
        ) : null}
        <ControlledFormField control={form.control} name="email" label="Email" required>
          {(field) => (
            <Input
              label=""
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              accessibilityLabel="Email"
            />
          )}
        </ControlledFormField>
        <ControlledFormField control={form.control} name="password" label="Password" required>
          {(field) => (
            <Input
              label=""
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              secureTextEntry
              accessibilityLabel="Password"
            />
          )}
        </ControlledFormField>
        <Button
          loading={pending}
          onPress={form.handleSubmit(async (values) => {
            try {
              setPending(true);
              form.clearErrors('root');
              await onSubmit(values);
            } catch (error) {
              form.setError('root', { message: (error as Error).message });
            } finally {
              setPending(false);
            }
          })}
        >
          Continue
        </Button>
      </View>
    );
  },
);
SignInScreen.displayName = 'SignInScreen';
