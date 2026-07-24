import { fireEvent, render } from '@testing-library/react-native';

import { Button } from '../../../registry/primitives/button/button';

describe('Button', () => {
  test('handles accessible presses', async () => {
    const onPress = jest.fn();
    const screen = await render(<Button onPress={onPress}>Continue</Button>);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('exposes disabled state while loading', async () => {
    const screen = await render(<Button loading>Continue</Button>);
    const button = screen.getByRole('button');

    expect(button.props.accessibilityState).toEqual({ disabled: true, busy: true });
    expect(screen.queryByText('Continue')).toBeNull();
  });
});
