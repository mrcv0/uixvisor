import assert from 'node:assert/strict';
import { test } from 'node:test';

import { defaultPreset, fintechPreset, getPreset, validatePreset } from './index.js';

test('returns built-in presets by name', () => {
  assert.equal(getPreset('fintech'), fintechPreset);
});

test('keeps required semantic colors complete', () => {
  assert.deepEqual(validatePreset(fintechPreset), []);
  assert.deepEqual(validatePreset(defaultPreset), []);
});

test('applies fintech-specific trust colors', () => {
  assert.equal(fintechPreset.tokens.colors.light.primary, '#0369a1');
  assert.equal(fintechPreset.tokens.colors.light.success, '#047857');
});

test('departs from the monochrome base only on the action colour', () => {
  // A preset should prove theming works without redesigning the system: the
  // neutrals must still come from the default tokens.
  const base = defaultPreset.tokens.colors;
  const fin = fintechPreset.tokens.colors;

  assert.notEqual(fin.light.primary, base.light.primary);
  for (const name of ['background', 'foreground', 'secondary', 'muted-foreground', 'border'] as const) {
    assert.equal(fin.light[name], base.light[name]);
    assert.equal(fin.dark[name], base.dark[name]);
  }
});

test('keeps the action colour legible against its foreground', () => {
  assert.notEqual(
    fintechPreset.tokens.colors.light.primary,
    fintechPreset.tokens.colors.light['primary-foreground'],
  );
  assert.notEqual(
    fintechPreset.tokens.colors.dark.primary,
    fintechPreset.tokens.colors.dark['primary-foreground'],
  );
});
