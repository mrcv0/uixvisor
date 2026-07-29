import { createHash, timingSafeEqual } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { validateRegistryItem, type RegistryItem } from '@uixvisor/registry-schema';

import { resolveFileWithinRealRoot } from './path-safety.js';

export {
  HostedRegistrySource,
  RegistryIntegrityError,
  RegistryNetworkError,
  RegistrySecurityError,
  type HostedRegistryIndex,
  type HostedRegistryItem,
  type HostedRegistryOptions,
} from './hosted.js';
export { resolveFileWithinRealRoot, resolveFileWithinRoot } from './path-safety.js';

export interface RegistryEntry {
  item: RegistryItem;
  directory: string;
}

export type RegistryIndex = Map<string, RegistryEntry>;

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function findItemDirectories(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const directories: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const child = join(directory, entry.name);
    if (await pathExists(join(child, 'registry-item.json'))) {
      directories.push(child);
    } else {
      directories.push(...(await findItemDirectories(child)));
    }
  }

  return directories;
}

export class LocalRegistrySource {
  readonly root: string;

  constructor(root: string) {
    this.root = resolve(root);
  }

  async loadIndex(): Promise<RegistryIndex> {
    if (!(await pathExists(this.root))) {
      throw new Error(`Registry root not found: ${this.root}`);
    }

    const index: RegistryIndex = new Map();
    for (const directory of await findItemDirectories(this.root)) {
      const manifestPath = join(directory, 'registry-item.json');
      const result = validateRegistryItem(JSON.parse(await readFile(manifestPath, 'utf-8')));
      if (!result.success) {
        const details = result.errors.map((error) => `${error.path}: ${error.message}`).join('; ');
        throw new Error(`Invalid registry item at ${manifestPath}: ${details}`);
      }
      const existing = index.get(result.data.name);
      if (existing) {
        throw new Error(
          `Duplicate registry item name "${result.data.name}" at ${existing.directory} and ${directory}`,
        );
      }
      index.set(result.data.name, { item: result.data, directory });
    }

    return index;
  }

  async readItemFile(entry: RegistryEntry, source: string): Promise<Buffer> {
    return readFile(await resolveFileWithinRealRoot(entry.directory, source, 'source'));
  }
}

export function sha256(input: string | Buffer | Uint8Array): string {
  return createHash('sha256').update(input).digest('hex');
}

export function verifySha256(input: string | Buffer | Uint8Array, expected: string): void {
  if (!/^[a-f0-9]{64}$/i.test(expected)) {
    throw new Error('Expected checksum must be a 64-character SHA-256 digest');
  }
  const actualBuffer = Buffer.from(sha256(input), 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error(`Checksum mismatch: expected ${expected}, received ${actualBuffer.toString('hex')}`);
  }
}
