module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/__tests__/**/*-test.ts?(x)'],
  // jest-expo's transform is slow to warm up, and turbo runs this suite
  // alongside every other workspace task. The default 5s budget was being
  // exceeded under that contention, which showed up as an intermittent failure
  // rather than a real regression.
  testTimeout: 30000,
  transformIgnorePatterns: [
    // phosphor-react-native ships its per-icon entry points as untranspiled
    // .tsx, and @expo-google-fonts modules require .ttf assets - both need to
    // go through the transform rather than being treated as plain JS.
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|phosphor-react-native|react-navigation|@react-navigation/.*|react-native-svg|nativewind|react-native-css-interop)',
  ],
};
