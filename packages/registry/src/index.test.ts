import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { LocalRegistrySource, sha256, verifySha256 } from './index.js';

async function withTempDir(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'uixvisor-registry-'));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function writeItem(root: string, directoryName: string, name: string): Promise<void> {
  const directory = join(root, directoryName);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, `${name}.tsx`), `export const ${name} = true;\n`);
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

test('loads and reads local registry items', async () => {
  await withTempDir(async (root) => {
    await writeItem(root, 'alpha', 'alpha');
    const source = new LocalRegistrySource(root);
    const index = await source.loadIndex();
    const entry = index.get('alpha');

    assert.ok(entry);
    assert.match((await source.readItemFile(entry, 'alpha.tsx')).toString('utf-8'), /alpha/);
  });
});

test('rejects duplicate item names', async () => {
  await withTempDir(async (root) => {
    await writeItem(root, 'first', 'duplicate');
    await writeItem(root, 'second', 'duplicate');

    await assert.rejects(new LocalRegistrySource(root).loadIndex(), /Duplicate registry item name/);
  });
});

test('verifies SHA-256 digests', () => {
  const digest = sha256('uixvisor');
  assert.equal(digest.length, 64);
  assert.doesNotThrow(() => verifySha256('uixvisor', digest));
  assert.throws(() => verifySha256('changed', digest), /Checksum mismatch/);
});
