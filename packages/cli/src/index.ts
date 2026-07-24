#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'node:path';

import { HostedRegistrySource } from '@uixvisor/registry';

import { runList } from './commands/list.js';
import { runAdd } from './commands/add.js';
import { runInit } from './commands/init.js';
import { runDiff } from './commands/diff.js';
import { runDoctor } from './commands/doctor.js';
import { readConfig } from './config.js';

async function resolveRegistryValue(value: string, projectRoot: string): Promise<string> {
  if (value.startsWith('https://')) {
    return new HostedRegistrySource({ baseUrl: value }).materialize();
  }
  if (value.startsWith('http://')) {
    throw new Error('Hosted registry URLs must use HTTPS');
  }
  return resolve(projectRoot, value);
}

async function resolveRegistryRoot(value: string | undefined): Promise<string> {
  if (value) {
    return resolveRegistryValue(value, process.cwd());
  }
  if (process.env.UIXVISOR_REGISTRY) {
    return resolveRegistryValue(process.env.UIXVISOR_REGISTRY, process.cwd());
  }

  const config = await readConfig(process.cwd());
  if (config?.registry) {
    return resolveRegistryValue(config.registry, process.cwd());
  }

  console.error(
    'No registry source configured. Pass --registry <path-or-url>, set UIXVISOR_REGISTRY, or run `uixvisor init`.',
  );
  process.exit(1);
}

const program = new Command();

program.name('uixvisor').description('UIXVISOR registry CLI').version('0.1.0');

function fail(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}

program
  .command('init')
  .description('Detect the current project and write uixvisor.config.json')
  .option('--registry <source>', 'Registry path or HTTPS URL to record in the config')
  .option('--force', 'Overwrite an existing config file', false)
  .action(async (opts: { registry?: string; force: boolean }) => {
    try {
      const registry = opts.registry ?? process.env.UIXVISOR_REGISTRY;
      if (!registry) {
        throw new Error('Pass --registry <path-or-url> or set UIXVISOR_REGISTRY.');
      }
      if (registry.startsWith('http://')) {
        throw new Error('Hosted registry URLs must use HTTPS');
      }
      await runInit({
        projectRoot: process.cwd(),
        registry: registry.startsWith('https://') ? registry : resolve(registry),
        force: opts.force,
      });
    } catch (error) {
      fail(error);
    }
  });

program
  .command('list')
  .description('List available registry items')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .action(async (opts: { registry?: string }) => {
    try {
      await runList(await resolveRegistryRoot(opts.registry));
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
  .action(async (items: string[], opts: { registry?: string; target: string; force: boolean }) => {
    try {
      await runAdd(items, {
        registryRoot: await resolveRegistryRoot(opts.registry),
        targetRoot: resolve(opts.target),
        force: opts.force,
      });
    } catch (error) {
      fail(error);
    }
  });

program
  .command('diff <items...>')
  .description('Show differences between local files and the registry source')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .option('--target <path>', 'Target project root', '.')
  .action(async (items: string[], opts: { registry?: string; target: string }) => {
    try {
      const hasDifferences = await runDiff(items, {
        registryRoot: await resolveRegistryRoot(opts.registry),
        targetRoot: resolve(opts.target),
      });
      if (hasDifferences) {
        process.exitCode = 1;
      }
    } catch (error) {
      fail(error);
    }
  });

program
  .command('doctor')
  .description('Check the current project and registry for compatibility issues')
  .option('--registry <source>', 'Local path or HTTPS registry URL')
  .action(async (opts: { registry?: string }) => {
    try {
      const checks = await runDoctor({
        projectRoot: process.cwd(),
        registryRoot: await resolveRegistryRoot(opts.registry),
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
