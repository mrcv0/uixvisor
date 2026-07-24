import { fireEvent, render } from '@testing-library/react-native';

import { BottomSheet } from '../../../registry/mobile/bottom-sheet/bottom-sheet';
import { Text } from '../../../registry/primitives/text/text';

describe('BottomSheet', () => {
  test('renders visible content and closes from the backdrop', async () => {
    const onClose = jest.fn();
    const screen = await render(
      <BottomSheet visible onClose={onClose}>
        <Text>Sheet content</Text>
      </BottomSheet>,
    );

    expect(screen.getByText('Sheet content')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
