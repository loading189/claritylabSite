import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BOOKING_SOURCES,
  normalizeSingleSelect,
  requireFields,
  safeJoinedText,
  safeJsonString,
} from '@/lib/airtableSchema';

test('normalizeSingleSelect supports exact, case-insensitive, and alias mappings', () => {
  assert.equal(normalizeSingleSelect('direct', BOOKING_SOURCES, 'direct'), 'direct');
  assert.equal(normalizeSingleSelect('LinkedIn', BOOKING_SOURCES, 'direct'), 'linkedin');
  assert.equal(
    normalizeSingleSelect('visibleToClient', ['draft', 'internal', 'client_visible'] as const, 'draft', {
      visibleToClient: 'client_visible',
    }),
    'client_visible',
  );
  assert.equal(normalizeSingleSelect('unknown-source', BOOKING_SOURCES, 'direct'), 'direct');
});

test('requireFields reports missing keys without treating 0/false as missing', () => {
  const ok = requireFields({ a: 'x', b: 0, c: false }, ['a', 'b', 'c']);
  assert.deepEqual(ok, { ok: true });

  const missing = requireFields({ a: 'x', b: '' }, ['a', 'b', 'c']);
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.deepEqual(missing.missing, ['b', 'c']);
  }
});

test('safeJsonString serializes objects and protects invalid JSON strings', () => {
  assert.equal(safeJsonString({ a: 1 }), '{"a":1}');
  assert.equal(safeJsonString('{"a":2}'), '{"a":2}');
  assert.equal(safeJsonString('not-json'), '"not-json"');
});

test('safeJoinedText joins arrays and handles non-arrays safely', () => {
  assert.equal(safeJoinedText(['A', ' B ', '', null], ', '), 'A, B');
  assert.equal(safeJoinedText('already string', ', '), 'already string');
  assert.equal(safeJoinedText(undefined, ', '), '');
});
