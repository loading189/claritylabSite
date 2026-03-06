import assert from 'node:assert/strict';
import test from 'node:test';

function loadRoute() {
  return import('@/app/api/webhooks/calendly/route');
}

test('webhook returns skipped when signing key missing', async () => {
  const original = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  delete process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  const { POST } = await loadRoute();
  const response = await POST(
    new Request('http://localhost:3000/api/webhooks/calendly', {
      method: 'POST',
      body: JSON.stringify({ event: 'invitee.created' }),
    }),
  );
  const payload = (await response.json()) as { skipped?: string };
  assert.equal(response.status, 200);
  assert.equal(payload.skipped, 'no_signing_key');
  if (original) process.env.CALENDLY_WEBHOOK_SIGNING_KEY = original;
});
