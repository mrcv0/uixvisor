# @uixvisor/registry

Secure local and hosted registry resolution for UIXVISOR.

## Features

- Recursive local registry discovery and schema validation
- Duplicate item-name rejection
- Safe real-path resolution for files, symlinks and Windows junctions
- HTTPS-only hosted sources with same-origin redirect pinning
- SHA-256 payload verification
- Download size and timeout limits
- Origin/cache-version scoped offline snapshots
- Typed network, integrity and security errors

## Local registry

```ts
import { LocalRegistrySource } from '@uixvisor/registry';

const source = new LocalRegistrySource('/path/to/registry');
const index = await source.loadIndex();
const button = index.get('button');

if (button) {
  const sourceFile = await source.readItemFile(button, 'button.tsx');
  console.log(sourceFile.toString('utf8'));
}
```

## Hosted registry

```ts
import { HostedRegistrySource } from '@uixvisor/registry';

const source = new HostedRegistrySource({
  baseUrl: 'https://registry-preview.example.test/preview',
});

const materializedRoot = await source.materialize();
```

Set `offline: true` to forbid network access and use only a previously verified
snapshot for the same base URL and cache version.

The canonical UIXVISOR hosted domain is planned but not live. See
[HOSTED.md](./HOSTED.md) for the artifact contract.

## Integrity helpers

```ts
import { sha256, verifySha256 } from '@uixvisor/registry';

const digest = sha256(payload);
verifySha256(payload, digest);
```

## License

MIT. The UIXVISOR name and logo are not granted by the code license.
