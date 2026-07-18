// UIXVISOR — https://uixvisor.dev/mobile/empty-state
import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Heading } from '@registry/heading/heading';
import { Text } from '@registry/text/text';

export interface EmptyStateProps extends ViewProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <View className={cn('items-center gap-2 px-6 py-12', className)} {...props}>
      {icon}
      <Heading level={3} className="text-center">
        {title}
      </Heading>
      {description ? (
        <Text variant="muted" size="sm" className="text-center">
          {description}
        </Text>
      ) : null}
      {action}
    </View>
  );
}
