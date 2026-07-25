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

export const registryItemSchema = z
  .object({
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
  })
  .superRefine((item, ctx) => {
    const matches = item.files.some((file) => {
      const targetStem = basename(file.target).replace(/\.[^.]+$/, '');
      const sourceStem = basename(file.source).replace(/\.[^.]+$/, '');
      return targetStem === item.name || sourceStem === item.name;
    });
    if (!matches) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'name must match the stem of at least one file target or source',
        path: ['files'],
      });
    }
  });

function basename(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

/**
 * Icon libraries a project can be wired to. Components always reference
 * semantic icon names, so this only selects which adapter file `add` installs.
 */
export const iconLibraries = ['phosphor'] as const;

/**
 * Font families shipped as an installable registry item. `system` skips the
 * font install entirely and lets components fall back to the platform default.
 */
export const fontFamilies = ['inter', 'system'] as const;

export const projectConfigSchema = z.object({
  $schema: z.string().optional(),
  registry: z.string().min(1),
  icons: z.enum(iconLibraries).default('phosphor'),
  font: z.enum(fontFamilies).default('inter'),
});

export type IconLibrary = (typeof iconLibraries)[number];
export type FontFamily = (typeof fontFamilies)[number];
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
