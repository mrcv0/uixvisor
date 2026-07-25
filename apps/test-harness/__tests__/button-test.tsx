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

  test('renders destructive variant with accessible name', async () => {
    const onPress = jest.fn();
    const screen = await render(
      <Button variant="destructive" onPress={onPress}>
        Delete project
      </Button>,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Delete project' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('respects the disabled prop and ignores presses', async () => {
    const onPress = jest.fn();
    const screen = await render(
      <Button disabled onPress={onPress}>
        Disabled
      </Button>,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Disabled' }));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState.disabled).toBe(true);
  });
});
