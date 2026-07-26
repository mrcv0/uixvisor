// UIXVISOR — https://uixvisor.dev/mobile/error-state
import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { Heading } from '@registry/heading/heading';
import { Icon } from '@registry/icon/icon';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export interface ErrorStateProps extends ViewProps {
  /** Defaults to a destructive warning glyph in a soft circular well. */
  icon?: ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  /** Override the default “Try again” label. */
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  icon,
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
  ...props
}: ErrorStateProps) {
  const destructive = useThemeColor('destructive');

  return (
    <View
      className={cn(
        'w-full min-h-[280px] items-center justify-center gap-5 px-6 py-16',
        className,
      )}
      {...props}
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        {icon ?? <Icon name="error" size={28} color={destructive} weight="regular" />}
      </View>

      <View className="w-full max-w-sm items-center gap-2">
        <Heading level={3} className="text-center">
          {title}
        </Heading>
        <Text variant="muted" size="sm" className="text-center">
          {description}
        </Text>
      </View>

      {onRetry ? (
        <View className="w-full max-w-xs items-stretch pt-1">
          <Button className="w-full" variant="secondary" onPress={onRetry}>
            {retryLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
