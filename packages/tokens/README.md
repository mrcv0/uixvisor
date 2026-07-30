# @uixvisor/tokens

Typed semantic design tokens for UIXVISOR.

## Included token layers

- Light and dark semantic colors
- Spacing and radius scales
- Typography sizes, line heights, tracking and font-family weights
- Motion durations, easing, press scale and opacity
- Cross-platform elevation values
- Component-level dimensions
- Semantic icon names

## Usage

```ts
import {
  defaultTokens,
  resolveThemeColor,
  type DesignTokens,
} from '@uixvisor/tokens';

const primary = resolveThemeColor(defaultTokens, 'light', 'primary');

const applicationTokens: DesignTokens = {
  ...defaultTokens,
  colors: {
    ...defaultTokens.colors,
    light: {
      ...defaultTokens.colors.light,
      primary: '#0369a1',
    },
  },
};
```

This package defines build-time token data and types. Registry components are
copy-and-own and do not require `@uixvisor/tokens` at application runtime.

## License

MIT. The UIXVISOR name and logo are not granted by the code license.
