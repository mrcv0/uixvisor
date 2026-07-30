import 'server-only';

import { resolveUixvisorUrls } from '@uixvisor/registry-schema';

export const CHANNEL = process.env.UIXVISOR_REGISTRY_CHANNEL ?? 'stable';
export const PUBLIC_ENDPOINTS_AVAILABLE =
  process.env.UIXVISOR_PUBLIC_ENDPOINTS_AVAILABLE === 'true';

export const {
  siteUrl: SITE_URL,
  registryBaseUrl: REGISTRY_BASE_URL,
  schemaBaseUrl: SCHEMA_BASE_URL,
} = resolveUixvisorUrls({
  siteUrl: process.env.UIXVISOR_SITE_URL,
  registryBaseUrl: process.env.UIXVISOR_REGISTRY_BASE_URL,
  schemaBaseUrl: process.env.UIXVISOR_SCHEMA_BASE_URL,
});
