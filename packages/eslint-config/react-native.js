import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import expoConfig from 'eslint-config-expo/flat.js';

const reactNativeConfig = [
  ...expoConfig,
  globalIgnores(['.expo/**', 'android/**', 'coverage/**', 'dist/**', 'ios/**']),
  {
    // Tooling config files run in Node, not in the app bundle, so they need
    // CommonJS globals (__dirname, require, module) that the app itself must not
    // have.
    files: ['*.config.js', '*.config.cjs', 'metro.config.js', 'babel.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    settings: {
      'import/extensions': ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'] },
        typescript: { extensions: ['.ts', '.tsx'] },
      },
    },
  },
];

export default reactNativeConfig;
