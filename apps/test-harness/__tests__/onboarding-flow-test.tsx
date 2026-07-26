import { fireEvent, render } from '@testing-library/react-native';

import { OnboardingFlow } from '../../../registry/flows/onboarding/onboarding';

const steps = [
  { id: '1', title: 'Welcome', description: 'First step' },
  { id: '2', title: 'Theme', description: 'Second step' },
  { id: '3', title: 'Ship', description: 'Last step' },
];

describe('OnboardingFlow', () => {
  test('advances through steps and completes', async () => {
    const onComplete = jest.fn();
    const onIndexChange = jest.fn();
    const screen = await render(
      <OnboardingFlow
        steps={steps}
        onComplete={onComplete}
        onIndexChange={onIndexChange}
        onSkip={jest.fn()}
      />,
    );

    expect(screen.getByText('Welcome')).toBeTruthy();
    await fireEvent.press(screen.getByText('Continue'));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('Theme')).toBeTruthy();

    await fireEvent.press(screen.getByText('Continue'));
    expect(screen.getByText('Ship')).toBeTruthy();

    await fireEvent.press(screen.getByText('Get started'));
    expect(onComplete).toHaveBeenCalled();
  });

  test('skip calls onSkip', async () => {
    const onSkip = jest.fn();
    const screen = await render(
      <OnboardingFlow steps={steps} onComplete={jest.fn()} onSkip={onSkip} />,
    );

    await fireEvent.press(screen.getByText('Skip'));
    expect(onSkip).toHaveBeenCalled();
  });
});
