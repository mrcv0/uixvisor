import assert from 'node:assert/strict';
import { test } from 'node:test';

import { collectNpmDependencies, formatNpmDependencyReport } from './registry-dependencies.js';

test('deduplicates and sorts npm dependency requirements', () => {
  const requirements = collectNpmDependencies([
    { name: 'swipeable-row', dependencies: ['react-native-gesture-handler'] },
    {
      name: 'animated-card',
      dependencies: ['react-native-reanimated', 'react-native-gesture-handler'],
    },
  ]);

  assert.deepEqual(requirements, [
    {
      name: 'react-native-gesture-handler',
      requiredBy: ['animated-card', 'swipeable-row'],
    },
    { name: 'react-native-reanimated', requiredBy: ['animated-card'] },
  ]);
});

test('formats an Expo-compatible install command', () => {
  const report = formatNpmDependencyReport([
    { name: 'react-native-gesture-handler', requiredBy: ['swipeable-row'] },
  ]);

  assert.equal(report[0], 'Required npm dependencies:');
  assert.equal(report[report.length - 1], 'Run: npx expo install react-native-gesture-handler');
});

test('omits the report when no npm dependencies are required', () => {
  assert.deepEqual(formatNpmDependencyReport([]), []);
});
