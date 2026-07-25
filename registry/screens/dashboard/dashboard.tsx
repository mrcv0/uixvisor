// UIXVISOR — https://uixvisor.dev/screens/dashboard
import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import { ScrollView, Text, View, type ViewProps } from 'react-native';

export interface DashboardScreenProps extends ViewProps {
  greeting: string;
  highlights: Array<{ id: string; title: string; value: string }>;
  children?: ReactNode;
}

export const DashboardScreen = forwardRef<ComponentRef<typeof View>, DashboardScreenProps>(
  ({ greeting, highlights, children, className, ...props }, ref) => (
    <ScrollView
      ref={ref as unknown as React.ComponentRef<typeof ScrollView>}
      accessibilityLabel="Dashboard"
      className={`flex-1 bg-background${className ? ` ${className}` : ''}`}
      contentContainerClassName="gap-6 p-6"
      {...(props as unknown as ScrollView['props'])}
    >
      <Text className="text-2xl font-semibold text-foreground">{greeting}</Text>
      <View className="gap-3">
        {highlights.map((highlight) => (
          <View
            key={highlight.id}
            accessibilityLabel={`${highlight.title} ${highlight.value}`}
            className="rounded-md bg-card p-4 dark:border dark:border-border"
          >
            <Text className="text-xs uppercase text-muted-foreground">{highlight.title}</Text>
            <Text className="text-lg font-semibold text-foreground">{highlight.value}</Text>
          </View>
        ))}
      </View>
      {children}
    </ScrollView>
  ),
);
DashboardScreen.displayName = 'DashboardScreen';
