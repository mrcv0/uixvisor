import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runList } from './list.js';

async function withTempDir(run: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'uixvisor-list-'));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function writeRegistryItem(
  registryRoot: string,
  name: string,
  title?: string,
): Promise<void> {
  const itemDir = join(registryRoot, name);
  await mkdir(itemDir, { recursive: true });
  await writeFile(join(itemDir, `${name}.tsx`), 'export {};\n');
  await writeFile(
    join(itemDir, 'registry-item.json'),
    JSON.stringify({
      name,
      type: 'registry:component',
      version: '0.1.0',
      title,
      platforms: ['ios'],
      compatibility: {},
      dependencies: [],
      registryDependencies: [],
      files: [{ source: `${name}.tsx`, target: `components/${name}.tsx` }],
    }),
  );
}

async function captureLogs(run: () => Promise<void>): Promise<string[]> {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...values: unknown[]) => logs.push(values.join(' '));
  try {
    await run();
  } finally {
    console.log = originalLog;
  }
  return logs;
}

test('lists registry items alphabetically with titles and total', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    await writeRegistryItem(registryRoot, 'zeta', 'Zeta');
    await writeRegistryItem(registryRoot, 'alpha', 'Alpha');

    const logs = await captureLogs(() => runList(registryRoot));

    assert.match(logs[0], /^alpha\s+registry:component\s+Alpha$/);
    assert.match(logs[1], /^zeta\s+registry:component\s+Zeta$/);
    assert.equal(logs[2], '\n2 item(s)');
  });
});

test('fails when the registry root does not exist', async () => {
  await withTempDir(async (dir) => {
    await assert.rejects(runList(join(dir, 'missing')), /Registry root not found/);
  });
});
