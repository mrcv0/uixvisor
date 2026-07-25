import assert from 'node:assert/strict';
import { test } from 'node:test';

import { semanticIconNames, validateIconSet } from './icons.js';

test('reports nothing missing for a complete set', () => {
  const complete = Object.fromEntries(semanticIconNames.map((name) => [name, () => null]));
  assert.deepEqual(validateIconSet(complete), []);
});

test('reports every name an adapter failed to provide', () => {
  const partial = { check: () => null, close: () => null };
  const missing = validateIconSet(partial);

  assert.ok(missing.includes('search'));
  assert.ok(!missing.includes('check'));
  assert.equal(missing.length, semanticIconNames.length - 2);
});

test('treats an empty set as entirely missing', () => {
  assert.deepEqual(validateIconSet({}), [...semanticIconNames]);
});

test('keeps semantic names free of library-specific wording', () => {
  // "MagnifyingGlass" is Phosphor's name and "Search" is Lucide's; the contract
  // must stay neutral so swapping adapters never leaks into components.
  for (const name of semanticIconNames) {
    assert.match(name, /^[a-z]+(-[a-z]+)*$/, `${name} should be lowercase kebab-case`);
  }
  assert.equal(new Set(semanticIconNames).size, semanticIconNames.length);
});
