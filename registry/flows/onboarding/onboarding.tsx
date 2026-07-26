// UIXVISOR — https://uixvisor.dev/flows/onboarding
//
// Linear onboarding pager. Host supplies step content; flow owns index state
// (or accepts controlled index via optional props).
import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Button } from '@registry/button/button';
import { Heading } from '@registry/heading/heading';
import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  /** Optional illustration or media above the title. */
  media?: ReactNode;
}

export interface OnboardingFlowProps extends ViewProps {
  steps: OnboardingStep[];
  /** Controlled step index. Omit for internal state. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  onComplete: () => void;
  /** Shown on every step except the last when provided. */
  onSkip?: () => void;
  nextLabel?: string;
  doneLabel?: string;
  skipLabel?: string;
  className?: string;
}

export const OnboardingFlow = forwardRef<ComponentRef<typeof View>, OnboardingFlowProps>(
  (
    {
      steps,
      index: indexProp,
      defaultIndex = 0,
      onIndexChange,
      onComplete,
      onSkip,
      nextLabel = 'Continue',
      doneLabel = 'Get started',
      skipLabel = 'Skip',
      className,
      ...props
    },
    ref,
  ) => {
    const controlled = indexProp !== undefined;
    const [indexLocal, setIndexLocal] = useState(defaultIndex);
    const index = controlled ? indexProp : indexLocal;
    const safeIndex = Math.min(Math.max(index, 0), Math.max(steps.length - 1, 0));
    const step = steps[safeIndex];
    const isLast = safeIndex >= steps.length - 1;

    const setIndex = (next: number) => {
      if (!controlled) setIndexLocal(next);
      onIndexChange?.(next);
    };

    if (!step || steps.length === 0) {
      return (
        <View
          ref={ref}
          accessibilityLabel="Onboarding"
          className={cn('flex-1 items-center justify-center bg-background p-6', className)}
          {...props}
        >
          <Text variant="muted">No onboarding steps configured.</Text>
        </View>
      );
    }

    return (
      <View
        ref={ref}
        accessibilityLabel="Onboarding"
        accessibilityValue={{
          min: 1,
          max: steps.length,
          now: safeIndex + 1,
          text: `Step ${safeIndex + 1} of ${steps.length}`,
        }}
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        <View className="flex-1 justify-between gap-8 p-6">
          <View className="flex-1 items-center justify-center gap-6">
            {step.media ? (
              <View className="mb-2 w-full items-center">{step.media}</View>
            ) : null}
            <View className="w-full max-w-sm gap-3">
              <Heading level={2} className="text-center">
                {step.title}
              </Heading>
              <Text variant="muted" size="base" className="text-center">
                {step.description}
              </Text>
            </View>
          </View>

          <View className="gap-4">
            <View
              className="flex-row items-center justify-center gap-2"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              {steps.map((item, i) => (
                <View
                  key={item.id}
                  className={cn(
                    'h-2 rounded-full',
                    i === safeIndex ? 'w-6 bg-primary' : 'w-2 bg-muted',
                  )}
                />
              ))}
            </View>

            <Button
              onPress={() => {
                if (isLast) {
                  onComplete();
                  return;
                }
                setIndex(safeIndex + 1);
              }}
            >
              {isLast ? doneLabel : nextLabel}
            </Button>

            {!isLast && onSkip ? (
              <Button variant="ghost" onPress={onSkip}>
                {skipLabel}
              </Button>
            ) : null}
          </View>
        </View>
      </View>
    );
  },
);
OnboardingFlow.displayName = 'OnboardingFlow';
