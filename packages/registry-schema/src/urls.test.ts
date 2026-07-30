import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DEFAULT_UIXVISOR_URLS, resolveUixvisorUrls } from './urls.js';

test('exposes one canonical production URL contract', () => {
  assert.deepEqual(DEFAULT_UIXVISOR_URLS, {
    siteUrl: 'https://uixvisor.dev',
    registryBaseUrl: 'https://registry.uixvisor.dev',
    schemaBaseUrl: 'https://uixvisor.dev/schema',
    configSchemaUrl: 'https://uixvisor.dev/schema/config.json',
    registryItemSchemaUrl: 'https://uixvisor.dev/schema/registry-item.json',
  });
});

test('derives preview schema URLs from an overridden site URL', () => {
  const urls = resolveUixvisorUrls({
    siteUrl: 'https://uixvisor-preview.vercel.app/',
    registryBaseUrl: 'https://uixvisor-registry-preview.example.test/',
  });

  assert.equal(urls.schemaBaseUrl, 'https://uixvisor-preview.vercel.app/schema');
  assert.equal(urls.configSchemaUrl, 'https://uixvisor-preview.vercel.app/schema/config.json');
  assert.equal(urls.registryBaseUrl, 'https://uixvisor-registry-preview.example.test');
});

test('allows an independent preview schema host', () => {
  const urls = resolveUixvisorUrls({
    schemaBaseUrl: 'https://schemas-preview.example.test/contracts/',
  });

  assert.equal(urls.configSchemaUrl, 'https://schemas-preview.example.test/contracts/config.json');
});

test('rejects insecure or ambiguous public base URLs', () => {
  for (const value of [
    'http://preview.example.test',
    'https://user:secret@preview.example.test',
    'https://preview.example.test/?channel=next',
    'https://preview.example.test/#latest',
  ]) {
    assert.throws(() => resolveUixvisorUrls({ siteUrl: value }));
  }
});
