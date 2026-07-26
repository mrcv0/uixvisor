// UIXVISOR — https://uixvisor.dev/screens/dashboard
//
// Content-only dashboard: host supplies metrics and optional empty/action slots.
import { forwardRef, type ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

import { AppHeader } from '@registry/app-header/app-header';
import { Card, CardContent } from '@registry/card/card';
import { EmptyState } from '@registry/empty-state/empty-state';
import { Heading } from '@registry/heading/heading';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface DashboardHighlight {
  id: string;
  title: string;
  value: string;
  /** Optional secondary line under the value. */
  hint?: string;
}

export interface DashboardScreenProps extends ScrollViewProps {
  greeting: string;
  /** Optional muted line under the greeting. */
  subtitle?: string;
  highlights: DashboardHighlight[];
  /** Shown when `highlights` is empty. Defaults to a simple empty state. */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  headerTitle?: string;
  onBack?: () => void;
  /** Content below metrics (CTAs, lists, …). */
  children?: ReactNode;
  className?: string;
}

export const DashboardScreen = forwardRef<ScrollView, DashboardScreenProps>(
  (
    {
      greeting,
      subtitle,
      highlights,
      emptyTitle = 'No metrics yet',
      emptyDescription = 'Highlights will show up here once data is available.',
      emptyAction,
      headerTitle,
      onBack,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const showHeader = Boolean(headerTitle || onBack);
    const isEmpty = highlights.length === 0;

    return (
      <View className={cn('flex-1 bg-background', className)}>
        {showHeader ? (
          <AppHeader title={headerTitle ?? 'Dashboard'} onBack={onBack} />
        ) : null}
        <ScrollView
          ref={ref}
          accessibilityLabel="Dashboard"
          className="flex-1"
          contentContainerClassName="gap-6 p-6"
          {...props}
        >
          <View className="gap-1.5">
            <Heading level={2} numberOfLines={2}>
              {greeting}
            </Heading>
            {subtitle ? (
              <Text variant="muted" size="sm" numberOfLines={3}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {isEmpty ? (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
              className="min-h-[200px] rounded-xl border border-border bg-card py-10"
            />
          ) : (
            <View className="gap-3">
              {highlights.map((highlight) => (
                <Card
                  key={highlight.id}
                  elevation="surface"
                  accessibilityLabel={`${highlight.title} ${highlight.value}`}
                >
                  <CardContent className="gap-1">
                    <Text size="xs" variant="muted" weight="medium" className="uppercase">
                      {highlight.title}
                    </Text>
                    <Text size="lg" weight="semibold">
                      {highlight.value}
                    </Text>
                    {highlight.hint ? (
                      <Text size="xs" variant="muted">
                        {highlight.hint}
                      </Text>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </View>
          )}

          {children}
        </ScrollView>
      </View>
    );
  },
);
DashboardScreen.displayName = 'DashboardScreen';
