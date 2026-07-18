import { stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { detectProject } from '../detect-project.js';

export interface InitOptions {
  projectRoot: string;
  registry: string;
  force: boolean;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
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

  const config = {
    $schema: 'https://uixvisor.dev/schema/config.json',
    registry: options.registry,
  };

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf-8');
  console.log(`\nWrote ${configPath}`);
}
