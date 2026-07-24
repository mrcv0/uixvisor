import assert from 'node:assert/strict';
import { test } from 'node:test';

import { fintechPreset, getPreset, validatePreset } from './index.js';

test('returns built-in presets by name', () => {
  assert.equal(getPreset('fintech'), fintechPreset);
});

test('keeps required semantic colors complete', () => {
  assert.deepEqual(validatePreset(fintechPreset), []);
});

test('applies fintech-specific trust colors', () => {
  assert.equal(fintechPreset.tokens.colors.light.primary, '#0369a1');
  assert.equal(fintechPreset.tokens.colors.light.success, '#047857');
});
