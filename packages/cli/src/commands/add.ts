import { mkdir, readFile, rm, rmdir, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { loadRegistryIndex } from '../registry-source.js';
import { resolveDependencyOrder } from '../resolve-dependencies.js';
import { buildRegistryImportTargets, rewriteRegistryImports } from '../rewrite-imports.js';
import {
  collectNpmDependencies,
  formatNpmDependencyReport,
} from '../registry-dependencies.js';
import { resolveFileWithinRoot } from '../path-safety.js';

export { resolveFileWithinRoot } from '../path-safety.js';

export interface AddOptions {
  registryRoot: string;
  targetRoot: string;
  force: boolean;
  writeTarget?: (path: string, content: string) => Promise<void>;
}

interface PlannedWriteBase {
  displayPath: string;
  targetPath: string;
  content: string;
  missingDirectories: string[];
}

interface PlannedNewWrite extends PlannedWriteBase {
  existed: false;
  previousContent?: never;
}

interface PlannedOverwrite extends PlannedWriteBase {
  existed: true;
  previousContent: Buffer;
}

type PlannedWrite = PlannedNewWrite | PlannedOverwrite;

async function pathStats(path: string) {
  try {
    return await stat(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function findMissingDirectories(root: string, targetPath: string): Promise<string[]> {
  const resolvedRoot = resolve(root);
  const missing: string[] = [];
  let current = dirname(targetPath);

  while (current !== resolvedRoot) {
    const currentStats = await pathStats(current);
    if (currentStats) {
      if (!currentStats.isDirectory()) {
        throw new Error(`Target parent is not a directory: ${current}`);
      }
      break;
    }

    missing.push(current);
    current = dirname(current);
  }

  return missing;
}

async function rollbackWrites(
  applied: PlannedWrite[],
  createdDirectories: Set<string>,
): Promise<unknown[]> {
  const errors: unknown[] = [];

  for (const planned of [...applied].reverse()) {
    try {
      if (planned.existed) {
        await writeFile(planned.targetPath, planned.previousContent);
      } else {
        await rm(planned.targetPath, { force: true });
      }
    } catch (error) {
      errors.push(error);
    }
  }

  const directories = [...createdDirectories].sort((a, b) => b.length - a.length);
  for (const directory of directories) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await rmdir(directory);
        break;
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === 'ENOENT' || code === 'ENOTEMPTY' || code === 'EEXIST') {
          break;
        }
        if ((code === 'EACCES' || code === 'EBUSY') && attempt < 2) {
          await delay(10 * (attempt + 1));
          continue;
        }
        errors.push(error);
        break;
      }
    }
  }

  return errors;
}

export async function runAdd(names: string[], options: AddOptions): Promise<void> {
  const index = await loadRegistryIndex(options.registryRoot);
  const targetRoot = resolve(options.targetRoot);
  const targetRootStats = await pathStats(targetRoot);

  if (!targetRootStats?.isDirectory()) {
    throw new Error(`Target root is not a directory: ${targetRoot}`);
  }

  const order = resolveDependencyOrder(names, (name) => {
    const entry = index.get(name);
    return entry ? { name, registryDependencies: entry.item.registryDependencies } : undefined;
  });

  console.log(`Resolved ${order.length} item(s): ${order.join(', ')}`);

  const selectedItems = order.flatMap((name) => {
    const entry = index.get(name);
    return entry ? [entry.item] : [];
  });
  const dependencyTargets = buildRegistryImportTargets(selectedItems);
  const npmDependencies = collectNpmDependencies(selectedItems);

  const plannedWrites: PlannedWrite[] = [];
  const skippedTargets: string[] = [];
  const seenTargets = new Set<string>();

  for (const name of order) {
    const entry = index.get(name);
    if (!entry) {
      continue;
    }

    for (const file of entry.item.files) {
      const sourcePath = resolveFileWithinRoot(entry.dir, file.source, 'source');
      const targetPath = resolveFileWithinRoot(targetRoot, file.target, 'target');
      const targetKey = process.platform === 'win32' ? targetPath.toLowerCase() : targetPath;

      if (seenTargets.has(targetKey)) {
        throw new Error(`Multiple registry files target the same path: ${file.target}`);
      }
      seenTargets.add(targetKey);

      const targetStats = await pathStats(targetPath);
      if (targetStats && !targetStats.isFile()) {
        throw new Error(`Target path is not a file: ${targetPath}`);
      }

      if (!options.force && targetStats) {
        skippedTargets.push(file.target);
        continue;
      }

      const source = await readFile(sourcePath, 'utf-8');
      const content = rewriteRegistryImports(source, file.target, dependencyTargets);
      const missingDirectories = await findMissingDirectories(targetRoot, targetPath);
      const planned = {
        displayPath: file.target,
        targetPath,
        content,
        missingDirectories,
      };

      if (targetStats) {
        plannedWrites.push({
          ...planned,
          existed: true,
          previousContent: await readFile(targetPath),
        });
      } else {
        plannedWrites.push({ ...planned, existed: false });
      }
    }
  }

  const applied: PlannedWrite[] = [];
  const createdDirectories = new Set<string>();
  const writeTarget =
    options.writeTarget ??
    ((path: string, content: string) => writeFile(path, content, 'utf-8'));

  try {
    for (const planned of plannedWrites) {
      for (const directory of planned.missingDirectories) {
        createdDirectories.add(directory);
      }

      await mkdir(dirname(planned.targetPath), { recursive: true });
      applied.push(planned);
      await writeTarget(planned.targetPath, planned.content);
    }
  } catch (error) {
    const rollbackErrors = await rollbackWrites(applied, createdDirectories);
    if (rollbackErrors.length > 0) {
      throw new Error(
        `Add failed: ${errorMessage(error)}. Rollback failed: ${rollbackErrors.map(errorMessage).join('; ')}`,
      );
    }
    throw error;
  }

  for (const target of skippedTargets) {
    console.log(`  skip   ${target} (already exists, use --force to overwrite)`);
  }
  for (const planned of plannedWrites) {
    console.log(`  write  ${planned.displayPath}`);
  }

  console.log(`\n${plannedWrites.length} file(s) written, ${skippedTargets.length} skipped`);

  for (const line of formatNpmDependencyReport(npmDependencies)) {
    console.log(line);
  }
}
