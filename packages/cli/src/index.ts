#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'node:path';

import { runList } from './commands/list.js';
import { runAdd } from './commands/add.js';
import { runInit } from './commands/init.js';
import { runDiff } from './commands/diff.js';
import { runDoctor } from './commands/doctor.js';
import { readConfig } from './config.js';

async function resolveRegistryRoot(value: string | undefined): Promise<string> {
  if (value) {
    return resolve(value);
  }
  if (process.env.UIXVISOR_REGISTRY) {
    return resolve(process.env.UIXVISOR_REGISTRY);
  }

  const config = await readConfig(process.cwd());
  if (config?.registry) {
    return resolve(process.cwd(), config.registry);
  }

  console.error(
    'No registry source configured. Pass --registry <path>, set UIXVISOR_REGISTRY, or run `uixvisor init`.\n' +
      '(No hosted registry is deployed yet - point this at a local uixvisor registry checkout.)',
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
  .option('--registry <path>', 'Registry source to record in the config')
  .option('--force', 'Overwrite an existing config file', false)
  .action(async (opts: { registry?: string; force: boolean }) => {
    try {
      const registry = opts.registry ?? process.env.UIXVISOR_REGISTRY;
      if (!registry) {
        throw new Error(
          'Pass --registry <path> or set UIXVISOR_REGISTRY (no hosted registry is deployed yet).',
        );
      }
      await runInit({
        projectRoot: process.cwd(),
        registry: resolve(registry),
        force: opts.force,
      });
    } catch (error) {
      fail(error);
    }
  });

program
  .command('list')
  .description('List available registry items')
  .option('--registry <path>', 'Path to the registry root')
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
  .option('--registry <path>', 'Path to the registry root')
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
  .option('--registry <path>', 'Path to the registry root')
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
  .option('--registry <path>', 'Path to the registry root')
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
