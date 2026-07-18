import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateRegistryItem } from './validate.js';

const here = dirname(fileURLToPath(import.meta.url));
const registryRoot = join(here, '..', '..', '..', 'registry');

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

async function main() {
  const itemFiles = await findRegistryItemFiles(registryRoot);

  if (itemFiles.length === 0) {
    console.error(`No registry-item.json files found under ${registryRoot}`);
    process.exitCode = 1;
    return;
  }

  let failures = 0;

  for (const filePath of itemFiles) {
    const raw = await readFile(filePath, 'utf-8');
    const result = validateRegistryItem(JSON.parse(raw));

    if (result.success) {
      console.log(`PASS  ${result.data.name}`);
    } else {
      failures += 1;
      console.error(`FAIL  ${filePath}`);
      for (const error of result.errors) {
        console.error(`      ${error.path}: ${error.message}`);
      }
    }
  }

  console.log(`\n${itemFiles.length - failures}/${itemFiles.length} registry items valid`);

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main();
