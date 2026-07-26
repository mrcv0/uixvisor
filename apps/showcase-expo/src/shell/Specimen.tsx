import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@registry/text/text';

/** Labels a single specimen so variants can be told apart at a glance. */
export function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Text variant="muted" size="xs">
        {label}
      </Text>
      {children}
    </View>
  );
}
