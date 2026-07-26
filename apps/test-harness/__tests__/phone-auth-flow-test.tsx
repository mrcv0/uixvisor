import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PhoneAuthFlow } from '../../../registry/flows/phone-auth/phone-auth';

describe('PhoneAuthFlow', () => {
  test('phone submit advances to OTP and completes verification', async () => {
    const onRequestCode = jest.fn().mockResolvedValue({});
    const onVerifyOtp = jest.fn().mockResolvedValue(undefined);
    const onComplete = jest.fn();

    const screen = await render(
      <PhoneAuthFlow
        onRequestCode={onRequestCode}
        onVerifyOtp={onVerifyOtp}
        onComplete={onComplete}
      />,
    );

    expect(screen.getByLabelText('Phone authentication')).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('Phone number'), '+15550100');
    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(onRequestCode).toHaveBeenCalled();
      expect(screen.getByLabelText('OTP verification')).toBeTruthy();
    });

    await fireEvent.changeText(screen.getByLabelText('Verification code'), '654321');
    await fireEvent.press(screen.getByText('Verify'));

    await waitFor(() => {
      expect(onVerifyOtp).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
    });
  });

  test('rejects empty phone', async () => {
    const onRequestCode = jest.fn();
    const screen = await render(
      <PhoneAuthFlow
        onRequestCode={onRequestCode}
        onVerifyOtp={jest.fn()}
        onComplete={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Phone number is required')).toBeTruthy();
    });
    expect(onRequestCode).not.toHaveBeenCalled();
  });
});
