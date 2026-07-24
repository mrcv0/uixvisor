import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRegistryRoot = resolve(moduleDirectory, '..', '..', '..', 'registry');

export function resolveRegistryRoot(
  environment: { UIXVISOR_REGISTRY_ROOT?: string } = process.env as {
    UIXVISOR_REGISTRY_ROOT?: string;
  },
): string {
  const configuredRoot = environment.UIXVISOR_REGISTRY_ROOT;
  return configuredRoot ? resolve(configuredRoot) : repositoryRegistryRoot;
}
