#!/usr/bin/env node
// Colour values necessarily live in three places:
//
//   1. packages/tokens        - the source of truth, consumed by CLI and docs
//   2. apps/*/global.css      - CSS variables NativeWind compiles against
//   3. registry/primitives/theme/theme.tsx - runtime values for icons, native
//      colour props and shadows, which classes cannot express
//
// The registry is copy-and-own, so (3) cannot import (1). This script keeps the
// three honest instead, and fails the build when they drift.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const CSS_FILES = ['apps/showcase-expo/global.css', 'apps/test-harness/global.css'];
const THEME_FILE = 'registry/primitives/theme/theme.tsx';

function parseCssMode(css, selector) {
  const block = css.split(selector)[1];
  if (!block) {
    throw new Error(`missing ${selector} block`);
  }
  const body = block.slice(block.indexOf('{') + 1, block.indexOf('}'));
  const colors = {};
  for (const [, name, value] of body.matchAll(/--color-([a-z-]+)\s*:\s*(#[0-9a-f]{3,8})\s*;/gi)) {
    colors[name] = value.toLowerCase();
  }
  return colors;
}

function parseThemeMode(source, mode) {
  const start = source.indexOf(`${mode}: {`);
  if (start === -1) {
    throw new Error(`missing ${mode} block in theme.tsx`);
  }
  const body = source.slice(start, source.indexOf('\n  },', start));
  const colors = {};
  for (const [, name, value] of body.matchAll(/'?([a-z-]+)'?\s*:\s*'(#[0-9a-f]{3,8})'/gi)) {
    colors[name] = value.toLowerCase();
  }
  return colors;
}

function compare(label, expected, actual, errors) {
  for (const [name, value] of Object.entries(expected)) {
    if (!(name in actual)) {
      errors.push(`${label}: missing --color-${name}`);
    } else if (actual[name] !== value) {
      errors.push(`${label}: ${name} is ${actual[name]}, expected ${value}`);
    }
  }
  for (const name of Object.keys(actual)) {
    if (!(name in expected)) {
      errors.push(`${label}: unexpected colour "${name}" not present in @uixvisor/tokens`);
    }
  }
}

const { defaultTokens } = await import(
  new URL('../packages/tokens/dist/index.js', import.meta.url).href
);

const errors = [];

const themeSource = await readFile(join(root, THEME_FILE), 'utf-8');
for (const mode of ['light', 'dark']) {
  compare(
    `${THEME_FILE} (${mode})`,
    defaultTokens.colors[mode],
    parseThemeMode(themeSource, mode),
    errors,
  );
}

for (const file of CSS_FILES) {
  const css = await readFile(join(root, file), 'utf-8');
  compare(`${file} (light)`, defaultTokens.colors.light, parseCssMode(css, ':root'), errors);
  compare(`${file} (dark)`, defaultTokens.colors.dark, parseCssMode(css, '.dark:root'), errors);
}

// The icon adapter is the only file naming an icon library, so the semantic
// vocabulary in @uixvisor/tokens is what keeps components portable across
// libraries. An adapter missing a name would fail at render time, on whichever
// screen happens to use it.
const { semanticIconNames } = await import(
  new URL('../packages/tokens/dist/icons.js', import.meta.url).href
);

const ICON_ADAPTER = 'registry/primitives/icon/icon.tsx';
const adapterSource = await readFile(join(root, ICON_ADAPTER), 'utf-8');
const glyphBlock = adapterSource.slice(
  adapterSource.indexOf('const glyphs'),
  adapterSource.indexOf('\n};', adapterSource.indexOf('const glyphs')),
);
const mapped = new Set(
  [...glyphBlock.matchAll(/^\s{2}'?([a-z-]+)'?\s*:/gm)].map(([, name]) => name),
);

for (const name of semanticIconNames) {
  if (!mapped.has(name)) {
    errors.push(`${ICON_ADAPTER}: missing glyph for semantic name "${name}"`);
  }
}
for (const name of mapped) {
  if (!semanticIconNames.includes(name)) {
    errors.push(`${ICON_ADAPTER}: maps "${name}", which is not a semantic icon name`);
  }
}

if (errors.length > 0) {
  console.error('Design token drift detected:\n');
  for (const error of errors) {
    console.error(`  ${error}`);
  }
  process.exit(1);
}

console.log(`ok: ${CSS_FILES.length + 1} colour sources match @uixvisor/tokens`);
console.log(`ok: icon adapter covers all ${semanticIconNames.length} semantic names`);
