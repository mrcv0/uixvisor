import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { OtpVerifyScreen } from '../../../registry/screens/otp-verify/otp-verify';

describe('OtpVerifyScreen validation', () => {
  test('rejects empty or short codes', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<OtpVerifyScreen onSubmit={onSubmit} />);

    await fireEvent.press(screen.getByText('Verify'));

    await waitFor(() => {
      expect(screen.getByText('Enter the 6-digit code')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('rejects non-digit codes', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<OtpVerifyScreen onSubmit={onSubmit} />);

    // OTPInput strips non-digits; partial digits still fail length.
    await fireEvent.changeText(screen.getByLabelText('Verification code'), '12ab');
    await fireEvent.press(screen.getByText('Verify'));

    await waitFor(() => {
      expect(screen.getByText('Enter the 6-digit code')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit with code when valid', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const screen = await render(<OtpVerifyScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Verification code'), '123456');
    await fireEvent.press(screen.getByText('Verify'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('123456');
    });
  });

  test('surfaces root error when onSubmit throws', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Code expired'));
    const screen = await render(<OtpVerifyScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Verification code'), '123456');
    await fireEvent.press(screen.getByText('Verify'));

    await waitFor(() => {
      expect(screen.getByText('Code expired')).toBeTruthy();
    });
  });
});
