import assert from 'node:assert/strict';
import { test } from 'node:test';

import { accessibilityIssues, assertAccessible } from './accessibility.js';

test('accepts labelled roles', () => {
  assert.deepEqual(
    accessibilityIssues({ accessibilityRole: 'button', accessibilityLabel: 'Continue' }),
    [],
  );
});

test('reports missing accessibility properties', () => {
  assert.deepEqual(accessibilityIssues({}), [
    'accessibilityRole is required',
    'accessibilityLabel is required',
  ]);
});

test('throws a combined accessibility failure', () => {
  assert.throws(() => assertAccessible({}), /accessibilityRole.*accessibilityLabel/);
});
