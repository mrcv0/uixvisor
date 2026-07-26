// UIXVISOR — https://uixvisor.dev/screens/sign-up
import { forwardRef, useState, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import {
  ControlledFormField,
  rootError,
  useAppForm,
} from '@registry/form-adapter/form-adapter';
import { signUpSchema, type SignUpValues } from '@registry/auth-schemas/auth-schemas';
import { Input } from '@registry/input/input';
import { Text as UText } from '@registry/text/text';

export interface SignUpScreenProps extends ViewProps {
  onSubmit: (input: SignUpValues) => Promise<void> | void;
}

export const SignUpScreen = forwardRef<ComponentRef<typeof View>, SignUpScreenProps>(
  ({ onSubmit, className, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const form = useAppForm({
      schema: signUpSchema,
      defaultValues: { name: '', email: '', password: '' },
    });
    const formRootError = rootError(form);

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign up"
        className={`flex-1 gap-6 bg-background p-6${className ? ` ${className}` : ''}`}
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Create your account</Text>
        <UText variant="muted">Tell us who you are to get started.</UText>
        {formRootError ? (
          <UText variant="destructive" size="sm" accessibilityLiveRegion="polite">
            {formRootError}
          </UText>
        ) : null}
        <ControlledFormField control={form.control} name="name" label="Name" required>
          {(field) => (
            <Input
              label=""
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              accessibilityLabel="Name"
            />
          )}
        </ControlledFormField>
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
        <ControlledFormField
          control={form.control}
          name="password"
          label="Password"
          hint="Minimum 8 characters"
          required
        >
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
          Create account
        </Button>
      </View>
    );
  },
);
SignUpScreen.displayName = 'SignUpScreen';
