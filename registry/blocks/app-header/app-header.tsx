// UIXVISOR — https://uixvisor.dev/blocks/app-header
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { Pressable, Text, View, type ViewProps } from 'react-native';

export interface AppHeaderProps extends ViewProps {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export const AppHeader = forwardRef<ComponentRef<typeof View>, AppHeaderProps>(
  ({ title, leading, trailing, onBack, backLabel = 'Go back', className, ...props }, ref) => (
    <View
      ref={ref}
      accessibilityRole="header"
      className={`flex-row items-center gap-3 border-b border-border bg-background px-4 py-3${className ? ` ${className}` : ''}`}
      {...props}
    >
      {leading ?? (onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-md active:bg-muted"
        >
          <Text className="text-base text-foreground">←</Text>
        </Pressable>
      ) : null)}
      <Text accessibilityRole="header" className="flex-1 text-lg font-semibold text-foreground">
        {title}
      </Text>
      {trailing ? <View className="items-center justify-center">{trailing}</View> : null}
    </View>
  ),
);
AppHeader.displayName = 'AppHeader';
