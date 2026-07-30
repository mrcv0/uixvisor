# uixvisor

Copy-and-own UI registry CLI for Expo and NativeWind projects.

> Pre-release notice: the npm package and hosted UIXVISOR registry have not been
> published yet. The CLI currently runs from this repository with a local
> registry path.

## Requirements

- Node.js 22.13 or newer
- Expo SDK 57
- NativeWind 4

## Commands

```text
uixvisor init
uixvisor list
uixvisor add <items...>
uixvisor diff <items...>
uixvisor doctor
```

During repository development:

```bash
npm run build --workspace uixvisor
node packages/cli/dist/index.js --help
```

From an Expo application, point the CLI at the checked-out registry:

```bash
node /path/to/uixvisor/packages/cli/dist/index.js init \
  --registry /path/to/uixvisor/registry
node /path/to/uixvisor/packages/cli/dist/index.js doctor
node /path/to/uixvisor/packages/cli/dist/index.js add button
```

After the first public release:

```bash
npx uixvisor init --registry <https-registry-url>
npx uixvisor add button
```

## Safety

- Existing files are skipped unless `--force` is explicit.
- A failed multi-file write rolls back files already changed by that operation.
- Absolute paths, traversal, symlink and Windows junction escapes are rejected.
- Hosted registries require HTTPS, same-origin redirects and SHA-256 integrity.
- Verified hosted snapshots can be used with `--offline`.
- Required npm dependencies are reported, never silently installed.

Full documentation is in the
[UIXVISOR repository](https://github.com/mrcv0/uixvisor).

## License

MIT. The UIXVISOR name and logo are not granted by the code license.
