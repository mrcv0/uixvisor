import assert from 'node:assert/strict';
import { test } from 'node:test';

import { defaultTokens, resolveThemeColor, semanticColorNames } from './index.js';

test('provides every semantic color in both modes', () => {
  for (const name of semanticColorNames) {
    assert.ok(defaultTokens.colors.light[name]);
    assert.ok(defaultTokens.colors.dark[name]);
  }
});

test('uses a four-point spacing foundation', () => {
  assert.deepEqual(Object.values(defaultTokens.spacing), [4, 8, 16, 24, 32]);
});

test('resolves mode-specific semantic colors', () => {
  assert.equal(resolveThemeColor(defaultTokens, 'light', 'background'), '#ffffff');
  assert.equal(resolveThemeColor(defaultTokens, 'dark', 'background'), '#0b1220');
});
