// UIXVISOR — https://uixvisor.dev/primitives/icon-button
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps } from 'react-native';

import { usePressFeedback } from '@registry/theme/press-feedback';

type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  accessibilityLabel: string;
  className?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary/90',
  secondary: 'bg-secondary active:bg-secondary/80',
  outline: 'border border-border bg-background active:bg-accent',
  ghost: 'active:bg-accent',
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const IconButton = forwardRef<ComponentRef<typeof Pressable>, IconButtonProps>(
  ({ icon, variant = 'primary', disabled, className, accessibilityLabel, ...props }, ref) => {
    const feedback = usePressFeedback({
      haptic: variant === 'primary' ? 'impact' : 'none',
      disabled: Boolean(disabled),
    });

    return (
      <Animated.View style={feedback.style}>
        <Pressable
          ref={ref}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled: Boolean(disabled) }}
          onPressIn={feedback.onPressIn}
          onPressOut={feedback.onPressOut}
          className={cn(
            'h-12 w-12 items-center justify-center rounded-md',
            variantStyles[variant],
            disabled && 'opacity-50',
            className,
          )}
          {...props}
        >
          {icon}
        </Pressable>
      </Animated.View>
    );
  },
);

IconButton.displayName = 'IconButton';
