export interface UixvisorUrlOverrides {
  siteUrl?: string;
  registryBaseUrl?: string;
  schemaBaseUrl?: string;
}

export interface UixvisorUrls {
  siteUrl: string;
  registryBaseUrl: string;
  schemaBaseUrl: string;
  configSchemaUrl: string;
  registryItemSchemaUrl: string;
}

export const DEFAULT_UIXVISOR_SITE_URL = 'https://uixvisor.dev';
export const DEFAULT_UIXVISOR_REGISTRY_BASE_URL = 'https://registry.uixvisor.dev';

function normalizeHttpsBaseUrl(name: string, value: string): string {
  const url = new URL(value);

  if (url.protocol !== 'https:') {
    throw new Error(`${name} must use HTTPS`);
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(`${name} must not include credentials, a query, or a fragment`);
  }

  url.pathname = url.pathname.replace(/\/+$/, '');
  return url.href.replace(/\/$/, '');
}

/**
 * Owns every public UIXVISOR endpoint. Consumers may override these values for
 * preview deployments without baking a temporary host into generated files.
 */
export function resolveUixvisorUrls(overrides: UixvisorUrlOverrides = {}): UixvisorUrls {
  const siteUrl = normalizeHttpsBaseUrl(
    'siteUrl',
    overrides.siteUrl ?? DEFAULT_UIXVISOR_SITE_URL,
  );
  const registryBaseUrl = normalizeHttpsBaseUrl(
    'registryBaseUrl',
    overrides.registryBaseUrl ?? DEFAULT_UIXVISOR_REGISTRY_BASE_URL,
  );
  const schemaBaseUrl = normalizeHttpsBaseUrl(
    'schemaBaseUrl',
    overrides.schemaBaseUrl ?? `${siteUrl}/schema`,
  );

  return {
    siteUrl,
    registryBaseUrl,
    schemaBaseUrl,
    configSchemaUrl: `${schemaBaseUrl}/config.json`,
    registryItemSchemaUrl: `${schemaBaseUrl}/registry-item.json`,
  };
}

export const DEFAULT_UIXVISOR_URLS = Object.freeze(resolveUixvisorUrls());
