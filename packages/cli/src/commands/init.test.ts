import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInit } from './init.js';

async function withTempDir(run: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'uixvisor-init-'));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function withoutConsole(run: () => Promise<void>): Promise<void> {
  const originalLog = console.log;
  const originalWarn = console.warn;
  console.log = () => {};
  console.warn = () => {};
  try {
    await run();
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
  }
}

test('creates a config for a detected Expo project', async () => {
  await withTempDir(async (dir) => {
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ dependencies: { expo: '~57.0.7', nativewind: '^4.2.6' } }),
    );

    await withoutConsole(() =>
      runInit({ projectRoot: dir, registry: '../registry', force: false }),
    );

    const config = JSON.parse(await readFile(join(dir, 'uixvisor.config.json'), 'utf-8'));
    assert.deepEqual(config, {
      $schema: 'https://uixvisor.dev/schema/config.json',
      registry: '../registry',
    });
  });
});

test('preserves an existing config without force', async () => {
  await withTempDir(async (dir) => {
    const configPath = join(dir, 'uixvisor.config.json');
    await writeFile(configPath, '{"registry":"original"}\n');

    await withoutConsole(async () => {
      await assert.rejects(
        runInit({ projectRoot: dir, registry: 'replacement', force: false }),
        /already exists/,
      );
    });

    assert.equal(await readFile(configPath, 'utf-8'), '{"registry":"original"}\n');
  });
});

test('overwrites an existing config with force', async () => {
  await withTempDir(async (dir) => {
    const configPath = join(dir, 'uixvisor.config.json');
    await writeFile(configPath, '{"registry":"original"}\n');

    await withoutConsole(() =>
      runInit({ projectRoot: dir, registry: 'replacement', force: true }),
    );

    const config = JSON.parse(await readFile(configPath, 'utf-8'));
    assert.equal(config.registry, 'replacement');
  });
});
