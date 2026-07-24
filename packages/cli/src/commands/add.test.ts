import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';

import { resolveFileWithinRoot } from './add.js';

test('resolves a nested file within the root', () => {
  const root = resolve('project');

  assert.equal(
    resolveFileWithinRoot(root, 'components/ui/button.tsx', 'target'),
    resolve(root, 'components/ui/button.tsx'),
  );
});

test('rejects a path that traverses above the root', () => {
  const root = resolve('project');

  for (const path of ['../outside.tsx', '..\\outside.tsx']) {
    assert.throws(() => resolveFileWithinRoot(root, path, 'target'), /Invalid target path/);
  }
});

test('rejects an absolute path outside the root', () => {
  const root = resolve('project');
  const outside = resolve(root, '..', 'outside.tsx');

  assert.throws(() => resolveFileWithinRoot(root, outside, 'source'), /Invalid source path/);
});

test('rejects the root itself as a file path', () => {
  const root = resolve('project');

  assert.throws(() => resolveFileWithinRoot(root, '.', 'target'), /Invalid target path/);
});
