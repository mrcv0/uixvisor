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
  assert.deepEqual(Object.values(defaultTokens.spacing), [4, 8, 12, 16, 24, 32]);
});

test('resolves mode-specific semantic colors', () => {
  assert.equal(resolveThemeColor(defaultTokens, 'light', 'background'), '#ffffff');
  assert.equal(resolveThemeColor(defaultTokens, 'dark', 'background'), '#09090b');
});

test('keeps the default theme monochrome', () => {
  // Colour carries meaning, not decoration: the primary action is near-black in
  // light mode and near-white in dark mode, never a brand hue.
  assert.equal(defaultTokens.colors.light.primary, '#18181b');
  assert.equal(defaultTokens.colors.dark.primary, '#fafafa');
  assert.equal(defaultTokens.colors.light.ring, '#18181b');
});

test('meets mobile touch target minimums', () => {
  // iOS HIG is 44pt and Material is 48dp; the taller of the two wins.
  assert.ok(defaultTokens.components.button.height >= 48);
  assert.ok(defaultTokens.components.input.height >= 48);
  assert.ok(defaultTokens.components.iconButton.size >= 48);
});

test('tightens tracking on display sizes only', () => {
  // Body text keeps default tracking; large text needs negative tracking to
  // avoid looking loose and undesigned.
  assert.equal(defaultTokens.typography.scale.base.letterSpacing, 0);
  assert.ok(defaultTokens.typography.scale['3xl'].letterSpacing < 0);
});

test('maps font weights to families rather than numeric weights', () => {
  // Android cannot synthesise weights for custom fonts, so every weight needs
  // its own registered family name.
  const families = Object.values(defaultTokens.typography.weights).map((w) => w.family);
  assert.equal(new Set(families).size, families.length);
});

test('emits both iOS and Android shadow primitives for raised surfaces', () => {
  const raised = defaultTokens.elevation.raised;
  assert.ok(raised.shadowOpacity > 0, 'iOS renders nothing when shadowOpacity is 0');
  assert.ok(raised.elevation > 0, 'Android ignores shadow* and only reads elevation');
});

test('separates dark surfaces with colour instead of shadow', () => {
  // Shadows are unreadable on dark backgrounds, so the elevated surface must be
  // a genuinely lighter colour than the background.
  assert.notEqual(defaultTokens.colors.dark['surface-elevated'], defaultTokens.colors.dark.background);
});
