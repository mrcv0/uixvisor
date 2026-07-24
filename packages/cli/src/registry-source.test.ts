import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { loadRegistryIndex } from './registry-source.js';

async function withTempDir(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'uixvisor-source-'));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function writeItem(root: string, directoryName: string, name: string): Promise<void> {
  const directory = join(root, directoryName);
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, 'registry-item.json'),
    JSON.stringify({
      name,
      type: 'registry:component',
      version: '0.1.0',
      platforms: ['ios'],
      compatibility: {},
      dependencies: [],
      registryDependencies: [],
      files: [{ source: `${name}.tsx`, target: `components/${name}.tsx` }],
    }),
  );
}

test('rejects duplicate registry item names with both locations', async () => {
  await withTempDir(async (root) => {
    await writeItem(root, 'first', 'duplicate');
    await writeItem(root, 'second', 'duplicate');

    await assert.rejects(
      loadRegistryIndex(root),
      (error: Error) =>
        error.message.includes('Duplicate registry item name "duplicate"') &&
        error.message.includes(join(root, 'first')) &&
        error.message.includes(join(root, 'second')),
    );
  });
});

test('loads distinct registry item names', async () => {
  await withTempDir(async (root) => {
    await writeItem(root, 'first', 'alpha');
    await writeItem(root, 'second', 'beta');

    const index = await loadRegistryIndex(root);
    assert.deepEqual([...index.keys()].sort(), ['alpha', 'beta']);
  });
});
