// UIXVISOR — https://uixvisor.dev/primitives/button
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, Text, View, type PressableProps } from 'react-native';

import { Spinner } from '@registry/spinner/spinner';
import { cn } from '@registry/theme/cn';
import { composePressHandlers, usePressFeedback } from '@registry/theme/press-feedback';
import { useThemeColor } from '@registry/theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Visible label. Kept as string so AT always has a stable name. */
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Rendered before the label, typically an <Icon />. */
  startIcon?: ReactNode;
  /** Rendered after the label, typically an <Icon />. */
  endIcon?: ReactNode;
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

// Heights clear the iOS 44pt / Material 48dp floor. `sm` is h-11 (44), not h-10.
const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'h-11 px-3 rounded-sm gap-1.5', text: 'text-sm' },
  default: { container: 'h-12 px-4 rounded-md gap-2', text: 'text-base' },
  lg: { container: 'h-14 px-6 rounded-lg gap-2', text: 'text-base' },
};

/** Which variants warrant a haptic tick - firing on all of them reads as a gimmick. */
const hapticVariants: ReadonlySet<ButtonVariant> = new Set<ButtonVariant>(['primary', 'destructive']);

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      loading = false,
      startIcon,
      endIcon,
      disabled,
      className,
      onPressIn,
      onPressOut,
      accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const styles = variantStyles[variant];
    const sizing = sizeStyles[size];

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
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    // Keep the spoken name when loading replaces the visual label with a spinner.
    const a11yLabel = accessibilityLabel ?? children;

    return (
      <Animated.View style={[{ alignSelf: 'stretch' }, feedback.style]}>
        <Pressable
          ref={ref}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          onPressIn={press.onPressIn}
          onPressOut={press.onPressOut}
          className={cn(
            'w-full flex-row items-center justify-center',
            variant === 'link' ? 'h-auto px-0' : sizing.container,
            styles.container,
            isDisabled && 'opacity-50',
            className,
          )}
          {...props}
        >
          {loading ? (
            <Spinner size="sm" color={spinnerColor} accessibilityLabel={a11yLabel} />
          ) : (
            <>
              {startIcon ? <View>{startIcon}</View> : null}
              <Text className={cn('font-medium', sizing.text, styles.text)}>{children}</Text>
              {endIcon ? <View>{endIcon}</View> : null}
            </>
          )}
        </Pressable>
      </Animated.View>
    );
  },
);

Button.displayName = 'Button';
