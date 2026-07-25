import { randomUUID } from 'node:crypto';
import { open, rename, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { projectConfigSchema, type FontFamily, type IconLibrary } from '@uixvisor/registry-schema';

import { detectProject } from '../detect-project.js';

export interface InitOptions {
  projectRoot: string;
  registry: string;
  force: boolean;
  icons?: IconLibrary;
  font?: FontFamily;
  renameConfig?: (source: string, target: string) => Promise<void>;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileAtomic(
  path: string,
  content: string,
  renameTarget: (source: string, target: string) => Promise<void> = rename,
): Promise<void> {
  const temporaryPath = `${path}.tmp-${randomUUID()}`;
  let handle: Awaited<ReturnType<typeof open>> | undefined;

  try {
    handle = await open(temporaryPath, 'wx');
    await handle.writeFile(content, 'utf-8');
    await handle.sync();
    await handle.close();
    handle = undefined;
    await renameTarget(temporaryPath, path);
  } finally {
    await handle?.close().catch(() => undefined);
    await rm(temporaryPath, { force: true });
  }
}

export async function runInit(options: InitOptions): Promise<void> {
  const configPath = join(options.projectRoot, 'uixvisor.config.json');

  if (!options.force && (await pathExists(configPath))) {
    throw new Error(`${configPath} already exists. Use --force to overwrite.`);
  }

  const detected = await detectProject(options.projectRoot);

  console.log('Detected project:');
  console.log(`  Expo:            ${detected.expoVersion ?? 'not found'}`);
  console.log(`  NativeWind:      ${detected.nativewindVersion ?? 'not found'}`);
  console.log(`  Expo Router:     ${detected.hasExpoRouter ? 'yes' : 'no'}`);
  console.log(`  Package manager: ${detected.packageManager}`);

  if (!detected.isExpo) {
    console.warn(
      '\nWarning: this does not look like an Expo project (no expo dependency or app.json found).',
    );
  }

  // Parsing rather than building the object literal means the schema owns the
  // defaults, so `init` and a hand-edited config can never disagree.
  const config = projectConfigSchema.parse({
    $schema: 'https://uixvisor.dev/schema/config.json',
    registry: options.registry,
    ...(options.icons ? { icons: options.icons } : {}),
    ...(options.font ? { font: options.font } : {}),
  });

  await writeFileAtomic(
    configPath,
    `${JSON.stringify(config, null, 2)}\n`,
    options.renameConfig,
  );
  console.log(`\nWrote ${configPath}`);
  console.log(`  Icons: ${config.icons}`);
  console.log(`  Font:  ${config.font}`);
}
