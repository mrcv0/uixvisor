import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { SettingsScreen } from '../../../registry/screens/settings/settings';

describe('SettingsScreen', () => {
  test('renders title and fires onChange when toggles change', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <SettingsScreen defaultNotifications defaultBiometrics={false} onChange={onChange} />,
    );

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByLabelText('Settings')).toBeTruthy();

    await fireEvent(screen.getByLabelText('Toggle push notifications'), 'valueChange', false);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        notifications: false,
        biometrics: false,
      });
    });
  });

  test('supports controlled notifications prop', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <SettingsScreen notifications={false} biometrics={false} onChange={onChange} />,
    );

    const toggle = screen.getByLabelText('Toggle push notifications');
    expect(toggle.props.value ?? toggle.props.accessibilityState?.checked).toBeFalsy();

    await fireEvent(toggle, 'valueChange', true);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        notifications: true,
        biometrics: false,
      });
    });
  });
});
