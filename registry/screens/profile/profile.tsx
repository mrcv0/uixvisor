// UIXVISOR — https://uixvisor.dev/screens/profile
//
// Presentation screen: host supplies identity data and action slot content.
import { forwardRef, type ReactNode } from 'react';
import { ScrollView, View, type ImageSourcePropType, type ScrollViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Avatar } from '@registry/avatar/avatar';
import { Heading } from '@registry/heading/heading';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface ProfileScreenProps extends ScrollViewProps {
  name: string;
  email: string;
  bio?: string;
  /** Optional image source for Avatar; falls back to initials from name. */
  avatarSource?: ImageSourcePropType;
  headerTitle?: string;
  onBack?: () => void;
  /** Preferred action area (Edit, Share, …). Host owns the buttons. */
  actions?: ReactNode;
  /** Additional content below actions (legacy composition slot). */
  children?: ReactNode;
  className?: string;
}

export const ProfileScreen = forwardRef<ScrollView, ProfileScreenProps>(
  (
    {
      name,
      email,
      bio,
      avatarSource,
      headerTitle,
      onBack,
      actions,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const showHeader = Boolean(headerTitle || onBack);

    return (
      <View className={cn('flex-1 bg-background', className)}>
        {showHeader ? (
          <AppHeader title={headerTitle ?? 'Profile'} onBack={onBack} />
        ) : null}
        <ScrollView
          ref={ref}
          accessibilityLabel="Profile"
          className="flex-1"
          contentContainerClassName="items-center gap-4 p-6"
          {...props}
        >
          <Avatar
            source={avatarSource}
            fallback={name}
            accessibilityLabel={`${name} avatar`}
            size="lg"
          />
          <View className="w-full items-center gap-1">
            <Heading level={2} className="text-center" numberOfLines={2}>
              {name}
            </Heading>
            <Text variant="muted" size="sm" className="text-center" numberOfLines={2}>
              {email}
            </Text>
          </View>
          {bio ? (
            <Text size="base" className="text-center" numberOfLines={6}>
              {bio}
            </Text>
          ) : null}
          {actions ? <View className="w-full gap-2 pt-2">{actions}</View> : null}
          {children}
        </ScrollView>
      </View>
    );
  },
);
ProfileScreen.displayName = 'ProfileScreen';
