import { globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';

const reactNativeConfig = [
  ...expoConfig,
  globalIgnores(['.expo/**', 'android/**', 'coverage/**', 'dist/**', 'ios/**']),
];

export default reactNativeConfig;
