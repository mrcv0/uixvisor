import { test } from 'node:test';
import assert from 'node:assert/strict';

import { resolveDependencyOrder, type DependencyGraphNode } from './resolve-dependencies.js';

function graph(nodes: Record<string, string[]>) {
  const map = new Map<string, DependencyGraphNode>(
    Object.entries(nodes).map(([name, registryDependencies]) => [
      name,
      { name, registryDependencies },
    ]),
  );
  return (name: string) => map.get(name);
}

test('resolves a simple dependency chain, dependencies before dependents', () => {
  const getNode = graph({
    'otp-input': ['input', 'text'],
    input: [],
    text: [],
  });

  const order = resolveDependencyOrder(['otp-input'], getNode);

  assert.deepEqual(order, ['input', 'text', 'otp-input']);
});

test('deduplicates a diamond dependency without visiting it twice', () => {
  const getNode = graph({
    'phone-auth-flow': ['otp-input', 'input'],
    'otp-input': ['input'],
    input: [],
  });

  const order = resolveDependencyOrder(['phone-auth-flow'], getNode);

  assert.deepEqual(order, ['input', 'otp-input', 'phone-auth-flow']);
});

test('throws a clear error on a circular dependency', () => {
  const getNode = graph({
    a: ['b'],
    b: ['a'],
  });

  assert.throws(() => resolveDependencyOrder(['a'], getNode), /Circular registryDependencies/);
});

test('throws a clear error on an unknown registry item', () => {
  const getNode = graph({
    a: ['ghost'],
  });

  assert.throws(() => resolveDependencyOrder(['a'], getNode), /Unknown registry item "ghost"/);
});
