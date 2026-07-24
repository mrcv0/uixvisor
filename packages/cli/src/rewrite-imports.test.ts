import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRegistryImportTargets,
  rewriteRegistryImports,
  toRelativeImportSpecifier,
} from './rewrite-imports.js';

test('rewrites a same-directory registry import to a relative specifier', () => {
  const content = `import { Input } from '@registry/input/input';\nimport { Text } from '@registry/text/text';\n`;

  const result = rewriteRegistryImports(content, 'components/ui/otp-input.tsx', {
    input: 'components/ui/input.tsx',
    text: 'components/ui/text.tsx',
  });

  assert.equal(result, "import { Input } from './input';\nimport { Text } from './text';\n");
});

test('leaves unknown registry references untouched', () => {
  const content = `import { Ghost } from '@registry/ghost/ghost';\n`;

  const result = rewriteRegistryImports(content, 'components/ui/otp-input.tsx', {
    input: 'components/ui/input.tsx',
  });

  assert.equal(result, content);
});

test('computes a relative specifier across nested directories', () => {
  const specifier = toRelativeImportSpecifier(
    'components/ui/forms/otp-input.tsx',
    'components/ui/input.tsx',
  );

  assert.equal(specifier, '../input');
});

test('resolves primary and secondary files from multi-file registry items', () => {
  const targets = buildRegistryImportTargets([
    {
      name: 'swipeable-row',
      files: [
        {
          source: 'swipeable-native.tsx',
          target: 'components/ui/swipeable-native.tsx',
        },
        {
          source: 'swipeable-row.tsx',
          target: 'components/ui/swipeable-row.tsx',
        },
      ],
    },
  ]);
  const content =
    "import { Row } from '@registry/swipeable-row/swipeable-row';\n" +
    "import { Native } from '@registry/swipeable-row/swipeable-native';\n";

  assert.equal(targets['swipeable-row'], 'components/ui/swipeable-row.tsx');
  assert.equal(
    rewriteRegistryImports(content, 'components/screens/example.tsx', targets),
    "import { Row } from '../ui/swipeable-row';\n" +
      "import { Native } from '../ui/swipeable-native';\n",
  );
});

test('falls back to the first file when no primary alias matches', () => {
  const targets = buildRegistryImportTargets([
    {
      name: 'button',
      files: [{ source: 'index.ts', target: 'components/ui/index.ts' }],
    },
  ]);

  assert.equal(targets.button, 'components/ui/index.ts');
});
