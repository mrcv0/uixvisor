// UIXVISOR — https://uixvisor.dev/screens/sign-up
import { forwardRef, useState, type ComponentRef } from 'react';
import { Alert, Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { FormField } from '@registry/form-field/form-field';
import { Input } from '@registry/input/input';
import { Text as UText } from '@registry/text/text';

export interface SignUpScreenProps extends ViewProps {
  onSubmit: (input: { name: string; email: string; password: string }) => Promise<void> | void;
}

export const SignUpScreen = forwardRef<ComponentRef<typeof View>, SignUpScreenProps>(
  ({ onSubmit, className, ...props }, ref) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pending, setPending] = useState(false);

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign up"
        className={`flex-1 gap-6 bg-background p-6${className ? ` ${className}` : ''}`}
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Create your account</Text>
        <UText variant="muted">Tell us who you are to get started.</UText>
        <FormField label="Name">
          <Input label="" value={name} onChangeText={setName} accessibilityLabel="Name" />
        </FormField>
        <FormField label="Email">
          <Input
            label=""
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email"
          />
        </FormField>
        <FormField label="Password" hint="Minimum 8 characters">
          <Input
            label=""
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Password"
          />
        </FormField>
        <Button
          loading={pending}
          onPress={async () => {
            try {
              setPending(true);
              await onSubmit({ name, email, password });
            } catch (error) {
              Alert.alert('Sign up failed', (error as Error).message);
            } finally {
              setPending(false);
            }
          }}
        >
          Create account
        </Button>
      </View>
    );
  },
);
SignUpScreen.displayName = 'SignUpScreen';
