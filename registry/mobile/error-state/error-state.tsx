// UIXVISOR — https://uixvisor.dev/mobile/error-state
import { View, type ViewProps } from 'react-native';

import { Heading } from '@registry/heading/heading';
import { Text } from '@registry/text/text';
import { Button } from '@registry/button/button';

export interface ErrorStateProps extends ViewProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <View className={cn('items-center gap-2 px-6 py-12', className)} {...props}>
      <Heading level={3} className="text-center text-destructive">
        {title}
      </Heading>
      <Text variant="muted" size="sm" className="text-center">
        {description}
      </Text>
      {onRetry ? (
        <Button variant="secondary" onPress={onRetry} className="mt-2">
          Try again
        </Button>
      ) : null}
    </View>
  );
}
