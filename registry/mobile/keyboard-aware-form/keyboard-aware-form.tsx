// UIXVISOR — https://uixvisor.dev/mobile/keyboard-aware-form
//
// A screen-level container: it takes the full height available and moves its
// content clear of the keyboard. It must not be nested inside another
// ScrollView - two scroll containers on the same axis fight each other, and the
// inner one collapses to zero height.
import { forwardRef, type ComponentRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

export interface KeyboardAwareFormProps extends ScrollViewProps {
  /**
   * Distance between the keyboard and the focused field, in points. Raise this
   * when the form sits below a header.
   */
  keyboardVerticalOffset?: number;
  className?: string;
  contentContainerClassName?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const KeyboardAwareForm = forwardRef<ComponentRef<typeof ScrollView>, KeyboardAwareFormProps>(
  (
    { children, className, contentContainerClassName, keyboardVerticalOffset = 0, ...props },
    ref,
  ) => {
    return (
      <KeyboardAvoidingView
        // Android resizes the window itself (windowSoftInputMode=adjustResize is
        // the Expo default), so adding `height` here double-compensates and the
        // content jumps. iOS gets no such resize and needs the padding.
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
        className="flex-1"
      >
        <ScrollView
          ref={ref}
          // `handled` lets a tap reach a button on the first press instead of
          // being swallowed to dismiss the keyboard.
          keyboardShouldPersistTaps="handled"
          // Dragging the form away is the gesture users expect for dismissing.
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          onScrollBeginDrag={Keyboard.dismiss}
          className={cn('flex-1', className)}
          contentContainerClassName={cn('gap-4 p-4', contentContainerClassName)}
          {...props}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

KeyboardAwareForm.displayName = 'KeyboardAwareForm';
