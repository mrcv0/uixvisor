import reactNativeConfig from '@uixvisor/eslint-config/react-native';

export default [
  ...reactNativeConfig,
  {
    ignores: ['.maestro/**', 'nativewind-env.d.ts'],
  },
];
