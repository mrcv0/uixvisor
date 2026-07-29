import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';

import { validateRegistryItem } from '@uixvisor/registry-schema';

import { LocalRegistrySource, type RegistryIndex, sha256, verifySha256 } from './index.js';

export interface HostedRegistryItem {
  name: string;
  manifest: string;
  integrity: string;
  files: Record<string, string>;
}

export interface HostedRegistryIndex {
  version: 1;
  items: HostedRegistryItem[];
}

export interface HostedRegistryOptions {
  baseUrl: string;
  cacheDirectory?: string;
  timeoutMs?: number;
  maximumFileBytes?: number;
  allowInsecureHttp?: boolean;
  fetchImpl?: typeof fetch;
  cacheVersion?: string;
  offline?: boolean;
}

export class RegistryNetworkError extends Error {}
export class RegistryIntegrityError extends Error {}
export class RegistrySecurityError extends Error {}

function defaultCacheDirectory(): string {
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return join(process.env.LOCALAPPDATA, 'uixvisor', 'cache');
  }
  if (process.env.XDG_CACHE_HOME) {
    return join(process.env.XDG_CACHE_HOME, 'uixvisor');
  }
  return join(homedir(), '.cache', 'uixvisor');
}

function safeRelativePath(path: string, label: string): string {
  const normalized = path.replace(/\\/g, '/');
  const segments = normalized.split('/');
  if (
    normalized.startsWith('/') ||
    /^[a-zA-Z]:/.test(normalized) ||
    path.includes('\\') ||
    segments.some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new RegistrySecurityError(`Unsafe ${label} path: ${path}`);
  }
  return normalized;
}

function parseChecksum(value: string): string {
  const digest = value.trim().split(/\s+/)[0] ?? '';
  if (!/^[a-f0-9]{64}$/i.test(digest)) {
    throw new RegistryIntegrityError('Hosted registry checksum is not a valid SHA-256 digest');
  }
  return digest.toLowerCase();
}

function parseHostedIndex(raw: Buffer): HostedRegistryIndex {
  const input = JSON.parse(raw.toString('utf-8')) as Partial<HostedRegistryIndex>;
  if (input.version !== 1 || !Array.isArray(input.items)) {
    throw new RegistryIntegrityError('Hosted registry index must use version 1 and contain items');
  }
  for (const item of input.items) {
    if (
      typeof item?.name !== 'string' ||
      typeof item.manifest !== 'string' ||
      typeof item.integrity !== 'string' ||
      !item.files ||
      typeof item.files !== 'object'
    ) {
      throw new RegistryIntegrityError('Hosted registry index contains an invalid item entry');
    }
  }
  return input as HostedRegistryIndex;
}

export class HostedRegistrySource {
  readonly baseUrl: URL;
  readonly cacheDirectory: string;
  readonly timeoutMs: number;
  readonly maximumFileBytes: number;
  readonly fetchImpl: typeof fetch;
  readonly cacheVersion: string;
  readonly offline: boolean;

  constructor(options: HostedRegistryOptions) {
    const baseUrl = new URL(options.baseUrl.endsWith('/') ? options.baseUrl : `${options.baseUrl}/`);
    if (baseUrl.protocol !== 'https:' && !options.allowInsecureHttp) {
      throw new RegistrySecurityError('Hosted registry URL must use HTTPS');
    }
    this.baseUrl = baseUrl;
    this.cacheDirectory = resolve(options.cacheDirectory ?? defaultCacheDirectory());
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.maximumFileBytes = options.maximumFileBytes ?? 5 * 1024 * 1024;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.cacheVersion = options.cacheVersion ?? 'v1';
    this.offline = options.offline ?? false;
  }

  private urlFor(path: string): URL {
    const safePath = safeRelativePath(path, 'registry');
    const url = new URL(safePath, this.baseUrl);
    if (url.origin !== this.baseUrl.origin || url.protocol !== this.baseUrl.protocol) {
      throw new RegistrySecurityError(`Registry URL escapes the configured origin: ${url}`);
    }
    return url;
  }

  private async fetchBytes(path: string): Promise<Buffer> {
    const url = this.urlFor(path);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(url, { signal: controller.signal, redirect: 'follow' });
      if (!response.ok) {
        throw new RegistryNetworkError(
          `Registry request failed (${response.status}) for ${url}; ` +
            'verify the channel (e.g. stable/preview) and the base URL.',
        );
      }
      if (response.url) {
        const finalUrl = new URL(response.url);
        if (finalUrl.origin !== this.baseUrl.origin || finalUrl.protocol !== this.baseUrl.protocol) {
          throw new RegistrySecurityError(`Registry redirect escaped the configured origin: ${finalUrl}`);
        }
      }
      const content = Buffer.from(await response.arrayBuffer());
      if (content.byteLength > this.maximumFileBytes) {
        throw new RegistrySecurityError(`Registry response exceeds size limit: ${url}`);
      }
      return content;
    } catch (error) {
      if (
        error instanceof RegistryNetworkError ||
        error instanceof RegistrySecurityError ||
        error instanceof RegistryIntegrityError
      ) {
        throw error;
      }
      throw new RegistryNetworkError(
        `Registry request failed: ${url}: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private snapshotPrefix(): string {
    return `snapshot-${sha256(`${this.baseUrl.href}\0${this.cacheVersion}`)}-`;
  }

  private async isCompleteSnapshot(directory: string, digest: string): Promise<boolean> {
    try {
      const [marker, registryStats] = await Promise.all([
        readFile(join(directory, '.complete'), 'utf-8'),
        stat(join(directory, 'registry')),
      ]);
      return marker.trim() === digest && registryStats.isDirectory();
    } catch {
      return false;
    }
  }

  private async findCachedRegistry(): Promise<string | undefined> {
    const prefix = this.snapshotPrefix();
    let entries;
    try {
      entries = await readdir(this.cacheDirectory, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }

    const candidates: { directory: string; modifiedAt: number }[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith(prefix)) {
        continue;
      }
      const digest = entry.name.slice(prefix.length);
      if (!/^[a-f0-9]{64}$/i.test(digest)) {
        continue;
      }
      const directory = join(this.cacheDirectory, entry.name);
      if (!(await this.isCompleteSnapshot(directory, digest))) {
        continue;
      }
      candidates.push({
        directory,
        modifiedAt: (await stat(join(directory, '.complete'))).mtimeMs,
      });
    }

    candidates.sort(
      (left, right) =>
        right.modifiedAt - left.modifiedAt || right.directory.localeCompare(left.directory),
    );
    const latest = candidates[0];
    return latest ? join(latest.directory, 'registry') : undefined;
  }

  async materialize(): Promise<string> {
    if (this.offline) {
      const cachedRegistry = await this.findCachedRegistry();
      if (cachedRegistry) {
        return cachedRegistry;
      }
      throw new RegistryNetworkError('Hosted registry offline mode is enabled but no cache exists');
    }
    const [indexBytes, checksumBytes] = await Promise.all([
      this.fetchBytes('index.json'),
      this.fetchBytes('index.json.sha256'),
    ]);
    const indexDigest = parseChecksum(checksumBytes.toString('utf-8'));

    try {
      verifySha256(indexBytes, indexDigest);
    } catch (error) {
      throw new RegistryIntegrityError(error instanceof Error ? error.message : String(error));
    }

    const finalDirectory = join(
      this.cacheDirectory,
      `${this.snapshotPrefix()}${indexDigest}`,
    );
    const finalRegistry = join(finalDirectory, 'registry');
    if (await this.isCompleteSnapshot(finalDirectory, indexDigest)) {
      return finalRegistry;
    }

    const index = parseHostedIndex(indexBytes);
    const stagingDirectory = join(this.cacheDirectory, `.staging-${randomUUID()}`);
    const stagingRegistry = join(stagingDirectory, 'registry');
    await mkdir(stagingRegistry, { recursive: true });

    try {
      const seenNames = new Set<string>();
      for (const item of index.items) {
        if (seenNames.has(item.name)) {
          throw new RegistryIntegrityError(`Duplicate hosted registry item: ${item.name}`);
        }
        seenNames.add(item.name);

        const manifestPath = safeRelativePath(item.manifest, 'manifest');
        const manifestBytes = await this.fetchBytes(manifestPath);
        try {
          verifySha256(manifestBytes, item.integrity);
        } catch (error) {
          throw new RegistryIntegrityError(error instanceof Error ? error.message : String(error));
        }

        const validation = validateRegistryItem(JSON.parse(manifestBytes.toString('utf-8')));
        if (!validation.success) {
          throw new RegistryIntegrityError(
            `Invalid hosted manifest ${manifestPath}: ${validation.errors.map((entry) => `${entry.path}: ${entry.message}`).join('; ')}`,
          );
        }
        if (validation.data.name !== item.name) {
          throw new RegistryIntegrityError(
            `Hosted index item ${item.name} does not match manifest ${validation.data.name}`,
          );
        }

        const manifestDirectory = posix.dirname(manifestPath);
        const manifestTarget = join(stagingRegistry, ...manifestPath.split('/'));
        await mkdir(dirname(manifestTarget), { recursive: true });
        await writeFile(manifestTarget, manifestBytes);

        for (const file of validation.data.files) {
          const source = safeRelativePath(file.source, 'source');
          const expected = item.files[source];
          if (!expected) {
            throw new RegistryIntegrityError(`Missing checksum for ${item.name}/${source}`);
          }
          const remotePath = posix.join(manifestDirectory, source);
          const content = await this.fetchBytes(remotePath);
          try {
            verifySha256(content, expected);
          } catch (error) {
            throw new RegistryIntegrityError(error instanceof Error ? error.message : String(error));
          }
          const target = join(dirname(manifestTarget), ...source.split('/'));
          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, content);
        }
      }

      await writeFile(join(stagingDirectory, '.complete'), `${sha256(indexBytes)}\n`);
      await mkdir(this.cacheDirectory, { recursive: true });
      try {
        await rename(stagingDirectory, finalDirectory);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== 'EEXIST' && code !== 'ENOTEMPTY') {
          throw error;
        }
      }
      return finalRegistry;
    } catch (error) {
      await rm(stagingDirectory, { recursive: true, force: true });
      throw error;
    } finally {
      await rm(stagingDirectory, { recursive: true, force: true });
    }
  }

  async loadIndex(): Promise<RegistryIndex> {
    return new LocalRegistrySource(await this.materialize()).loadIndex();
  }

  async readItemFile(entry: Parameters<LocalRegistrySource['readItemFile']>[0], source: string) {
    return new LocalRegistrySource(await this.materialize()).readItemFile(entry, source);
  }
}
