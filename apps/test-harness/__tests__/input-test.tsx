import { fireEvent, render } from '@testing-library/react-native';

import { Input } from '../../../registry/primitives/input/input';

describe('Input', () => {
  test('forwards text changes and exposes errors', async () => {
    const onChangeText = jest.fn();
    const screen = await render(
      <Input label="Email" error="Email is required" onChangeText={onChangeText} />,
    );

    await fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');

    expect(onChangeText).toHaveBeenCalledWith('user@example.com');
    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  test('disabled alias blocks editing and exposes state', async () => {
    const screen = await render(<Input label="Name" value="Ada" disabled />);
    const field = screen.getByLabelText('Name');

    expect(field.props.editable).toBe(false);
    expect(field.props.accessibilityState).toEqual({ disabled: true });
  });

  test('hint is shown when there is no error', async () => {
    const screen = await render(<Input label="Email" hint="Work address preferred" />);
    expect(screen.getByText('Work address preferred')).toBeTruthy();
  });
});