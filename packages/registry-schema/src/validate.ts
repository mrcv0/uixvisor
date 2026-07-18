import { registryItemSchema, type RegistryItem } from './schema.js';

export interface ValidationFailure {
  path: string;
  message: string;
}

export type ValidationResult =
  | { success: true; data: RegistryItem }
  | { success: false; errors: ValidationFailure[] };

export function validateRegistryItem(input: unknown): ValidationResult {
  const result = registryItemSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => ({
      path: issue.path.join('.') || '(root)',
      message: issue.message,
    })),
  };
}
