// UIXVISOR — https://uixvisor.dev/primitives/avatar
import { forwardRef, useState, type ComponentRef } from 'react';
import {
  Image,
  View,
  type ImageSourcePropType,
  type ViewProps,
} from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends ViewProps {
  /** Remote URI, local require(), or full ImageSourcePropType. */
  source?: ImageSourcePropType;
  /**
   * Name or initials used for the fallback glyph and accessibility label.
   * Multi-word names yield first+last initials ("Ada Lovelace" → "AL").
   */
  fallback: string;
  /** Override computed initials (max two characters shown). */
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
};

const textSizeStyles: Record<AvatarSize, 'xs' | 'base' | 'lg'> = {
  sm: 'xs',
  md: 'base',
  lg: 'lg',
};

/** Derive up to two initials from a display name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export const Avatar = forwardRef<ComponentRef<typeof View>, AvatarProps>(
  ({ source, fallback, initials, size = 'md', className, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);
    const showImage = Boolean(source) && !hasError;
    const glyph = (initials ?? getInitials(fallback)).slice(0, 2);

    return (
      <View
        ref={ref}
        accessibilityRole="image"
        accessibilityLabel={fallback}
        className={cn(
          'items-center justify-center overflow-hidden rounded-full bg-muted',
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {showImage && source ? (
          <Image source={source} onError={() => setHasError(true)} className="h-full w-full" />
        ) : (
          <Text size={textSizeStyles[size]} weight="medium" variant="muted">
            {glyph}
          </Text>
        )}
      </View>
    );
  },
);

Avatar.displayName = 'Avatar';
