#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'node:path';

import { HostedRegistrySource } from '@uixvisor/registry';
import { fontFamilies, iconLibraries } from '@uixvisor/registry-schema';

import { runList } from './commands/list.js';
import { runAdd } from './commands/add.js';
import { runInit } from './commands/init.js';
import { runDiff } from './commands/diff.js';
import { runDoctor } from './commands/doctor.js';
import { readConfig } from './config.js';
import { CLI_VERSION } from './version.js';

async function resolveRegistryValue(
  value: string,
  projectRoot: string,
  options: { offline?: boolean } = {},
): Promise<string> {
  if (value.startsWith('https://')) {
    return new HostedRegistrySource({ baseUrl: value, offline: options.offline }).materialize();
  }
  if (value.startsWith('http://')) {
    throw new Error('Hosted registry URLs must use HTTPS');
  }
  return resolve(projectRoot, value);
}

async function resolveRegistryRoot(
  value: string | undefined,
  options: { offline?: boolean } = {},
): Promise<string> {
  if (value) {
    return resolveRegistryValue(value, process.cwd(), options);
  }
  if (process.env.UIXVISOR_REGISTRY) {
    return resolveRegistryValue(process.env.UIXVISOR_REGISTRY, process.cwd(), options);
  }

  const config = await readConfig(process.cwd());
  if (config?.registry) {
    return resolveRegistryValue(config.registry, process.cwd(), options);
  }

  console.error(
    'No registry source configured. Pass --registry <path-or-url>, set UIXVISOR_REGISTRY, or run `uixvisor init`.',
  );
  process.exit(1);
}

const program = new Command();

program.name('uixvisor').description('UIXVISOR registry CLI').version(CLI_VERSION);

function fail(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}

/**
 * Rejects unknown values up front so a typo lands as a clear CLI error rather
 * than a schema failure after the project has already been inspected.
 */
function parseChoice<T extends string>(
  flag: string,
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!allowed.includes(value as T)) {
    throw new Error(`${flag} must be one of: ${allowed.join(', ')}`);
  }
  return value as T;
}

program
  .command('init')
  .description('Detect the current project and write uixvisor.config.json')
  .option('--registry <source>', 'Registry path or HTTPS URL to record in the config')
  .option('--icons <library>', `Icon library to install (${iconLibraries.join(', ')})`)
  .option('--font <family>', `Font family to install (${fontFamilies.join(', ')})`)
  .option('--force', 'Overwrite an existing config file', false)
  .action(async (opts: { registry?: string; icons?: string; font?: string; force: boolean }) => {
    try {
      const registry = opts.registry ?? process.env.UIXVISOR_REGISTRY;
      if (!registry) {
        throw new Error('Pass --registry <path-or-url> or set UIXVISOR_REGISTRY.');
      }
      if (registry.startsWith('http://')) {
        throw new Error('Hosted registry URLs must use HTTPS');
      }
      const icons = parseChoice('--icons', opts.icons, iconLibraries);
      const font = parseChoice('--font', opts.font, fontFamilies);
      await runInit({
        projectRoot: process.cwd(),
        registry: registry.startsWith('https://') ? registry : resolve(registry),
        force: opts.force,
        icons,
        font,
      });
    } catch (error) {
      fail(error);
    }
  });

program
  .command('list')
  .description('List available registry items')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .option('--offline', 'Use cached registry snapshot without network access', false)
  .action(async (opts: { registry?: string; offline: boolean }) => {
    try {
      await runList(await resolveRegistryRoot(opts.registry, { offline: opts.offline }));
    } catch (error) {
      fail(error);
    }
  });

program
  .command('add <items...>')
  .description('Add one or more registry items to the current project')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .option('--target <path>', 'Target project root', '.')
  .option('--force', 'Overwrite existing files', false)
  .option('--offline', 'Use cached registry snapshot without network access', false)
  .action(
    async (
      items: string[],
      opts: { registry?: string; target: string; force: boolean; offline: boolean },
    ) => {
      try {
        await runAdd(items, {
          registryRoot: await resolveRegistryRoot(opts.registry, { offline: opts.offline }),
          targetRoot: resolve(opts.target),
          force: opts.force,
        });
      } catch (error) {
        fail(error);
      }
    },
  );

program
  .command('diff <items...>')
  .description('Show differences between local files and the registry source')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .option('--target <path>', 'Target project root', '.')
  .option('--offline', 'Use cached registry snapshot without network access', false)
  .action(
    async (
      items: string[],
      opts: { registry?: string; target: string; offline: boolean },
    ) => {
      try {
        const hasDifferences = await runDiff(items, {
          registryRoot: await resolveRegistryRoot(opts.registry, { offline: opts.offline }),
          targetRoot: resolve(opts.target),
        });
        if (hasDifferences) {
          process.exitCode = 1;
        }
      } catch (error) {
        fail(error);
      }
    },
  );

program
  .command('doctor')
  .description('Check the current project and registry for compatibility issues')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .option('--offline', 'Use cached registry snapshot without network access', false)
  .action(async (opts: { registry?: string; offline: boolean }) => {
    try {
      const checks = await runDoctor({
        projectRoot: process.cwd(),
        registryRoot: await resolveRegistryRoot(opts.registry, { offline: opts.offline }),
      });

      const icon = { pass: '✔', warn: '!', fail: '✖' } as const;
      for (const check of checks) {
        console.log(`${icon[check.status]} ${check.name}: ${check.message}`);
      }

      if (checks.some((check) => check.status === 'fail')) {
        process.exitCode = 1;
      }
    } catch (error) {
      fail(error);
    }
  });

program.parseAsync(process.argv);
