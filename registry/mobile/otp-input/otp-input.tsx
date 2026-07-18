// UIXVISOR — https://uixvisor.dev/mobile/otp-input
import { forwardRef, type ComponentRef } from 'react';
import { Pressable, View } from 'react-native';

import { Input, type InputProps } from '@registry/input/input';
import { Text } from '@registry/text/text';

export interface OTPInputProps extends Omit<InputProps, 'label' | 'maxLength' | 'keyboardType'> {
  length?: number;
  onResend?: () => void;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const OTPInput = forwardRef<ComponentRef<typeof Input>, OTPInputProps>(
  ({ length = 6, onResend, className, onChangeText, ...props }, ref) => {
    return (
      <View className="gap-2">
        <Input
          ref={ref}
          label="Verification code"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={length}
          onChangeText={(text) => onChangeText?.(text.replace(/[^0-9]/g, '').slice(0, length))}
          className={cn('text-center text-2xl tracking-[8px]', className)}
          {...props}
        />
        {onResend ? (
          <Pressable onPress={onResend} accessibilityRole="button" accessibilityLabel="Resend code">
            <Text variant="muted" size="sm">
              Didn&apos;t get a code?{' '}
              <Text size="sm" className="font-medium text-primary">
                Resend
              </Text>
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  },
);

OTPInput.displayName = 'OTPInput';
