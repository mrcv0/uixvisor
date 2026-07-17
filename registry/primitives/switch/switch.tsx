// UIXVISOR — https://uixvisor.dev/primitives/switch
import { forwardRef, type ComponentRef } from 'react';
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

export interface SwitchProps extends Omit<RNSwitchProps, 'value' | 'onValueChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TRACK_COLOR = { false: '#e2e8f0', true: '#2563eb' };
const THUMB_COLOR = '#ffffff';

export const Switch = forwardRef<ComponentRef<typeof RNSwitch>, SwitchProps>(
  ({ checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <RNSwitch
        ref={ref}
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={TRACK_COLOR}
        thumbColor={THUMB_COLOR}
        ios_backgroundColor={TRACK_COLOR.false}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        {...props}
      />
    );
  },
);

Switch.displayName = 'Switch';
