// UIXVISOR — https://uixvisor.dev/screens/profile
import { forwardRef, type ReactNode } from 'react';
import { ScrollView, Text, View, type ScrollViewProps } from 'react-native';

import { Avatar } from '@registry/avatar/avatar';

export interface ProfileScreenProps extends ScrollViewProps {
  name: string;
  email: string;
  bio?: string;
  children?: ReactNode;
}

export const ProfileScreen = forwardRef<ScrollView, ProfileScreenProps>(
  ({ name, email, bio, children, className, ...props }, ref) => (
    <ScrollView
      ref={ref}
      accessibilityLabel="Profile"
      className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
      contentContainerClassName="items-center gap-4 p-6"
      {...props}
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
