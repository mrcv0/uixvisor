import { globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';

const reactNativeConfig = [
  ...expoConfig,
  globalIgnores(['.expo/**', 'android/**', 'coverage/**', 'dist/**', 'ios/**']),
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
