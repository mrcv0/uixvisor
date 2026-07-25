import { z } from 'zod';

const registryItemFilePathSchema = z
  .string()
  .min(1)
  .refine((value) => {
    const normalized = value.replace(/\\/g, '/');
    const segments = normalized.split('/');

    return (
      !normalized.startsWith('/') &&
      !/^[a-zA-Z]:/.test(normalized) &&
      !value.includes('\\') &&
      !normalized.includes('\0') &&
      segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..')
    );
  }, 'path must be a normalized relative file path without empty, ".", or ".." segments');

export const registryItemFileSchema = z.object({
  source: registryItemFilePathSchema,
  target: registryItemFilePathSchema,
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
  compatibility: z.record(
    z.enum(['expo', 'nativewind', 'reanimated', 'gesture-handler', 'react-native', 'react']),
    z
      .string()
      .regex(
        /^(>=|<=|>|<|~|\^)?\d+(\.\d+){0,2}(?:[ \t\n-]+(>=|<=|>|<|~|\^)?\d+(\.\d+){0,2})?$/,
        'compatibility must be a semver range',
      ),
  ),
  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
  files: z.array(registryItemFileSchema).min(1),
});

export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
