import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Heading } from '@registry/heading/heading';
import { Text } from '@registry/text/text';

/**
 * shadcn-docs inspired section: title + prose + bordered preview surface.
 * Used across primitive demos so every page reads like a mini documentation page.
 */
export function DocSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View className="w-full gap-3">
      <View className="gap-1">
        <Heading level={4}>{title}</Heading>
        {description ? (
          <Text variant="muted" size="sm">
            {description}
          </Text>
        ) : null}
      </View>
      <View className="w-full gap-3 rounded-xl border border-border bg-card p-4">{children}</View>
    </View>
  );
}

/** Intro block at the top of a demo page (name + one-line purpose). */
export function DocIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="w-full gap-1.5 pb-1">
      <Heading level={2}>{title}</Heading>
      <Text variant="muted" size="sm">
        {description}
      </Text>
    </View>
  );
}

/** Compact label above a specimen row. */
export function DocLabel({ children }: { children: string }) {
  return (
    <Text variant="muted" size="xs" weight="medium" className="uppercase tracking-wide">
      {children}
    </Text>
  );
}
