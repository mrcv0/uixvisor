// UIXVISOR — https://uixvisor.dev/primitives/icon-button
//
// Deprecated as a separate primitive. Prefer:
//   <Button size="icon" icon={...} accessibilityLabel="..." />
// This file remains a thin adapter so existing `add icon-button` copies and
// imports keep working without a hard break.
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import type { PressableProps } from 'react-native';

import { Button, type ButtonSize, type ButtonVariant } from '@registry/button/button';

type LegacySize = 'sm' | 'default' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: ReactNode;
  variant?: Exclude<ButtonVariant, 'link'>;
  size?: LegacySize;
  loading?: boolean;
  accessibilityLabel: string;
  className?: string;
}

const sizeMap: Record<LegacySize, ButtonSize> = {
  sm: 'icon-sm',
  default: 'icon',
  lg: 'icon-lg',
};

/** @deprecated Use `<Button size="icon" icon={...} accessibilityLabel="..." />`. */
export const IconButton = forwardRef<ComponentRef<typeof Button>, IconButtonProps>(
  ({ icon, variant = 'primary', size = 'default', loading, accessibilityLabel, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size={sizeMap[size]}
      icon={icon}
      loading={loading}
      accessibilityLabel={accessibilityLabel}
      className={className}
      {...props}
    />
  ),
);

IconButton.displayName = 'IconButton';
