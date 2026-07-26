// UIXVISOR — https://uixvisor.dev/primitives/switch
import { forwardRef, type ComponentRef } from 'react';
import {
  Pressable,
  Switch as RNSwitch,
  View,
  type SwitchProps as RNSwitchProps,
} from 'react-native';

import { Text } from '@registry/text/text';
import { cn } from '@registry/theme/cn';
import { useThemeColor } from '@registry/theme/theme';

export interface SwitchProps extends Omit<RNSwitchProps, 'value' | 'onValueChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Optional row label; the whole row is pressable when set. */
  label?: string;
  className?: string;
}

export const Switch = forwardRef<ComponentRef<typeof RNSwitch>, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      disabled,
      className,
      accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    // trackColor/thumbColor are native props, so they need resolved values
    // rather than classes.
    const trackOff = useThemeColor('input');
    const trackOn = useThemeColor('primary');
    // Light mode: thumb is near-white on dark track. Dark mode primary is light,
    // so the thumb uses the elevated surface so it still reads as a knob.
    const thumbOn = useThemeColor('primary-foreground');
    const thumbOff = useThemeColor('background');
    const thumb = checked ? thumbOn : thumbOff;

    const control = (
      <RNSwitch
        ref={ref}
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={{ false: trackOff, true: trackOn }}
        thumbColor={thumb}
        ios_backgroundColor={trackOff}
        accessibilityRole="switch"
        accessibilityLabel={label ? undefined : accessibilityLabel}
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        {...props}
      />
    );

    if (!label) {
      return control;
    }

    // Labelled row: the Pressable owns the accessible name so TalkBack/VoiceOver
    // announce the setting, not a nameless switch next to orphaned text.
    return (
      <Pressable
        disabled={disabled}
        onPress={() => onCheckedChange(!checked)}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        accessibilityLabel={accessibilityLabel ?? label}
        className={cn(
          'min-h-12 w-full flex-row items-center justify-between gap-3',
          disabled && 'opacity-50',
          className,
        )}
      >
        <Text size="base" className="min-w-0 flex-1">
          {label}
        </Text>
        <View pointerEvents="none">{control}</View>
      </Pressable>
    );
  },
);

Switch.displayName = 'Switch';
