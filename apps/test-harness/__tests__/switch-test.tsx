import { fireEvent, render } from '@testing-library/react-native';

import { Switch } from '../../../registry/primitives/switch/switch';

describe('Switch', () => {
  test('labelled row toggles on press', async () => {
    const onCheckedChange = jest.fn();
    const screen = await render(
      <Switch label="Notifications" checked={false} onCheckedChange={onCheckedChange} />,
    );

    await fireEvent.press(screen.getByRole('switch', { name: 'Notifications' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
