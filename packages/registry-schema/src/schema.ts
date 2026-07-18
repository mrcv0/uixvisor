import { z } from 'zod';

export const registryItemFileSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
});

export const registryItemSchema = z.object({
  $schema: z.string().url().optional(),
  name: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'name must be kebab-case'),
  type: z.enum([
    'registry:primitive',
    'registry:component',
    'registry:block',
    'registry:screen',
    'registry:flow',
  ]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be semver (x.y.z)'),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  platforms: z.array(z.enum(['ios', 'android', 'web'])).min(1),
  compatibility: z.record(z.string(), z.string()),
  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
  files: z.array(registryItemFileSchema).min(1),
});

export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
