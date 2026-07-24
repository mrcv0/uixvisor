import { createRequire } from 'node:module';

interface PackageMetadata {
  version: string;
}

const require = createRequire(import.meta.url);
const metadata = require('../package.json') as PackageMetadata;

export const CLI_VERSION = metadata.version;
