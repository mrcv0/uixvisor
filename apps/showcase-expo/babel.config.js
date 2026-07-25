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
function registryAliases() {
  const root = path.resolve(__dirname, '../../registry');
  const alias = {};

  for (const namespace of fs.readdirSync(root)) {
    const namespaceDir = path.join(root, namespace);
    if (!fs.statSync(namespaceDir).isDirectory()) continue;

    for (const item of fs.readdirSync(namespaceDir)) {
      const itemDir = path.join(namespaceDir, item);
      if (!fs.statSync(itemDir).isDirectory()) continue;
      alias[`@registry/${item}`] = itemDir;
    }
  }

  return alias;
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ['module-resolver', { alias: registryAliases() }],
      // Must be listed last. Required by react-native-reanimated (which
      // NativeWind's react-native-css-interop depends on internally) even
      // though this project writes no worklets directly.
      'react-native-worklets/plugin',
    ],
  };
};
