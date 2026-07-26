import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Heading } from '@registry/heading/heading';
import { Separator } from '@registry/separator/separator';
import { Text } from '@registry/text/text';

/** A labelled group so demos read as a catalogue rather than a dump. */
export function Section({
  title,
  hint,
  children,
  showSeparator = true,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  showSeparator?: boolean;
}) {
  return (
    <View className="w-full gap-3">
      <View className="gap-0.5">
        <Heading level={4}>{title}</Heading>
        {hint ? (
          <Text variant="muted" size="sm">
            {hint}
          </Text>
        ) : null}
      </View>
      {children}
      {showSeparator ? <Separator className="mt-2" /> : null}
    </View>
  );
}
