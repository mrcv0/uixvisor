import 'server-only';

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { validateRegistryItem, type RegistryItem } from '@uixvisor/registry-schema';

import { resolveRegistryRoot } from './registry-path';

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function findRegistryItemFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findRegistryItemFiles(fullPath)));
    } else if (entry.name === 'registry-item.json') {
      files.push(fullPath);
    }
  }

  return files;
}

export async function getRegistryItems(): Promise<RegistryItem[]> {
  const registryRoot = resolveRegistryRoot();
  if (!(await pathExists(registryRoot))) {
    return [];
  }

  const itemFiles = await findRegistryItemFiles(registryRoot);
  const items: RegistryItem[] = [];

  for (const filePath of itemFiles) {
    const raw = await readFile(filePath, 'utf-8');
    const result = validateRegistryItem(JSON.parse(raw));
    if (result.success) {
      items.push(result.data);
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRegistryItem(name: string): Promise<RegistryItem | undefined> {
  const items = await getRegistryItems();
  return items.find((item) => item.name === name);
}
