// UIXVISOR — https://uixvisor.dev/primitives/switch
import { forwardRef, type ComponentRef } from 'react';
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

import { useThemeColor } from '@registry/theme/theme';

export interface SwitchProps extends Omit<RNSwitchProps, 'value' | 'onValueChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = forwardRef<ComponentRef<typeof RNSwitch>, SwitchProps>(
  ({ checked, onCheckedChange, disabled, ...props }, ref) => {
    // trackColor/thumbColor are native props, so they need resolved values
    // rather than classes.
    const trackOff = useThemeColor('input');
    const trackOn = useThemeColor('primary');
    const thumb = useThemeColor('primary-foreground');

    return (
      <RNSwitch
        ref={ref}
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={{ false: trackOff, true: trackOn }}
        thumbColor={thumb}
        ios_backgroundColor={trackOff}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        {...props}
      />
    );
  },
);

Switch.displayName = 'Switch';
