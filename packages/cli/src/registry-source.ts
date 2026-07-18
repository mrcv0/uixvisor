import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { validateRegistryItem, type RegistryItem } from '@uixvisor/registry-schema';

export interface LoadedRegistryItem {
  item: RegistryItem;
  dir: string;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function findRegistryItemDirs(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const dirs: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = join(dir, entry.name);

    if (await pathExists(join(fullPath, 'registry-item.json'))) {
      dirs.push(fullPath);
    } else {
      dirs.push(...(await findRegistryItemDirs(fullPath)));
    }
  }

  return dirs;
}

export async function loadRegistryIndex(
  registryRoot: string,
): Promise<Map<string, LoadedRegistryItem>> {
  if (!(await pathExists(registryRoot))) {
    throw new Error(`Registry root not found: ${registryRoot}`);
  }

  const itemDirs = await findRegistryItemDirs(registryRoot);
  const index = new Map<string, LoadedRegistryItem>();

  for (const dir of itemDirs) {
    const manifestPath = join(dir, 'registry-item.json');
    const raw = await readFile(manifestPath, 'utf-8');
    const result = validateRegistryItem(JSON.parse(raw));

    if (!result.success) {
      const details = result.errors.map((error) => `${error.path}: ${error.message}`).join('; ');
      throw new Error(`Invalid registry item at ${manifestPath}: ${details}`);
    }

    index.set(result.data.name, { item: result.data, dir });
  }

  return index;
}
