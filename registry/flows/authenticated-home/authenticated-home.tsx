// UIXVISOR — https://uixvisor.dev/flows/authenticated-home
import { forwardRef, useState, type ComponentRef } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { AppHeader } from '@registry/blocks/app-header';
import { ListItem } from '@registry/blocks/list-item';
import { Text as UText } from '@registry/text/text';

export interface AuthenticatedHomeFlowProps extends ViewProps {
  userName: string;
  onNavigate: (target: 'dashboard' | 'profile' | 'settings' | 'logout') => void;
  onSignOut: () => Promise<void> | void;
}

export const AuthenticatedHomeFlow = forwardRef<
  ComponentRef<typeof View>,
  AuthenticatedHomeFlowProps
>(({ userName, onNavigate, onSignOut, className, ...props }, ref) => {
  const [signingOut, setSigningOut] = useState(false);
  return (
    <View
      ref={ref}
      accessibilityLabel="Authenticated home"
      className={`flex-1 gap-6 bg-background${className ? ` ${className}` : ''}`}
      {...props}
    >
      <AppHeader title={`Hi, ${userName}`} />
      <View className="gap-3 p-6">
        <Text className="text-lg font-semibold text-foreground">Your account</Text>
        <UText variant="muted">Pick a destination to continue.</UText>
        <ListItem title="Dashboard" onPress={() => onNavigate('dashboard')} />
        <ListItem title="Profile" onPress={() => onNavigate('profile')} />
        <ListItem title="Settings" onPress={() => onNavigate('settings')} />
        <ListItem
          title={signingOut ? 'Signing out…' : 'Sign out'}
          onPress={async () => {
            setSigningOut(true);
            try {
              await onSignOut();
            } finally {
              setSigningOut(false);
              onNavigate('logout');
            }
          }}
        />
      </View>
    </View>
  );
});
AuthenticatedHomeFlow.displayName = 'AuthenticatedHomeFlow';
