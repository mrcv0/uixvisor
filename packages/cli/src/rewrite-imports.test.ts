import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rewriteRegistryImports, toRelativeImportSpecifier } from './rewrite-imports.js';

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
