import { loadRegistryIndex } from '../registry-source.js';

export async function runList(registryRoot: string): Promise<void> {
  const index = await loadRegistryIndex(registryRoot);
  const items = [...index.values()]
    .map((entry) => entry.item)
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const item of items) {
    console.log(`${item.name.padEnd(16)} ${item.type.padEnd(20)} ${item.title ?? ''}`);
  }

  console.log(`\n${items.length} item(s)`);
}
