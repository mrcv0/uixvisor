import { copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import { loadRegistryIndex } from '../registry-source.js';
import { resolveDependencyOrder } from '../resolve-dependencies.js';

export interface AddOptions {
  registryRoot: string;
  targetRoot: string;
  force: boolean;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function runAdd(names: string[], options: AddOptions): Promise<void> {
  const index = await loadRegistryIndex(options.registryRoot);

  const order = resolveDependencyOrder(names, (name) => {
    const entry = index.get(name);
    return entry ? { name, registryDependencies: entry.item.registryDependencies } : undefined;
  });

  console.log(`Resolved ${order.length} item(s): ${order.join(', ')}`);

  let written = 0;
  let skipped = 0;

  for (const name of order) {
    const entry = index.get(name);
    if (!entry) {
      continue;
    }

    for (const file of entry.item.files) {
      const sourcePath = join(entry.dir, file.source);
      const targetPath = resolve(options.targetRoot, file.target);

      if (!options.force && (await pathExists(targetPath))) {
        console.log(`  skip   ${file.target} (already exists, use --force to overwrite)`);
        skipped += 1;
        continue;
      }

      await mkdir(dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
      console.log(`  write  ${file.target}`);
      written += 1;
    }
  }

  console.log(`\n${written} file(s) written, ${skipped} skipped`);
}
