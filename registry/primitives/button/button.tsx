// UIXVISOR — https://uixvisor.dev/primitives/button
//
// Mobile-first button inspired by shadcn/ui: one component covers labelled
// actions and icon-only toolbars via `size="icon" | "icon-sm" | "icon-lg"`.
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, Text, View, type PressableProps } from 'react-native';

import { Spinner } from '@registry/spinner/spinner';
import { cn } from '@registry/theme/cn';
import { composePressHandlers, usePressFeedback } from '@registry/theme/press-feedback';
import { useThemeColor } from '@registry/theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
/** Labelled sizes + shadcn-style icon sizes (square hit targets). */
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * Visible label for text buttons. Omit when using an icon size — then pass
   * `icon` and a required `accessibilityLabel`.
   */
  children?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Leading icon for labelled buttons. */
  startIcon?: ReactNode;
  /** Trailing icon for labelled buttons. */
  endIcon?: ReactNode;
  /**
   * Sole content for icon sizes (`icon` / `icon-sm` / `icon-lg`).
   * Prefer this over nesting a separate icon-button component.
   */
  icon?: ReactNode;
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

const sizeStyles: Record<ButtonSize, { container: string; text: string; iconOnly: boolean }> = {
  sm: { container: 'h-11 px-3 rounded-sm gap-1.5', text: 'text-sm', iconOnly: false },
  default: { container: 'h-12 px-4 rounded-md gap-2', text: 'text-base', iconOnly: false },
  lg: { container: 'h-14 px-6 rounded-lg gap-2', text: 'text-base', iconOnly: false },
  // Square targets — match shadcn icon sizes, keep ≥44pt on mobile.
  'icon-sm': { container: 'h-11 w-11 rounded-md', text: 'text-sm', iconOnly: true },
  icon: { container: 'h-12 w-12 rounded-md', text: 'text-base', iconOnly: true },
  'icon-lg': { container: 'h-14 w-14 rounded-lg', text: 'text-base', iconOnly: true },
};

const hapticVariants: ReadonlySet<ButtonVariant> = new Set<ButtonVariant>([
  'primary',
  'destructive',
]);

function isIconSize(size: ButtonSize): boolean {
  return sizeStyles[size].iconOnly;
}

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      loading = false,
      startIcon,
      endIcon,
      icon,
      disabled,
      className,
      onPressIn,
      onPressOut,
      accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const iconOnly = isIconSize(size);
    const isDisabled = disabled || loading;
    const styles = variantStyles[variant];
    const sizing = sizeStyles[size];

    if (__DEV__) {
      if (iconOnly && !accessibilityLabel && !children) {
        console.warn(
          'UIXVISOR Button: icon sizes require `accessibilityLabel` (or a string `children` used as the name).',
        );
      }
      if (iconOnly && !icon && !startIcon && !loading) {
        console.warn('UIXVISOR Button: icon sizes should pass `icon`.');
      }
    }

    const onPrimary = useThemeColor('primary-foreground');
    const onDestructive = useThemeColor('destructive-foreground');
    const onNeutral = useThemeColor('foreground');
    const spinnerColor =
      variant === 'primary' ? onPrimary : variant === 'destructive' ? onDestructive : onNeutral;

    const feedback = usePressFeedback({
      scale: variant !== 'link',
      haptic: hapticVariants.has(variant) ? 'impact' : 'none',
      disabled: isDisabled,
    });
    const press = composePressHandlers(feedback, { onPressIn, onPressOut });

    const a11yLabel = accessibilityLabel ?? children;
    const glyph = icon ?? startIcon;

    return (
      <Animated.View
        style={[
          { alignSelf: iconOnly ? 'flex-start' : 'stretch' },
          feedback.style,
        ]}
      >
        <Pressable
          ref={ref}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          onPressIn={press.onPressIn}
          onPressOut={press.onPressOut}
          className={cn(
            'flex-row items-center justify-center',
            !iconOnly && 'w-full',
            variant === 'link' && !iconOnly ? 'h-auto px-0' : sizing.container,
            styles.container,
            isDisabled && 'opacity-50',
            className,
          )}
          {...props}
        >
          {loading ? (
            <Spinner size="sm" color={spinnerColor} accessibilityLabel={a11yLabel} />
          ) : iconOnly ? (
            glyph
          ) : (
            <>
              {startIcon ? <View>{startIcon}</View> : null}
              {children ? (
                <Text className={cn('font-medium', sizing.text, styles.text)}>{children}</Text>
              ) : null}
              {endIcon ? <View>{endIcon}</View> : null}
            </>
          )}
        </Pressable>
      </Animated.View>
    );
  },
);

Button.displayName = 'Button';
