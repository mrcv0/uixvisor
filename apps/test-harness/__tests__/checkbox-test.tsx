import { fireEvent, render } from '@testing-library/react-native';

import { Checkbox } from '../../../registry/primitives/checkbox/checkbox';

describe('Checkbox', () => {
  test('toggles and exposes accessible state', async () => {
    const onCheckedChange = jest.fn();
    const screen = await render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange} label="Accept terms" />,
    );

    const control = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(control.props.accessibilityState.checked).toBe(false);

    await fireEvent.press(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  test('reports mixed state when indeterminate', async () => {
    const screen = await render(
      <Checkbox
        checked={false}
        indeterminate
        onCheckedChange={() => {}}
        label="Select all"
      />,
    );

    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe('mixed');
  });
});
