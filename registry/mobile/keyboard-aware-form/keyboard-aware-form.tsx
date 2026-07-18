// UIXVISOR — https://uixvisor.dev/mobile/keyboard-aware-form
import { forwardRef, type ComponentRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

export interface KeyboardAwareFormProps extends ScrollViewProps {
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const KeyboardAwareForm = forwardRef<ComponentRef<typeof ScrollView>, KeyboardAwareFormProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView
          ref={ref}
          keyboardShouldPersistTaps="handled"
          className={cn('flex-1', className)}
          {...props}
        >
          <Pressable onPress={Keyboard.dismiss} accessible={false}>
            {children}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

KeyboardAwareForm.displayName = 'KeyboardAwareForm';
