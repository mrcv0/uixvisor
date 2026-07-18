module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@registry': '../../registry/primitives',
          },
        },
      ],
      // Must be listed last. Required by react-native-reanimated (which
      // NativeWind's react-native-css-interop depends on internally) even
      // though this project writes no worklets directly.
      'react-native-worklets/plugin',
    ],
  };
};
