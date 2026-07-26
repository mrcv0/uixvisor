// UIXVISOR — https://uixvisor.dev/screens/settings
//
// Controlled-first toggles; host owns persistence. Extra rows via children.
import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Heading } from '@registry/heading/heading';
import { ListItem } from '@registry/list-item/list-item';
import { Separator } from '@registry/separator/separator';
import { Switch } from '@registry/switch/switch';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface SettingsValues {
  notifications: boolean;
  biometrics: boolean;
}

export interface SettingsScreenProps extends ScrollViewProps {
  /** Controlled notifications value. Prefer over default/initial. */
  notifications?: boolean;
  /** Controlled biometrics value. Prefer over default/initial. */
  biometrics?: boolean;
  /** Uncontrolled initial notifications when `notifications` is omitted. */
  defaultNotifications?: boolean;
  /** Uncontrolled initial biometrics when `biometrics` is omitted. */
  defaultBiometrics?: boolean;
  /**
   * @deprecated Use `defaultNotifications` or controlled `notifications`.
   * Still accepted for backward compatibility.
   */
  initialNotifications?: boolean;
  /**
   * @deprecated Use `defaultBiometrics` or controlled `biometrics`.
   */
  initialBiometrics?: boolean;
  onChange: (settings: SettingsValues) => void;
  headerTitle?: string;
  onBack?: () => void;
  /** Extra list groups or rows below the core toggles. */
  children?: ReactNode;
  className?: string;
}

export const SettingsScreen = forwardRef<ScrollView, SettingsScreenProps>(
  (
    {
      notifications: notificationsProp,
      biometrics: biometricsProp,
      defaultNotifications,
      defaultBiometrics,
      initialNotifications = true,
      initialBiometrics = false,
      onChange,
      headerTitle,
      onBack,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const notificationsControlled = notificationsProp !== undefined;
    const biometricsControlled = biometricsProp !== undefined;

    const [notificationsLocal, setNotificationsLocal] = useState(
      defaultNotifications ?? initialNotifications,
    );
    const [biometricsLocal, setBiometricsLocal] = useState(
      defaultBiometrics ?? initialBiometrics,
    );

    useEffect(() => {
      if (notificationsControlled) return;
      if (defaultNotifications !== undefined) setNotificationsLocal(defaultNotifications);
    }, [defaultNotifications, notificationsControlled]);

    useEffect(() => {
      if (biometricsControlled) return;
      if (defaultBiometrics !== undefined) setBiometricsLocal(defaultBiometrics);
    }, [defaultBiometrics, biometricsControlled]);

    const notifications = notificationsControlled ? notificationsProp : notificationsLocal;
    const biometrics = biometricsControlled ? biometricsProp : biometricsLocal;
    const showHeader = Boolean(headerTitle || onBack);

    const emit = (next: SettingsValues) => {
      if (!notificationsControlled) setNotificationsLocal(next.notifications);
      if (!biometricsControlled) setBiometricsLocal(next.biometrics);
      onChange(next);
    };

    return (
      <View className={cn('flex-1 bg-background', className)}>
        {showHeader ? (
          <AppHeader title={headerTitle ?? 'Settings'} onBack={onBack} />
        ) : null}
        <ScrollView
          ref={ref}
          accessibilityLabel="Settings"
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          {...props}
        >
          <View className="gap-1.5">
            <Heading level={2}>Settings</Heading>
            <Text variant="muted" size="sm">
              Manage notifications and security preferences.
            </Text>
          </View>

          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <ListItem
              title="Push notifications"
              description="Receive product updates and security alerts"
              trailing={
                <Switch
                  checked={notifications}
                  onCheckedChange={(value) => {
                    emit({ notifications: value, biometrics });
                  }}
                  accessibilityLabel="Toggle push notifications"
                />
              }
            />
            <Separator className="ml-4" />
            <ListItem
              title="Biometric authentication"
              description="Use fingerprint or face ID to sign in"
              trailing={
                <Switch
                  checked={biometrics}
                  onCheckedChange={(value) => {
                    emit({ notifications, biometrics: value });
                  }}
                  accessibilityLabel="Toggle biometric authentication"
                />
              }
            />
          </View>

          {children}
        </ScrollView>
      </View>
    );
  },
);
SettingsScreen.displayName = 'SettingsScreen';
