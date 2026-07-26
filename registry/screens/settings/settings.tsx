// UIXVISOR — https://uixvisor.dev/screens/settings
import { forwardRef, useState } from 'react';
import { ScrollView, Text, View, type ScrollViewProps } from 'react-native';

import { ListItem } from '@registry/list-item/list-item';
import { Switch } from '@registry/switch/switch';

export interface SettingsScreenProps extends ScrollViewProps {
  initialNotifications: boolean;
  initialBiometrics: boolean;
  onChange: (settings: { notifications: boolean; biometrics: boolean }) => void;
}

export const SettingsScreen = forwardRef<ScrollView, SettingsScreenProps>(
  ({ initialNotifications, initialBiometrics, onChange, className, ...props }, ref) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [biometrics, setBiometrics] = useState(initialBiometrics);

    return (
      <ScrollView
        ref={ref}
        accessibilityLabel="Settings"
        className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
        contentContainerClassName="gap-4 p-6"
        {...props}
      >
        <Text className="text-2xl font-semibold text-foreground">Settings</Text>
        <View className="overflow-hidden rounded-xl border border-border bg-card">
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
          <View className="h-px bg-border ml-4" />
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
