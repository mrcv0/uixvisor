import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface UixvisorConfig {
  $schema?: string;
  registry: string;
}

export async function readConfig(projectRoot: string): Promise<UixvisorConfig | undefined> {
  try {
    const raw = await readFile(join(projectRoot, 'uixvisor.config.json'), 'utf-8');
    return JSON.parse(raw) as UixvisorConfig;
  } catch {
    return undefined;
  }
}
