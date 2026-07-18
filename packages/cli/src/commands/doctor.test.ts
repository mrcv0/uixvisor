import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runDoctor } from './doctor.js';

const here = dirname(fileURLToPath(import.meta.url));
const registryRoot = join(here, '..', '..', '..', '..', 'registry');

async function withTempDir(run: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'uixvisor-doctor-'));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function writeInstalled(dir: string, name: string, version: string): Promise<void> {
  await mkdir(join(dir, 'node_modules', name), { recursive: true });
  await writeFile(join(dir, 'node_modules', name, 'package.json'), JSON.stringify({ version }));
}

test('reports pass for a well-formed Expo + NativeWind project against the real registry', async () => {
  await withTempDir(async (dir) => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ dependencies: {} }));
    await writeInstalled(dir, 'expo', '57.0.6');
    await writeInstalled(dir, 'nativewind', '4.2.6');

    const checks = await runDoctor({ projectRoot: dir, registryRoot });
    const byName = Object.fromEntries(checks.map((check) => [check.name, check]));

    assert.equal(byName['Expo project'].status, 'pass');
    assert.equal(byName.NativeWind.status, 'pass');
    assert.equal(byName.Registry.status, 'pass');
    assert.equal(byName['Expo compatibility'].status, 'pass');
  });
});

test('fails the Expo project check when there is no expo dependency', async () => {
  await withTempDir(async (dir) => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ dependencies: {} }));

    const checks = await runDoctor({ projectRoot: dir, registryRoot });
    const byName = Object.fromEntries(checks.map((check) => [check.name, check]));

    assert.equal(byName['Expo project'].status, 'fail');
  });
});

test('warns about Expo compatibility for an out-of-range Expo version', async () => {
  await withTempDir(async (dir) => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ dependencies: {} }));
    await writeInstalled(dir, 'expo', '40.0.0');

    const checks = await runDoctor({ projectRoot: dir, registryRoot });
    const byName = Object.fromEntries(checks.map((check) => [check.name, check]));

    assert.equal(byName['Expo compatibility'].status, 'warn');
  });
});

test('fails the Registry check when the registry root does not exist', async () => {
  await withTempDir(async (dir) => {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ dependencies: { expo: '~57.0.6' } }));

    const checks = await runDoctor({
      projectRoot: dir,
      registryRoot: join(dir, 'does-not-exist'),
    });
    const byName = Object.fromEntries(checks.map((check) => [check.name, check]));

    assert.equal(byName.Registry.status, 'fail');
  });
});
