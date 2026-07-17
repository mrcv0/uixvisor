// UIXVISOR — https://uixvisor.dev/primitives/avatar
import { forwardRef, useState, type ComponentRef } from 'react';
import { Image, Text, View, type ViewProps } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends ViewProps {
  source?: { uri: string };
  fallback: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
};

const textSizeStyles: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-lg',
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Avatar = forwardRef<ComponentRef<typeof View>, AvatarProps>(
  ({ source, fallback, size = 'md', className, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);
    const showImage = Boolean(source) && !hasError;

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
          <Text className={cn('font-medium text-muted-foreground', textSizeStyles[size])}>
            {fallback.slice(0, 2).toUpperCase()}
          </Text>
        )}
      </View>
    );
  },
);

Avatar.displayName = 'Avatar';
