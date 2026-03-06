import assert from 'node:assert/strict';
import test from 'node:test';
import { isAdminFromClerkUser } from '@/lib/auth/admin';

test('isAdminFromClerkUser accepts top-level role', () => {
  assert.equal(isAdminFromClerkUser({ role: 'admin' }), true);
});

test('isAdminFromClerkUser accepts publicMetadata role', () => {
  assert.equal(
    isAdminFromClerkUser({ publicMetadata: { role: 'admin' } }),
    true,
  );
});

test('isAdminFromClerkUser accepts public_metadata role', () => {
  assert.equal(
    isAdminFromClerkUser({ public_metadata: { role: 'admin' } }),
    true,
  );
});

test('isAdminFromClerkUser falls back to owner email', () => {
  assert.equal(
    isAdminFromClerkUser(
      { primaryEmailAddress: { emailAddress: 'OWNER@EXAMPLE.COM' } },
      'owner@example.com',
    ),
    true,
  );
});

test('isAdminFromClerkUser returns false for non-admin', () => {
  assert.equal(
    isAdminFromClerkUser(
      { primaryEmailAddress: { emailAddress: 'client@example.com' } },
      'owner@example.com',
    ),
    false,
  );
});
