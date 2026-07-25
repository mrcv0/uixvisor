export {
  registryItemSchema,
  registryItemFileSchema,
  projectConfigSchema,
  iconLibraries,
  fontFamilies,
} from './schema.js';
export type {
  RegistryItem,
  RegistryItemFile,
  ProjectConfig,
  IconLibrary,
  FontFamily,
} from './schema.js';
export { validateRegistryItem } from './validate.js';
export type { ValidationResult, ValidationFailure } from './validate.js';
