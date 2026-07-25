import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { sha256 } from './index.js';
import {
  HostedRegistrySource,
  RegistryIntegrityError,
  RegistrySecurityError,
} from './hosted.js';

async function withTempDir(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'uixvisor-hosted-'));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function hostedFixture(fileChecksum?: string) {
  const source = Buffer.from('export const button = true;\n');
  const manifest = Buffer.from(
    JSON.stringify({
      name: 'button',
      type: 'registry:component',
      version: '0.1.0',
      platforms: ['ios', 'android'],
      compatibility: {},
      dependencies: [],
      registryDependencies: [],
      files: [{ source: 'button.tsx', target: 'components/button.tsx' }],
    }),
  );
  const index = Buffer.from(
    JSON.stringify({
      version: 1,
      items: [
        {
          name: 'button',
          manifest: 'primitives/button/registry-item.json',
          integrity: sha256(manifest),
          files: { 'button.tsx': fileChecksum ?? sha256(source) },
        },
      ],
    }),
  );

  return {
    index,
    responses: new Map<string, Buffer>([
      ['/index.json', index],
      ['/index.json.sha256', Buffer.from(sha256(index))],
      ['/primitives/button/registry-item.json', manifest],
      ['/primitives/button/button.tsx', source],
    ]),
  };
}

function createFetch(responses: Map<string, Buffer>): typeof fetch {
  return (async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    const body = responses.get(url.pathname);
    return body
      ? new Response(body.toString('utf-8'), { status: 200 })
      : new Response('Not found', { status: 404 });
  }) as typeof fetch;
}

test('materializes and loads a checksum-verified hosted registry', async () => {
  await withTempDir(async (cacheDirectory) => {
    const fixture = hostedFixture();
    const source = new HostedRegistrySource({
      baseUrl: 'https://registry.example.test/',
      cacheDirectory,
      fetchImpl: createFetch(fixture.responses),
    });

    const index = await source.loadIndex();
    const entry = index.get('button');
    assert.ok(entry);
    assert.match((await source.readItemFile(entry, 'button.tsx')).toString('utf-8'), /button/);
  });
});

test('rejects a hosted file with a mismatched checksum', async () => {
  await withTempDir(async (cacheDirectory) => {
    const fixture = hostedFixture('0'.repeat(64));
    const source = new HostedRegistrySource({
      baseUrl: 'https://registry.example.test/',
      cacheDirectory,
      fetchImpl: createFetch(fixture.responses),
    });

    await assert.rejects(source.materialize(), RegistryIntegrityError);
  });
});

test('rejects insecure hosted registry URLs by default', () => {
  assert.throws(
    () => new HostedRegistrySource({ baseUrl: 'http://registry.example.test/' }),
    RegistrySecurityError,
  );
});

test('rejects offline mode when no cache is available', async () => {
  const source = new HostedRegistrySource({
    baseUrl: 'https://registry.example.test/',
    offline: true,
  });

  await assert.rejects(
    source.materialize(),
    /offline mode is enabled but no cache exists/,
  );
});
