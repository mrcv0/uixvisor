import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { projectConfigSchema, type ProjectConfig } from '@uixvisor/registry-schema';

export type UixvisorConfig = ProjectConfig;

/**
 * Reads `uixvisor.config.json` and fills in schema defaults, so a config written
 * before `icons`/`font` existed still resolves to a usable shape. Returns
 * undefined when the file is absent or invalid - callers treat that as "not
 * initialised" rather than an error.
 */
export async function readConfig(projectRoot: string): Promise<UixvisorConfig | undefined> {
  try {
    const raw = await readFile(join(projectRoot, 'uixvisor.config.json'), 'utf-8');
    const parsed = projectConfigSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}
