import assert from 'node:assert/strict';
import { test } from 'node:test';

import { registryItemFileSchema, registryItemSchema } from './schema.js';

test('accepts portable relative source and target paths', () => {
  const result = registryItemFileSchema.safeParse({
    source: 'button.tsx',
    target: 'components/ui/button.tsx',
  });

  assert.equal(result.success, true);
});

test('rejects parent directory traversal with either path separator', () => {
  for (const path of ['../outside.tsx', '..\\outside.tsx', 'components/../outside.tsx']) {
    const result = registryItemFileSchema.safeParse({ source: path, target: 'safe.tsx' });
    assert.equal(result.success, false);
  }
});

test('rejects absolute and drive-qualified paths', () => {
  for (const path of ['/tmp/outside.tsx', 'C:\\temp\\outside.tsx', '\\\\server\\outside.tsx']) {
    const result = registryItemFileSchema.safeParse({ source: 'safe.tsx', target: path });
    assert.equal(result.success, false);
  }
});

test('rejects ambiguous path segments and separators', () => {
  for (const path of [
    './button.tsx',
    'components//button.tsx',
    'components/./button.tsx',
    'components\\button.tsx',
  ]) {
    const result = registryItemFileSchema.safeParse({ source: path, target: 'safe.tsx' });
    assert.equal(result.success, false);
  }
});

test('rejects compatibility entries outside the known package set', () => {
  const result = registryItemSchema.safeParse({
    name: 'odd',
    type: 'registry:component',
    version: '0.1.0',
    platforms: ['ios'],
    compatibility: { 'react-native-maps': '>=1 <2' },
    dependencies: [],
    registryDependencies: [],
    files: [{ source: 'odd.tsx', target: 'components/odd.tsx' }],
  });

  assert.equal(result.success, false);
});

test('accepts compatibility entries that are in the known package set', () => {
  const result = registryItemSchema.safeParse({
    name: 'fine',
    type: 'registry:component',
    version: '0.1.0',
    platforms: ['ios'],
    compatibility: { expo: '>=57 <58', reanimated: '^4' },
    dependencies: [],
    registryDependencies: [],
    files: [{ source: 'fine.tsx', target: 'components/fine.tsx' }],
  });

  assert.equal(result.success, true);
});
