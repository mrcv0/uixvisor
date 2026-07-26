import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { SignInScreen } from '../../../registry/screens/sign-in/sign-in';

describe('SignInScreen validation', () => {
  test('shows field errors when submitting empty form', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<SignInScreen onSubmit={onSubmit} />);

    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('rejects invalid email without calling onSubmit', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<SignInScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Email'), 'not-an-email');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit with parsed values when valid', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const screen = await render(<SignInScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'secret',
      });
    });
  });

  test('surfaces root error when onSubmit throws', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    const screen = await render(<SignInScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeTruthy();
    });
  });

  test('trims email before submit', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const screen = await render(<SignInScreen onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Email'), '  ada@example.com  ');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'secret',
      });
    });
  });
});
