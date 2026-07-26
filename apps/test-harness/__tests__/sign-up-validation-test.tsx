import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { SignUpScreen } from '../../../registry/screens/sign-up/sign-up';

describe('SignUpScreen validation', () => {
  test('shows field errors when submitting empty form', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<SignUpScreen onSubmit={onSubmit} />);

    await fireEvent.press(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeTruthy();
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('rejects short password', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<SignUpScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Name'), 'Ada');
    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'short');
    await fireEvent.press(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit with parsed values when valid', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const screen = await render(<SignUpScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Name'), 'Ada Lovelace');
    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret12');
    await fireEvent.press(screen.getByText('Create account'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret12',
      });
    });
  });

  test('surfaces root error when onSubmit throws', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Email already registered'));
    const screen = await render(<SignUpScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Name'), 'Ada');
    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret12');
    await fireEvent.press(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeTruthy();
    });
  });
});
