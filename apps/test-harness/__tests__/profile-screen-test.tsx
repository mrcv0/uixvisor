import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ProfileScreen } from '../../../registry/screens/profile/profile';

describe('ProfileScreen', () => {
  test('renders identity and actions slot', async () => {
    const screen = await render(
      <ProfileScreen
        name="Ada Lovelace"
        email="ada@example.com"
        bio="First programmer"
        actions={<Text>Edit profile</Text>}
      />,
    );

    expect(screen.getByLabelText('Profile')).toBeTruthy();
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('ada@example.com')).toBeTruthy();
    expect(screen.getByText('First programmer')).toBeTruthy();
    expect(screen.getByText('Edit profile')).toBeTruthy();
    expect(screen.getByLabelText('Ada Lovelace avatar')).toBeTruthy();
  });

  test('omits bio when not provided without crashing', async () => {
    const screen = await render(
      <ProfileScreen name="Ada" email="ada@example.com" />,
    );

    expect(screen.getByText('Ada')).toBeTruthy();
    expect(screen.queryByText('First programmer')).toBeNull();
  });
});
