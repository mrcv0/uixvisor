#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

try {
  execFileSync('npm', ['run', 'build'], { cwd: repoRoot, stdio: 'inherit', shell: true });
} catch (error) {
  console.error(`build failed: ${error.message}`);
  process.exit(1);
}

const expected = [
  ['packages/cli', 'dist/index.js'],
  ['packages/registry', 'dist/index.js'],
  ['packages/registry-schema', 'dist/validate-registry.js'],
  ['packages/tokens', 'dist/index.js'],
  ['packages/presets', 'dist/index.js'],
  ['packages/testing', 'dist/index.js'],
];

let failed = 0;
for (const [pkg, file] of expected) {
  const target = join(repoRoot, pkg, file);
  if (!existsSync(target)) {
    console.error(`fail: missing artifact ${target}`);
    failed += 1;
  } else {
    console.log(`ok: ${pkg}/${file}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
