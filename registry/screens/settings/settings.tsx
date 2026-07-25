// UIXVISOR — https://uixvisor.dev/screens/settings
import { forwardRef, useState, type ComponentRef } from 'react';
import { ScrollView, Switch, Text, View, type ViewProps } from 'react-native';

import { ListItem } from '@registry/list-item/list-item';

export interface SettingsScreenProps extends ViewProps {
  initialNotifications: boolean;
  initialBiometrics: boolean;
  onChange: (settings: { notifications: boolean; biometrics: boolean }) => void;
}

export const SettingsScreen = forwardRef<ComponentRef<typeof View>, SettingsScreenProps>(
  ({ initialNotifications, initialBiometrics, onChange, className, ...props }, ref) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [biometrics, setBiometrics] = useState(initialBiometrics);

    return (
      <ScrollView
        ref={ref as unknown as React.ComponentRef<typeof ScrollView>}
        accessibilityLabel="Settings"
        className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
        contentContainerClassName="gap-4 p-6"
        {...(props as unknown as ScrollView['props'])}
      >
        <Text className="text-2xl font-semibold text-foreground">Settings</Text>
        <View className="gap-2">
          <ListItem
            title="Push notifications"
            description="Receive product updates and security alerts"
            trailing={
              <Switch
                checked={notifications}
                onCheckedChange={(value) => {
                  setNotifications(value);
                  onChange({ notifications: value, biometrics });
                }}
                accessibilityLabel="Toggle push notifications"
              />
            }
          />
          <ListItem
            title="Biometric authentication"
            description="Use fingerprint or face ID to sign in"
            trailing={
              <Switch
                checked={biometrics}
                onCheckedChange={(value) => {
                  setBiometrics(value);
                  onChange({ notifications, biometrics: value });
                }}
                accessibilityLabel="Toggle biometric authentication"
              />
            }
          />
        </View>
      </ScrollView>
    );
  },
);
SettingsScreen.displayName = 'SettingsScreen';
