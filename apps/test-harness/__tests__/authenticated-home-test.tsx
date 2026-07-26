import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { AuthenticatedHomeFlow } from '../../../registry/flows/authenticated-home/authenticated-home';

describe('AuthenticatedHomeFlow', () => {
  test('navigates to destinations', async () => {
    const onNavigate = jest.fn();
    const screen = await render(
      <AuthenticatedHomeFlow userName="Ada" onNavigate={onNavigate} onSignOut={jest.fn()} />,
    );

    expect(screen.getByLabelText('Authenticated home')).toBeTruthy();
    expect(screen.getByText('Your account')).toBeTruthy();

    await fireEvent.press(screen.getByText('Dashboard'));
    expect(onNavigate).toHaveBeenCalledWith('dashboard');

    await fireEvent.press(screen.getByText('Profile'));
    expect(onNavigate).toHaveBeenCalledWith('profile');
  });

  test('sign out calls adapter then logout navigate', async () => {
    const onNavigate = jest.fn();
    const onSignOut = jest.fn().mockResolvedValue(undefined);
    const screen = await render(
      <AuthenticatedHomeFlow userName="Ada" onNavigate={onNavigate} onSignOut={onSignOut} />,
    );

    await fireEvent.press(screen.getByLabelText('Sign out'));

    await waitFor(() => {
      expect(onSignOut).toHaveBeenCalled();
      expect(onNavigate).toHaveBeenCalledWith('logout');
    });
  });

  test('surfaces sign-out errors without navigating logout', async () => {
    const onNavigate = jest.fn();
    const onSignOut = jest.fn().mockRejectedValue(new Error('Network offline'));
    const screen = await render(
      <AuthenticatedHomeFlow userName="Ada" onNavigate={onNavigate} onSignOut={onSignOut} />,
    );

    await fireEvent.press(screen.getByLabelText('Sign out'));

    await waitFor(() => {
      expect(screen.getByText('Network offline')).toBeTruthy();
    });
    expect(onNavigate).not.toHaveBeenCalledWith('logout');
  });
});
