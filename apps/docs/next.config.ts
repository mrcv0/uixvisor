import type { NextConfig } from 'next';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const applicationRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(applicationRoot, '..', '..');

const nextConfig: NextConfig = {
  outputFileTracingRoot: repositoryRoot,
  outputFileTracingIncludes: {
    '/*': ['../../registry/**/registry-item.json'],
  },
};

export default nextConfig;
