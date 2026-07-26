// UIXVISOR — https://uixvisor.dev/primitives/icon-button
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps } from 'react-native';

import { Spinner } from '@registry/spinner/spinner';
import { cn } from '@registry/theme/cn';
import { composePressHandlers, usePressFeedback } from '@registry/theme/press-feedback';
import { useThemeColor } from '@registry/theme/theme';

type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type IconButtonSize = 'sm' | 'default' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  /** Required: icon-only controls must name themselves for VoiceOver/TalkBack. */
  accessibilityLabel: string;
  className?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary/90',
  secondary: 'bg-secondary active:bg-secondary/80',
  outline: 'border border-border bg-background active:bg-accent',
  ghost: 'active:bg-accent',
  destructive: 'bg-destructive active:bg-destructive/90',
};

// Visual box can be compact; min hit area stays ≥44 via size + hitSlop on sm.
const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-11 w-11 rounded-md',
  default: 'h-12 w-12 rounded-md',
  lg: 'h-14 w-14 rounded-lg',
};

export const IconButton = forwardRef<ComponentRef<typeof Pressable>, IconButtonProps>(
  (
    {
      icon,
      variant = 'primary',
      size = 'default',
      loading = false,
      disabled,
      className,
      accessibilityLabel,
      onPressIn,
      onPressOut,
      hitSlop,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const feedback = usePressFeedback({
      haptic: variant === 'primary' || variant === 'destructive' ? 'impact' : 'none',
      disabled: isDisabled,
    });
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    const onPrimary = useThemeColor('primary-foreground');
    const onDestructive = useThemeColor('destructive-foreground');
    const onNeutral = useThemeColor('foreground');
    const spinnerColor =
      variant === 'primary'
        ? onPrimary
        : variant === 'destructive'
          ? onDestructive
          : onNeutral;

    return (
      <Animated.View style={feedback.style}>
        <Pressable
          ref={ref}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          onPressIn={press.onPressIn}
          onPressOut={press.onPressOut}
          hitSlop={hitSlop ?? (size === 'sm' ? 4 : undefined)}
          className={cn(
            'items-center justify-center',
            sizeStyles[size],
            variantStyles[variant],
            isDisabled && 'opacity-50',
            className,
          )}
          {...props}
        >
          {loading ? (
            <Spinner size="sm" color={spinnerColor} accessibilityLabel={accessibilityLabel} />
          ) : (
            icon
          )}
        </Pressable>
      </Animated.View>
    );
  },
);

IconButton.displayName = 'IconButton';
