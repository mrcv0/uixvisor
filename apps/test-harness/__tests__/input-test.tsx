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
});
