# @uixvisor/presets

Default and Fintech presets built on `@uixvisor/tokens`.

## Presets

- `default`: neutral monochrome foundation
- `fintech`: blue primary and green success accents for financial products

## Usage

```ts
import {
  fintechPreset,
  getPreset,
  validatePreset,
} from '@uixvisor/presets';

const preset = getPreset('fintech');
const missingTokens = validatePreset(fintechPreset);

if (missingTokens.length > 0) {
  throw new Error(`Invalid preset: ${missingTokens.join(', ')}`);
}

console.log(preset.tokens.colors.light.primary);
```

Presets change token values, not component copies or component APIs.

## License

MIT. The UIXVISOR name and logo are not granted by the code license.
