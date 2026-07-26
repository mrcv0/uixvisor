// UIXVISOR — https://uixvisor.dev/flows/authenticated-home
//
// Post-auth hub: host owns routing. This flow only emits navigation intents
// and a sign-out callback — no backend knowledge.
import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Heading } from '@registry/heading/heading';
import { Icon } from '@registry/icon/icon';
import { ListItem } from '@registry/list-item/list-item';
import { Separator } from '@registry/separator/separator';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export type AuthenticatedHomeTarget = 'dashboard' | 'profile' | 'settings' | 'logout';

export interface AuthenticatedHomeFlowProps extends ViewProps {
  userName: string;
  /** Optional muted line under the greeting header. */
  subtitle?: string;
  onNavigate: (target: AuthenticatedHomeTarget) => void;
  onSignOut: () => Promise<void> | void;
  /** Extra list rows/groups below the core destinations. */
  children?: ReactNode;
  className?: string;
}

export const AuthenticatedHomeFlow = forwardRef<
  ComponentRef<typeof View>,
  AuthenticatedHomeFlowProps
>(
  (
    {
      userName,
      subtitle = 'Pick a destination to continue.',
      onNavigate,
      onSignOut,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [signingOut, setSigningOut] = useState(false);
    const [signOutError, setSignOutError] = useState<string | undefined>();
    const muted = useThemeColor('muted-foreground');
    const destructive = useThemeColor('destructive');

    const chevron = (
      <Icon name="chevron-right" size={18} color={muted} weight="bold" />
    );

    return (
      <View
        ref={ref}
        accessibilityLabel="Authenticated home"
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        <AppHeader title={`Hi, ${userName}`} subtitle={subtitle} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1.5">
            <Heading level={3}>Your account</Heading>
            <Text variant="muted" size="sm">
              Open a screen or sign out when you are done.
            </Text>
          </View>

          {signOutError ? (
            <Text variant="destructive" size="sm" accessibilityLiveRegion="polite">
              {signOutError}
            </Text>
          ) : null}

          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <ListItem
              title="Dashboard"
              description="Overview and highlights"
              trailing={chevron}
              onPress={() => onNavigate('dashboard')}
            />
            <Separator className="ml-4" />
            <ListItem
              title="Profile"
              description="Name, email, and bio"
              trailing={chevron}
              onPress={() => onNavigate('profile')}
            />
            <Separator className="ml-4" />
            <ListItem
              title="Settings"
              description="Notifications and security"
              trailing={chevron}
              onPress={() => onNavigate('settings')}
            />
          </View>

          {children}

          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <ListItem
              title={signingOut ? 'Signing out…' : 'Sign out'}
              description="End this session on this device"
              disabled={signingOut}
              trailing={
                <Icon name="warning" size={18} color={destructive} weight="regular" />
              }
              accessibilityLabel="Sign out"
              onPress={async () => {
                if (signingOut) return;
                setSignOutError(undefined);
                setSigningOut(true);
                try {
                  await onSignOut();
                  onNavigate('logout');
                } catch (error) {
                  setSignOutError(
                    error instanceof Error && error.message
                      ? error.message
                      : 'Could not sign out. Try again.',
                  );
                } finally {
                  setSigningOut(false);
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  },
);
AuthenticatedHomeFlow.displayName = 'AuthenticatedHomeFlow';
