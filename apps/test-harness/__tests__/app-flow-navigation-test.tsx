import { fireEvent, render } from '@testing-library/react-native';

import App from '../App';

describe('test harness critical flow navigation', () => {
  test.each([
    ['Test email auth', 'Email authentication'],
    ['Test phone auth', 'Phone authentication'],
    ['Test onboarding', 'Onboarding'],
  ])('opens %s from the harness home', async (buttonLabel, flowLabel) => {
    const screen = await render(<App />);

    await fireEvent.press(screen.getByText(buttonLabel));

    expect(screen.getByLabelText(flowLabel)).toBeTruthy();
  });

  test('surfaces onboarding completion and returns to the harness', async () => {
    const screen = await render(<App />);

    await fireEvent.press(screen.getByText('Test onboarding'));
    await fireEvent.press(screen.getByText('Continue'));
    await fireEvent.press(screen.getByText('Continue'));
    await fireEvent.press(screen.getByText('Get started'));

    expect(screen.getByLabelText('Onboarding complete')).toBeTruthy();

    await fireEvent.press(screen.getByText('Back to harness'));

    expect(screen.getByText('UIXVISOR test harness')).toBeTruthy();
  });
});
