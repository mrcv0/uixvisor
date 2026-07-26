import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { DashboardScreen } from '../../../registry/screens/dashboard/dashboard';

describe('DashboardScreen', () => {
  test('renders greeting and highlight cards', async () => {
    const screen = await render(
      <DashboardScreen
        greeting="Good morning"
        subtitle="Overview"
        highlights={[
          { id: '1', title: 'Revenue', value: '$10' },
          { id: '2', title: 'Users', value: '42' },
        ]}
      >
        <Text>Extra actions</Text>
      </DashboardScreen>,
    );

    expect(screen.getByLabelText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('$10')).toBeTruthy();
    expect(screen.getByLabelText('Revenue $10')).toBeTruthy();
    expect(screen.getByText('Extra actions')).toBeTruthy();
  });

  test('shows empty state when highlights are empty', async () => {
    const screen = await render(
      <DashboardScreen
        greeting="Hello"
        highlights={[]}
        emptyTitle="No metrics yet"
        emptyDescription="Check back later"
      />,
    );

    expect(screen.getByText('No metrics yet')).toBeTruthy();
    expect(screen.getByText('Check back later')).toBeTruthy();
  });
});
