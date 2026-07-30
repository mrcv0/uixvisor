# @uixvisor/testing

React Native Testing Library helpers and lightweight accessibility assertions
for UIXVISOR-compatible components.

## Peer requirements

- React 19 or newer
- React Native 0.86 or newer
- React Native Testing Library 14 or newer
- React Native Safe Area Context 5.7 or newer

## Provider-aware rendering

```tsx
import { renderWithProviders } from '@uixvisor/testing';

const screen = await renderWithProviders(<ProfileScreen />);
screen.getByText('Profile');
```

`renderWithProviders` supplies deterministic safe-area metrics for a
390-by-844 mobile viewport.

## Accessibility assertions

```ts
import { assertAccessible } from '@uixvisor/testing';

assertAccessible({
  accessibilityRole: 'button',
  accessibilityLabel: 'Continue',
  accessibilityState: { disabled: false },
});
```

Use `accessibilityIssues` when a test needs to inspect the issue list instead of
throwing immediately.

## License

MIT. The UIXVISOR name and logo are not granted by the code license.
