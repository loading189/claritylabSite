import assert from 'node:assert/strict';
import test from 'node:test';
import {
  resolveAppRole,
  resolveClerkEmail,
  resolveClerkRole,
} from '@/lib/clerkRole';

test('resolveClerkRole returns top-level role first', () => {
  const role = resolveClerkRole({
    role: 'admin',
    public_metadata: { role: 'client' },
    publicMetadata: { role: 'client' },
  });

  assert.equal(role, 'admin');
});

test('resolveClerkRole reads public_metadata.role', () => {
  const role = resolveClerkRole({ public_metadata: { role: 'admin' } });

  assert.equal(role, 'admin');
});

test('resolveClerkRole reads publicMetadata.role', () => {
  const role = resolveClerkRole({ publicMetadata: { role: 'admin' } });

  assert.equal(role, 'admin');
});

test('resolveAppRole falls back to OWNER_EMAIL when no role exists', () => {
  const role = resolveAppRole(
    { primary_email_address: 'OWNER@EXAMPLE.COM' },
    'owner@example.com',
  );

  assert.equal(role, 'admin');
});

test('resolveAppRole returns client when role is missing and email does not match owner', () => {
  const role = resolveAppRole(
    { email_address: 'client@example.com' },
    'owner@example.com',
  );

  assert.equal(role, 'client');
});

test('resolveClerkEmail checks email priority order', () => {
  const email = resolveClerkEmail({
    email: 'DIRECT@EXAMPLE.COM',
    primary_email_address: 'primary@example.com',
    email_address: 'secondary@example.com',
  });

  assert.equal(email, 'direct@example.com');
});
