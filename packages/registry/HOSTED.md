# Hosted registry

The UIXVISOR hosted registry is designed for a single canonical base URL:

```
https://registry.uixvisor.dev
```

This domain has not been acquired or deployed yet. Until production hosting is
available, use a local registry path or an explicitly configured HTTPS preview
endpoint. Do not treat the canonical URL as live.

## Channels

- `stable` (default) – production items; semver stable.
- `preview` – pre-release items for early feedback; semver `0.x` and tagged candidates.

URL layout:

```
https://registry.uixvisor.dev/{channel}/index.json
https://registry.uixvisor.dev/{channel}/index.json.sha256
https://registry.uixvisor.dev/{channel}/items/{name}-{version}.tar
https://registry.uixvisor.dev/{channel}/items/{name}-{version}.tar.sha256
```

## Integrity

Every artifact is accompanied by a `sha256` digest file. The CLI
(`@uixvisor/registry`) refuses to use a downloaded payload that does not
match the declared digest. Local cache keys are content-addressed under
`$UIXVISOR_CACHE_DIR` (defaults: `%LOCALAPPDATA%/uixvisor/cache` on Windows,
`$XDG_CACHE_HOME/uixvisor` or `~/.cache/uixvisor` elsewhere).

## Schemas

- `https://uixvisor.dev/schema/registry-item.json` – manifest contract.
- `https://uixvisor.dev/schema/config.json` – user config contract.

Canonical copies of these JSON Schemas are published from
`apps/docs/public/schema/*.json` on every release.
