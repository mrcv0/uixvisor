import { fireEvent, render } from '@testing-library/react-native';

import { SignInScreen } from '../../../registry/screens/sign-in/sign-in';

describe('SignInScreen links', () => {
  test('exposes forgot password and create account callbacks', async () => {
    const onForgotPasswordPress = jest.fn();
    const onSignUpPress = jest.fn();
    const screen = await render(
      <SignInScreen
        onSubmit={jest.fn()}
        onForgotPasswordPress={onForgotPasswordPress}
        onSignUpPress={onSignUpPress}
      />,
    );

    await fireEvent.press(screen.getByLabelText('Forgot password'));
    await fireEvent.press(screen.getByLabelText('Create account'));

    expect(onForgotPasswordPress).toHaveBeenCalledTimes(1);
    expect(onSignUpPress).toHaveBeenCalledTimes(1);
  });
});
