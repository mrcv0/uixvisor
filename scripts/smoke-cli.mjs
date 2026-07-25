#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cliEntry = resolve(here, '..', 'packages', 'cli', 'dist', 'index.js');
const repoRoot = resolve(here, '..');

const work = mkdtempSync(join(tmpdir(), 'uixvisor-smoke-'));

function run(args, options = {}) {
  try {
    return {
      stdout: execFileSync('node', [cliEntry, ...args], {
        cwd: options.cwd ?? work,
        encoding: 'utf-8',
      }),
      stderr: '',
    };
  } catch (error) {
    return { stdout: error.stdout?.toString() ?? '', stderr: error.stderr?.toString() ?? '' };
  }
}

const checks = [
  {
    name: 'list --help',
    args: ['list', '--help'],
  },
  {
    name: 'add --help',
    args: ['add', '--help'],
  },
  {
    name: 'diff --help',
    args: ['diff', '--help'],
  },
  {
    name: 'doctor --help',
    args: ['doctor', '--help'],
  },
];

let failed = 0;
for (const check of checks) {
  const result = run(check.args);
  const combined = `${result.stdout}${result.stderr}`.toLowerCase();
  if (!combined.includes('usage')) {
    failed += 1;
    console.error(`fail ${check.name}: missing 'usage' in output`);
  } else {
    console.log(`ok ${check.name}`);
  }
}

try {
  const versionResult = run(['--version']);
  const version = `${versionResult.stdout}${versionResult.stderr}`.trim();
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`version is not semver: ${version}`);
  }
  console.log('ok --version');
} catch (error) {
  failed += 1;
  console.error(`fail --version: ${error.message}`);
}

try {
  const listResult = run(['list', '--registry', join(repoRoot, 'registry')]);
  if (!`${listResult.stdout}${listResult.stderr}`.includes('button')) {
    throw new Error('list did not include button');
  }
  console.log('ok list (local registry)');
} catch (error) {
  failed += 1;
  console.error(`fail list (local registry): ${error.message}`);
}

try {
  const doctorResult = run(['doctor', '--registry', join(repoRoot, 'registry')]);
  const combined = `${doctorResult.stdout}${doctorResult.stderr}`;
  if (!/Registry:\s*\d+ item\(s\) loaded/.test(combined)) {
    throw new Error(`doctor did not report registry status: ${combined.slice(0, 200)}`);
  }
  console.log('ok doctor (local registry)');
} catch (error) {
  failed += 1;
  console.error(`fail doctor (local registry): ${error.message}`);
}

rmSync(work, { recursive: true, force: true });

if (failed > 0) {
  process.exit(1);
}
