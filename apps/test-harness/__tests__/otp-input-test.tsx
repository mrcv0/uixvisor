import { fireEvent, render } from '@testing-library/react-native';

import { OTPInput } from '../../../registry/mobile/otp-input/otp-input';

describe('OTPInput', () => {
  test('normalizes codes and handles resend', async () => {
    const onChangeText = jest.fn();
    const onResend = jest.fn();
    const screen = await render(<OTPInput onChangeText={onChangeText} onResend={onResend} />);

    await fireEvent.changeText(screen.getByLabelText('Verification code'), '12a34567');
    await fireEvent.press(screen.getByRole('button', { name: 'Resend code' }));

    expect(onChangeText).toHaveBeenCalledWith('123456');
    expect(onResend).toHaveBeenCalledTimes(1);
  });
});
