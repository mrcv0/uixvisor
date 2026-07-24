import assert from 'node:assert/strict';
import { test } from 'node:test';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveRegistryRoot } from './registry-path.js';

const expectedRegistryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'registry',
);

test('resolves the repository registry independently of cwd', () => {
  const originalCwd = process.cwd();
  process.chdir(tmpdir());
  try {
    assert.equal(resolveRegistryRoot({}), expectedRegistryRoot);
  } finally {
    process.chdir(originalCwd);
  }
});

test('prefers an explicit registry root', () => {
  const configured = resolve('custom-registry');
  assert.equal(resolveRegistryRoot({ UIXVISOR_REGISTRY_ROOT: configured }), configured);
});
