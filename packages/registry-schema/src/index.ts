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
export {
  DEFAULT_UIXVISOR_SITE_URL,
  DEFAULT_UIXVISOR_REGISTRY_BASE_URL,
  DEFAULT_UIXVISOR_URLS,
  resolveUixvisorUrls,
} from './urls.js';
export type { UixvisorUrlOverrides, UixvisorUrls } from './urls.js';
