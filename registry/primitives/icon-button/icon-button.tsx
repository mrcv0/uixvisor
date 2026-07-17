// UIXVISOR — https://uixvisor.dev/primitives/icon-button
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  accessibilityLabel: string;
  className?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-primary active:opacity-80',
  secondary: 'border border-border bg-secondary active:opacity-80',
  ghost: 'active:bg-muted',
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const IconButton = forwardRef<ComponentRef<typeof Pressable>, IconButtonProps>(
  ({ icon, variant = 'primary', disabled, className, accessibilityLabel, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: Boolean(disabled) }}
        className={cn(
          'h-11 w-11 items-center justify-center rounded-xl',
          variantStyles[variant],
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {icon}
      </Pressable>
    );
  },
);

IconButton.displayName = 'IconButton';
