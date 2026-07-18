import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { loadRegistryIndex } from '../registry-source.js';
import { rewriteRegistryImports } from '../rewrite-imports.js';
import { diffLines } from '../diff.js';

export interface DiffOptions {
  registryRoot: string;
  targetRoot: string;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function runDiff(names: string[], options: DiffOptions): Promise<boolean> {
  const index = await loadRegistryIndex(options.registryRoot);

  const dependencyTargets: Record<string, string> = {};
  for (const entry of index.values()) {
    if (entry.item.files[0]) {
      dependencyTargets[entry.item.name] = entry.item.files[0].target;
    }
  }

  let hasDifferences = false;

  for (const name of names) {
    const entry = index.get(name);
    if (!entry) {
      throw new Error(`Unknown registry item "${name}"`);
    }

    for (const file of entry.item.files) {
      const sourcePath = join(entry.dir, file.source);
      const targetPath = resolve(options.targetRoot, file.target);

      const source = await readFile(sourcePath, 'utf-8');
      const expected = rewriteRegistryImports(source, file.target, dependencyTargets);

      if (!(await pathExists(targetPath))) {
        console.log(`${file.target}: not present locally (would be added)`);
        hasDifferences = true;
        continue;
      }

      const local = await readFile(targetPath, 'utf-8');

      if (local === expected) {
        console.log(`${file.target}: unchanged`);
        continue;
      }

      hasDifferences = true;
      console.log(`${file.target}:`);
      for (const line of diffLines(local, expected)) {
        const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';
        console.log(`  ${prefix} ${line.text}`);
      }
    }
  }

  return hasDifferences;
}
