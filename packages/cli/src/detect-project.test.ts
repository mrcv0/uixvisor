import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { detectProject } from './detect-project.js';

async function withTempDir(run: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'uixvisor-detect-'));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('detects an Expo + NativeWind project with Expo Router and npm', async () => {
  await withTempDir(async (dir) => {
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({
        dependencies: { expo: '~57.0.6', nativewind: '^4.2.6', 'expo-router': '~7.0.0' },
      }),
    );
    await writeFile(join(dir, 'package-lock.json'), '{}');

    const result = await detectProject(dir);

    assert.equal(result.isExpo, true);
    assert.equal(result.expoVersion, '~57.0.6');
    assert.equal(result.nativewindVersion, '^4.2.6');
    assert.equal(result.hasExpoRouter, true);
    assert.equal(result.packageManager, 'npm');
  });
});

test('detects pnpm via lockfile and missing Expo/NativeWind as undefined', async () => {
  await withTempDir(async (dir) => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ dependencies: {} }));
    await writeFile(join(dir, 'pnpm-lock.yaml'), '');

    const result = await detectProject(dir);

    assert.equal(result.isExpo, false);
    assert.equal(result.expoVersion, undefined);
    assert.equal(result.nativewindVersion, undefined);
    assert.equal(result.hasExpoRouter, false);
    assert.equal(result.packageManager, 'pnpm');
  });
});

test('prefers the declared packageManager field over lockfiles', async () => {
  await withTempDir(async (dir) => {
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ packageManager: 'bun@1.1.0', dependencies: {} }),
    );
    await writeFile(join(dir, 'package-lock.json'), '{}');

    const result = await detectProject(dir);

    assert.equal(result.packageManager, 'bun');
  });
});

test('detects Expo Router via an app/ directory even without the dependency', async () => {
  await withTempDir(async (dir) => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ dependencies: { expo: '~57.0.6' } }));
    await mkdir(join(dir, 'app'));

    const result = await detectProject(dir);

    assert.equal(result.hasExpoRouter, true);
  });
});
