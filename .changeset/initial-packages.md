---
"@uixvisor/cli": minor
"@uixvisor/registry": minor
"@uixvisor/registry-schema": minor
"@uixvisor/tokens": minor
"@uixvisor/presets": minor
"@uixvisor/testing": minor
---

Adds the first public iteration of the @uixvisor/* packages:

- `cli`: deterministic, atomically transactional registry consumer with hosted
  HTTPS + sha256 support, dependency-target rewriting for multi-file items,
  duplicate-name rejection, npm dependency reporting, and a `package.json`
  driven version.
- `registry`: local and hosted registry sources with cache versioning,
  origin pinning, size/time limits, and a typed error model.
- `registry-schema`: Zod-backed manifest + config schema with strict
  compatibility keys, file path safety, and primary-file enforcement.
- `tokens`, `presets`, `testing`: semantic color/motion tokens, Default +
  Fintech presets, and shared RNTL testing helpers.
