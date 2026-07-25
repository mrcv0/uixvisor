// UIXVISOR — https://uixvisor.dev/screens/profile
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { ScrollView, Text, View, type ViewProps } from 'react-native';

import { Avatar } from '@registry/avatar/avatar';

export interface ProfileScreenProps extends ViewProps {
  name: string;
  email: string;
  bio?: string;
  children?: ReactNode;
}

export const ProfileScreen = forwardRef<ComponentRef<typeof View>, ProfileScreenProps>(
  ({ name, email, bio, children, className, ...props }, ref) => (
    <ScrollView
      ref={ref as unknown as React.ComponentRef<typeof ScrollView>}
      accessibilityLabel="Profile"
      className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
      contentContainerClassName="items-center gap-4 p-6"
      {...(props as unknown as ScrollView['props'])}
    >
      <Avatar fallback={name} accessibilityLabel={`${name} avatar`} size="lg" />
      <View className="items-center gap-1">
        <Text className="text-xl font-semibold text-foreground">{name}</Text>
        <Text className="text-sm text-muted-foreground">{email}</Text>
      </View>
      {bio ? <Text className="text-center text-base text-foreground">{bio}</Text> : null}
      {children}
    </ScrollView>
  ),
);
ProfileScreen.displayName = 'ProfileScreen';
