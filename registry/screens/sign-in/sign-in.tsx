// UIXVISOR — https://uixvisor.dev/screens/sign-in
import { forwardRef, useState, type ComponentRef } from 'react';
import { Alert, Text, View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { FormField } from '@registry/blocks/form-field';
import { Input } from '@registry/input/input';
import { Text as UText } from '@registry/text/text';

export interface SignInScreenProps extends ViewProps {
  onSubmit: (input: { email: string; password: string }) => Promise<void> | void;
}

export const SignInScreen = forwardRef<ComponentRef<typeof View>, SignInScreenProps>(
  ({ onSubmit, className, ...props }, ref) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pending, setPending] = useState(false);

    return (
      <View
        ref={ref}
        accessibilityLabel="Sign in"
        className={`flex-1 gap-6 bg-background p-6${className ? ` ${className}` : ''}`}
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Sign in</Text>
        <UText variant="muted">Welcome back. Enter your credentials to continue.</UText>
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
        <FormField label="Password">
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
              await onSubmit({ email, password });
            } catch (error) {
              Alert.alert('Sign in failed', (error as Error).message);
            } finally {
              setPending(false);
            }
          }}
        >
          Continue
        </Button>
      </View>
    );
  },
);
SignInScreen.displayName = 'SignInScreen';
