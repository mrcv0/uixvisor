import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

import { loadRegistryIndex } from '../registry-source.js';
import { resolveDependencyOrder } from '../resolve-dependencies.js';
import { rewriteRegistryImports } from '../rewrite-imports.js';

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

export function resolveFileWithinRoot(root: string, filePath: string, field: string): string {
  const resolvedRoot = resolve(root);
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const resolvedPath = resolve(resolvedRoot, normalizedFilePath);
  const pathFromRoot = relative(resolvedRoot, resolvedPath);
  const hasAbsolutePrefix =
    normalizedFilePath.startsWith('/') || /^[a-zA-Z]:/.test(normalizedFilePath);
  const escapesRoot =
    pathFromRoot === '..' || pathFromRoot.startsWith(`..${sep}`) || isAbsolute(pathFromRoot);

  if (pathFromRoot === '' || hasAbsolutePrefix || escapesRoot) {
    throw new Error(
      `Invalid ${field} path "${filePath}": must be a relative file path within ${resolvedRoot}`,
    );
  }

  return resolvedPath;
}

export async function runAdd(names: string[], options: AddOptions): Promise<void> {
  const index = await loadRegistryIndex(options.registryRoot);

  const order = resolveDependencyOrder(names, (name) => {
    const entry = index.get(name);
    return entry ? { name, registryDependencies: entry.item.registryDependencies } : undefined;
  });

  console.log(`Resolved ${order.length} item(s): ${order.join(', ')}`);

  const dependencyTargets: Record<string, string> = {};
  for (const name of order) {
    const entry = index.get(name);
    if (entry && entry.item.files[0]) {
      dependencyTargets[name] = entry.item.files[0].target;
    }
  }

  let written = 0;
  let skipped = 0;

  for (const name of order) {
    const entry = index.get(name);
    if (!entry) {
      continue;
    }

    for (const file of entry.item.files) {
      const sourcePath = resolveFileWithinRoot(entry.dir, file.source, 'source');
      const targetPath = resolveFileWithinRoot(options.targetRoot, file.target, 'target');

      if (!options.force && (await pathExists(targetPath))) {
        console.log(`  skip   ${file.target} (already exists, use --force to overwrite)`);
        skipped += 1;
        continue;
      }

      const source = await readFile(sourcePath, 'utf-8');
      const content = rewriteRegistryImports(source, file.target, dependencyTargets);

      await mkdir(dirname(targetPath), { recursive: true });
      await writeFile(targetPath, content, 'utf-8');
      console.log(`  write  ${file.target}`);
      written += 1;
    }
  }

  console.log(`\n${written} file(s) written, ${skipped} skipped`);
}
