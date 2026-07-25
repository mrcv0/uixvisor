// UIXVISOR — https://uixvisor.dev/primitives/button
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { ActivityIndicator, Animated, Pressable, Text, View, type PressableProps } from 'react-native';

import { useThemeColor } from '@registry/theme/theme';
import { usePressFeedback } from '@registry/theme/press-feedback';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Rendered before the label, typically an <Icon />. */
  startIcon?: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: { container: 'bg-primary active:bg-primary/90', text: 'text-primary-foreground' },
  secondary: { container: 'bg-secondary active:bg-secondary/80', text: 'text-secondary-foreground' },
  destructive: {
    container: 'bg-destructive active:bg-destructive/90',
    text: 'text-destructive-foreground',
  },
  outline: {
    container: 'border border-border bg-background active:bg-accent',
    text: 'text-foreground',
  },
  ghost: { container: 'active:bg-accent', text: 'text-foreground' },
  link: { container: '', text: 'text-foreground underline' },
};

// Heights come from mobile touch ergonomics, not from shadcn's web metrics:
// `default` clears both the iOS 44pt and Material 48dp minimums.
const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'h-10 px-3 rounded-sm gap-1.5', text: 'text-sm' },
  default: { container: 'h-12 px-4 rounded-md gap-2', text: 'text-base' },
  lg: { container: 'h-14 px-6 rounded-lg gap-2', text: 'text-base' },
};

/** Which variants warrant a haptic tick - firing on all of them reads as a gimmick. */
const hapticVariants: ReadonlySet<ButtonVariant> = new Set<ButtonVariant>(['primary', 'destructive']);

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      loading = false,
      startIcon,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const styles = variantStyles[variant];
    const sizing = sizeStyles[size];

    // ActivityIndicator takes a native colour prop, so it needs a literal value
    // rather than a class.
    const onPrimary = useThemeColor('primary-foreground');
    const onDestructive = useThemeColor('destructive-foreground');
    const onNeutral = useThemeColor('foreground');
    const spinnerColor =
      variant === 'primary' ? onPrimary : variant === 'destructive' ? onDestructive : onNeutral;

    const feedback = usePressFeedback({
      // A link is text, so scaling it looks like a glitch rather than a press.
      scale: variant !== 'link',
      haptic: hapticVariants.has(variant) ? 'impact' : 'none',
      disabled: isDisabled,
    });

    return (
      <Animated.View style={feedback.style}>
        <Pressable
          ref={ref}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          onPressIn={feedback.onPressIn}
          onPressOut={feedback.onPressOut}
          className={cn(
            'flex-row items-center justify-center',
            variant === 'link' ? 'h-auto px-0' : sizing.container,
            styles.container,
            isDisabled && 'opacity-50',
            className,
          )}
          {...props}
        >
          {loading ? (
            <ActivityIndicator color={spinnerColor} />
          ) : (
            <>
              {startIcon ? <View>{startIcon}</View> : null}
              <Text className={cn('font-medium', sizing.text, styles.text)}>{children}</Text>
            </>
          )}
        </Pressable>
      </Animated.View>
    );
  },
);

Button.displayName = 'Button';
