import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@registry/text/text';

import {
  AvatarDemo,
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  CheckboxDemo,
  HeadingDemo,
  IconButtonDemo,
  IconDemo,
  InputDemo,
  ProgressDemo,
  RadioGroupDemo,
  SeparatorDemo,
  SkeletonDemo,
  SpinnerDemo,
  SwitchDemo,
  TextareaDemo,
  TextDemo,
  ThemeDemo,
} from './primitives';
import {
  BottomSheetDemo,
  EmptyStateDemo,
  ErrorStateDemo,
  KeyboardAwareFormDemo,
  OtpInputDemo,
  SearchBarDemo,
  SwipeableRowDemo,
  ToastDemo,
} from './mobile';
import {
  AppHeaderDemo,
  ButtonGroupDemo,
  FormFieldDemo,
  ListItemDemo,
} from './blocks';
import {
  DashboardDemo,
  OtpVerifyDemo,
  ProfileDemo,
  SettingsDemo,
  SignInDemo,
  SignUpDemo,
} from './screens';
import { AuthenticatedHomeDemo } from './flows';

const demos: Record<string, () => ReactNode> = {
  // primitives
  theme: () => <ThemeDemo />,
  text: () => <TextDemo />,
  heading: () => <HeadingDemo />,
  button: () => <ButtonDemo />,
  'icon-button': () => <IconButtonDemo />,
  icon: () => <IconDemo />,
  input: () => <InputDemo />,
  textarea: () => <TextareaDemo />,
  checkbox: () => <CheckboxDemo />,
  'radio-group': () => <RadioGroupDemo />,
  switch: () => <SwitchDemo />,
  card: () => <CardDemo />,
  avatar: () => <AvatarDemo />,
  badge: () => <BadgeDemo />,
  separator: () => <SeparatorDemo />,
  spinner: () => <SpinnerDemo />,
  skeleton: () => <SkeletonDemo />,
  progress: () => <ProgressDemo />,

  // mobile
  'otp-input': () => <OtpInputDemo />,
  'search-bar': () => <SearchBarDemo />,
  toast: () => <ToastDemo />,
  'empty-state': () => <EmptyStateDemo />,
  'error-state': () => <ErrorStateDemo />,
  'bottom-sheet': () => <BottomSheetDemo />,
  'swipeable-row': () => <SwipeableRowDemo />,
  'keyboard-aware-form': () => <KeyboardAwareFormDemo />,

  // blocks
  'app-header': () => <AppHeaderDemo />,
  'button-group': () => <ButtonGroupDemo />,
  'form-field': () => <FormFieldDemo />,
  'list-item': () => <ListItemDemo />,

  // screens
  'sign-in': () => <SignInDemo />,
  'sign-up': () => <SignUpDemo />,
  'otp-verify': () => <OtpVerifyDemo />,
  dashboard: () => <DashboardDemo />,
  profile: () => <ProfileDemo />,
  settings: () => <SettingsDemo />,

  // flows
  'authenticated-home': () => <AuthenticatedHomeDemo />,
};

export function renderDemo(itemId: string): ReactNode {
  const demo = demos[itemId];
  if (!demo) {
    return (
      <View className="p-6">
        <Text variant="muted">No demo registered for “{itemId}”.</Text>
      </View>
    );
  }
  return demo();
}
