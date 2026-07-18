#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'node:path';

import { runList } from './commands/list.js';
import { runAdd } from './commands/add.js';

function resolveRegistryRoot(value: string | undefined): string {
  const registry = value ?? process.env.UIXVISOR_REGISTRY;

  if (!registry) {
    console.error(
      'No registry source configured. Pass --registry <path> or set UIXVISOR_REGISTRY.\n' +
        '(No hosted registry is deployed yet - point this at a local uixvisor registry checkout.)',
    );
    process.exit(1);
  }

  return resolve(registry);
}

const program = new Command();

program.name('uixvisor').description('UIXVISOR registry CLI').version('0.1.0');

function fail(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}

program
  .command('list')
  .description('List available registry items')
  .option('--registry <path>', 'Path to the registry root')
  .action(async (opts: { registry?: string }) => {
    try {
      await runList(resolveRegistryRoot(opts.registry));
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
        registryRoot: resolveRegistryRoot(opts.registry),
        targetRoot: resolve(opts.target),
        force: opts.force,
      });
    } catch (error) {
      fail(error);
    }
  });

program.parseAsync(process.argv);
