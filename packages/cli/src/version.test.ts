import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

import { CLI_VERSION } from './version.js';

const require = createRequire(import.meta.url);
const metadata = require('../package.json') as { version: string };

test('reads the CLI version from package metadata', () => {
  assert.equal(CLI_VERSION, metadata.version);
});
