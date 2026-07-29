import assert from 'node:assert/strict';
import { test } from 'node:test';
import { access, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { resolveFileWithinRoot, runAdd } from './add.js';

interface FixtureFile {
  source: string;
  target: string;
  content?: string;
}

async function withTempDir(run: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'uixvisor-add-'));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function withoutConsole(run: () => Promise<void>): Promise<void> {
  const originalLog = console.log;
  console.log = () => {};
  try {
    await run();
  } finally {
    console.log = originalLog;
  }
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

async function writeRegistryItem(
  registryRoot: string,
  name: string,
  files: FixtureFile[],
  registryDependencies: string[] = [],
  dependencies: string[] = [],
): Promise<void> {
  const itemDir = join(registryRoot, name);
  await mkdir(itemDir, { recursive: true });
  await writeFile(
    join(itemDir, 'registry-item.json'),
    JSON.stringify({
      name,
      type: 'registry:component',
      version: '0.1.0',
      platforms: ['ios', 'android'],
      compatibility: {},
      dependencies,
      registryDependencies,
      files: files.map(({ source, target }) => ({ source, target })),
    }),
  );

  for (const file of files) {
    if (file.content !== undefined) {
      await writeFile(join(itemDir, file.source), file.content);
    }
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

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

test('rejects a target path whose linked parent escapes the project root', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    const targetRoot = join(dir, 'project');
    const outsideRoot = join(dir, 'outside');
    await mkdir(targetRoot);
    await mkdir(outsideRoot);
    await symlink(
      outsideRoot,
      join(targetRoot, 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    await writeRegistryItem(registryRoot, 'button', [
      { source: 'button.tsx', target: 'linked/button.tsx', content: 'export const Button = 1;\n' },
    ]);

    await assert.rejects(
      withoutConsole(() =>
        runAdd(['button'], {
          registryRoot,
          targetRoot,
          force: true,
        }),
      ),
      /resolved path escapes the real root/,
    );
    assert.equal(await pathExists(join(outsideRoot, 'button.tsx')), false);
  });
});

test('adds dependencies and rewrites registry imports', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    const targetRoot = join(dir, 'project');
    await mkdir(targetRoot);
    await writeRegistryItem(registryRoot, 'text', [
      { source: 'text.tsx', target: 'components/ui/text.tsx', content: 'export const Text = 1;\n' },
    ]);
    await writeRegistryItem(
      registryRoot,
      'field',
      [
        {
          source: 'field.tsx',
          target: 'components/ui/field.tsx',
          content: "import { Text } from '@registry/text/text';\nexport const Field = Text;\n",
        },
      ],
      ['text'],
    );

    await withoutConsole(() =>
      runAdd(['field'], { registryRoot, targetRoot, force: false }),
    );

    assert.equal(
      await readFile(join(targetRoot, 'components/ui/text.tsx'), 'utf-8'),
      'export const Text = 1;\n',
    );
    assert.equal(
      await readFile(join(targetRoot, 'components/ui/field.tsx'), 'utf-8'),
      "import { Text } from './text';\nexport const Field = Text;\n",
    );
  });
});

test('does not write any target when preflight validation fails', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    const targetRoot = join(dir, 'project');
    await mkdir(targetRoot);
    await writeRegistryItem(registryRoot, 'broken', [
      { source: 'broken.tsx', target: 'generated/first.tsx', content: 'first\n' },
      { source: 'missing.tsx', target: 'generated/second.tsx' },
    ]);

    await withoutConsole(async () => {
      await assert.rejects(
        runAdd(['broken'], { registryRoot, targetRoot, force: false }),
        /missing\.tsx/,
      );
    });

    assert.equal(await pathExists(join(targetRoot, 'generated/first.tsx')), false);
    assert.equal(await pathExists(join(targetRoot, 'generated/second.tsx')), false);
  });
});

test('restores overwritten files and removes new files when a write fails', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    const targetRoot = join(dir, 'project');
    await mkdir(targetRoot);
    await writeFile(join(targetRoot, 'existing.tsx'), 'original\n');
    await writeRegistryItem(registryRoot, 'transaction', [
      { source: 'transaction.tsx', target: 'existing.tsx', content: 'replacement\n' },
      { source: 'helper.tsx', target: 'generated/helper.tsx', content: 'new\n' },
    ]);

    let writes = 0;
    await withoutConsole(async () => {
      await assert.rejects(
        runAdd(['transaction'], {
          registryRoot,
          targetRoot,
          force: true,
          writeTarget: async (path, content) => {
            writes += 1;
            if (writes === 2) {
              throw new Error('simulated write failure');
            }
            await writeFile(path, content, 'utf-8');
          },
        }),
        /simulated write failure/,
      );
    });

    assert.equal(await readFile(join(targetRoot, 'existing.tsx'), 'utf-8'), 'original\n');
    assert.equal(await pathExists(join(targetRoot, 'generated/helper.tsx')), false);
    assert.equal(await pathExists(join(targetRoot, 'generated')), false);
  });
});

test('keeps existing targets unchanged without force', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    const targetRoot = join(dir, 'project');
    await mkdir(targetRoot);
    await writeFile(join(targetRoot, 'existing.tsx'), 'original\n');
    await writeRegistryItem(registryRoot, 'existing', [
      { source: 'existing.tsx', target: 'existing.tsx', content: 'replacement\n' },
    ]);

    let wrote = false;
    await withoutConsole(() =>
      runAdd(['existing'], {
        registryRoot,
        targetRoot,
        force: false,
        writeTarget: async (path, content) => {
          wrote = true;
          await writeFile(path, content, 'utf-8');
        },
      }),
    );

    assert.equal(wrote, false);
    assert.equal(await readFile(join(targetRoot, 'existing.tsx'), 'utf-8'), 'original\n');
  });
});

test('reports npm dependencies with an Expo install command', async () => {
  await withTempDir(async (dir) => {
    const registryRoot = join(dir, 'registry');
    const targetRoot = join(dir, 'project');
    await mkdir(targetRoot);
    await writeRegistryItem(
      registryRoot,
      'gesture-item',
      [
        {
          source: 'gesture-item.tsx',
          target: 'components/gesture-item.tsx',
          content: 'export const gestureItem = true;\n',
        },
      ],
      [],
      ['react-native-gesture-handler'],
    );

    const logs = await captureLogs(() =>
      runAdd(['gesture-item'], { registryRoot, targetRoot, force: false }),
    );

    assert.ok(logs.includes('Required npm dependencies:'));
    assert.ok(logs.includes('Run: npx expo install react-native-gesture-handler'));
  });
});
