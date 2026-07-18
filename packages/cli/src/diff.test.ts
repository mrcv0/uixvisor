import { test } from 'node:test';
import assert from 'node:assert/strict';

import { diffLines } from './diff.js';

test('reports no changes for identical text', () => {
  const result = diffLines('a\nb\nc', 'a\nb\nc');
  assert.deepEqual(result, [
    { type: 'context', text: 'a' },
    { type: 'context', text: 'b' },
    { type: 'context', text: 'c' },
  ]);
});

test('detects a single changed line as remove+add', () => {
  const result = diffLines('a\nb\nc', 'a\nx\nc');
  assert.deepEqual(result, [
    { type: 'context', text: 'a' },
    { type: 'remove', text: 'b' },
    { type: 'add', text: 'x' },
    { type: 'context', text: 'c' },
  ]);
});

test('detects an added line', () => {
  const result = diffLines('a\nc', 'a\nb\nc');
  assert.deepEqual(result, [
    { type: 'context', text: 'a' },
    { type: 'add', text: 'b' },
    { type: 'context', text: 'c' },
  ]);
});

test('detects a removed line', () => {
  const result = diffLines('a\nb\nc', 'a\nc');
  assert.deepEqual(result, [
    { type: 'context', text: 'a' },
    { type: 'remove', text: 'b' },
    { type: 'context', text: 'c' },
  ]);
});
