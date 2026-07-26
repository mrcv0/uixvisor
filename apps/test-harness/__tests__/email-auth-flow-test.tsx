import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { EmailAuthFlow } from '../../../registry/flows/email-auth/email-auth';

describe('EmailAuthFlow', () => {
  test('switches to sign-up and back via footer links', async () => {
    const screen = await render(
      <EmailAuthFlow
        onSignIn={jest.fn()}
        onSignUp={jest.fn()}
        onVerifyOtp={jest.fn()}
        onComplete={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Sign in')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Create account'));
    expect(screen.getByLabelText('Sign up')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Sign in'));
    expect(screen.getByLabelText('Sign in')).toBeTruthy();
  });

  test('sign-in with requireOtp advances to OTP then completes', async () => {
    const onComplete = jest.fn();
    const onVerifyOtp = jest.fn().mockResolvedValue(undefined);
    const screen = await render(
      <EmailAuthFlow
        requireOtpAfterSignIn
        onSignIn={async () => ({ needsOtp: true })}
        onSignUp={jest.fn()}
        onVerifyOtp={onVerifyOtp}
        onComplete={onComplete}
      />,
    );

    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByLabelText('OTP verification')).toBeTruthy();
    });

    await fireEvent.changeText(screen.getByLabelText('Verification code'), '123456');
    await fireEvent.press(screen.getByText('Verify'));

    await waitFor(() => {
      expect(onVerifyOtp).toHaveBeenCalledWith('123456', {
        mode: 'sign-in',
        email: 'ada@example.com',
      });
      expect(onComplete).toHaveBeenCalledWith({ mode: 'sign-in' });
    });
  });
});
