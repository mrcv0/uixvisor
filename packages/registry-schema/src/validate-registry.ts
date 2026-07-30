import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateRegistryItem } from './validate.js';
import { DEFAULT_UIXVISOR_URLS } from './urls.js';

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

/**
 * Cross-item imports use the `@registry/<item>/<file>` alias, so the imports a
 * source file actually makes are the ground truth for `registryDependencies`.
 * A stale declaration is invisible in the repo (the alias still resolves) but
 * breaks `uixvisor add`, which copies only the declared dependencies.
 */
function referencedItems(source: string): Set<string> {
  const names = new Set<string>();
  for (const [, name] of source.matchAll(/from\s+'@registry\/([^/']+)\//g)) {
    names.add(name);
  }
  return names;
}

async function checkDeclaredDependencies(
  itemPath: string,
  item: { name: string; registryDependencies: string[]; files: { source: string }[] },
): Promise<string[]> {
  const problems: string[] = [];
  const imported = new Set<string>();

  for (const file of item.files) {
    const source = await readFile(join(dirname(itemPath), file.source), 'utf-8');
    for (const name of referencedItems(source)) {
      imported.add(name);
    }
  }

  // Items may reference their own sibling files; that is not a dependency.
  imported.delete(item.name);

  const declared = new Set(item.registryDependencies.map((dep) => dep.split('/').pop() ?? dep));

  for (const name of imported) {
    if (!declared.has(name)) {
      problems.push(`imports @registry/${name} but does not declare it in registryDependencies`);
    }
  }
  for (const name of declared) {
    if (!imported.has(name)) {
      problems.push(`declares registryDependency "${name}" but never imports it`);
    }
  }

  return problems;
}

async function checkPublicUrlContract(
  itemPath: string,
  item: { name: string; $schema?: string; files: { source: string }[] },
): Promise<string[]> {
  const problems: string[] = [];

  if (item.$schema !== DEFAULT_UIXVISOR_URLS.registryItemSchemaUrl) {
    problems.push(
      `uses schema "${item.$schema ?? 'missing'}"; expected "${DEFAULT_UIXVISOR_URLS.registryItemSchemaUrl}"`,
    );
  }

  const relativeDirectory = relative(registryRoot, dirname(itemPath));
  const [category] = relativeDirectory.split(sep);
  const expectedAttribution =
    `// UIXVISOR — ${DEFAULT_UIXVISOR_URLS.siteUrl}/${category}/${item.name}`;

  for (const file of item.files) {
    const source = await readFile(join(dirname(itemPath), file.source), 'utf-8');
    const [firstLine] = source.split(/\r?\n/, 1);
    if (firstLine !== expectedAttribution) {
      problems.push(
        `${file.source} must start with the canonical source note "${expectedAttribution}"`,
      );
    }
  }

  return problems;
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

    if (!result.success) {
      failures += 1;
      console.error(`FAIL  ${filePath}`);
      for (const error of result.errors) {
        console.error(`      ${error.path}: ${error.message}`);
      }
      continue;
    }

    const problems = [
      ...(await checkDeclaredDependencies(filePath, result.data)),
      ...(await checkPublicUrlContract(filePath, result.data)),
    ];
    if (problems.length > 0) {
      failures += 1;
      console.error(`FAIL  ${result.data.name}`);
      for (const problem of problems) {
        console.error(`      ${problem}`);
      }
    } else {
      console.log(`PASS  ${result.data.name}`);
    }
  }

  console.log(`\n${itemFiles.length - failures}/${itemFiles.length} registry items valid`);

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main();
