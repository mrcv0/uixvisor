const fs = require('node:fs');
const path = require('node:path');

// Registry items are addressed as `@registry/<item>/<file>` - the same two
// segment form the CLI rewrites on `add`. Item names are unique across the whole
// registry (the schema rejects duplicates), so the namespace directory is
// resolved here instead of being spelled out at each import site.
//
// Previously this alias pointed straight at `primitives/`, so nothing under
// blocks, screens or flows could resolve - which is why those had never actually
// been bundled or type-checked.
const registryRoot = path.resolve(__dirname, '../../registry');

function registryAliases() {
  const alias = {};

  for (const namespace of fs.readdirSync(registryRoot)) {
    const namespaceDir = path.join(registryRoot, namespace);
    if (!fs.statSync(namespaceDir).isDirectory()) continue;

    for (const item of fs.readdirSync(namespaceDir)) {
      const itemDir = path.join(namespaceDir, item);
      if (!fs.statSync(itemDir).isDirectory()) continue;
      alias[`@registry/${item}`] = itemDir;
    }
  }

  return alias;
}

/** Fingerprint so adding registry/forms/* invalidates babel's forever-cache. */
function registryAliasCacheKey() {
  return Object.keys(registryAliases()).sort().join('|');
}

module.exports = function (api) {
  // Do not use api.cache(true): new registry items would keep stale aliases.
  api.cache.using(registryAliasCacheKey);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ['module-resolver', { alias: registryAliases() }],
      'react-native-worklets/plugin',
    ],
  };
};
