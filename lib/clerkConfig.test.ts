import assert from 'node:assert/strict';
import test from 'node:test';
import { getClerkConfig } from '@/lib/clerkConfig';

test('getClerkConfig supports marketing-safe mode', () => {
  const original = { ...process.env };
  delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  delete process.env.CLERK_SECRET_KEY;

  const config = getClerkConfig();
  assert.equal(config.clerkEnvPresent, false);
  assert.equal(config.middlewareProtectedMode, 'marketing_safe');

  process.env = original;
});
