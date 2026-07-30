# @uixvisor/registry-schema

Zod schemas, TypeScript types and validation contracts for UIXVISOR registries.

## Registry item validation

```ts
import { validateRegistryItem } from '@uixvisor/registry-schema';

const result = validateRegistryItem(candidate);

if (!result.success) {
  console.error(result.errors);
} else {
  console.log(result.data.name);
}
```

The package validates:

- kebab-case item names and known item types
- semantic versions and compatibility ranges
- portable relative file paths
- primary-file naming
- icon and font configuration values

## Project config

```ts
import { projectConfigSchema } from '@uixvisor/registry-schema';

const config = projectConfigSchema.parse({
  registry: '../uixvisor/registry',
  icons: 'phosphor',
  font: 'system',
});
```

## Public URL contract

```ts
import {
  DEFAULT_UIXVISOR_URLS,
  resolveUixvisorUrls,
} from '@uixvisor/registry-schema';

const preview = resolveUixvisorUrls({
  siteUrl: 'https://uixvisor-preview.example.test',
  registryBaseUrl: 'https://registry-preview.example.test',
});
```

Overrides must use HTTPS and cannot contain credentials, a query or a fragment.
The default domain values describe the planned production contract; those
services are not live yet.

## License

MIT. The UIXVISOR name and logo are not granted by the code license.
