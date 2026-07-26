// UIXVISOR — https://uixvisor.dev/mobile/empty-state
import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Heading } from '@registry/heading/heading';
import { Icon } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export interface EmptyStateProps extends ViewProps {
  /** Defaults to a muted inbox glyph in a circular well. */
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  const muted = useThemeColor('muted-foreground');

  return (
    <View
      className={cn(
        'w-full min-h-[280px] items-center justify-center gap-5 px-6 py-16',
        className,
      )}
      {...props}
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
        {icon ?? <Icon name="inbox" size={28} color={muted} weight="regular" />}
      </View>

      <View className="w-full max-w-sm items-center gap-2">
        <Heading level={3} className="text-center">
          {title}
        </Heading>
        {description ? (
          <Text variant="muted" size="sm" className="text-center">
            {description}
          </Text>
        ) : null}
      </View>

      {action ? <View className="items-center pt-1">{action}</View> : null}
    </View>
  );
}
