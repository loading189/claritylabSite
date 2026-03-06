import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeHtml } from '@/lib/email';

test('escapeHtml escapes html-sensitive characters', () => {
  assert.equal(
    escapeHtml(`<script>alert('x') & "y"</script>`),
    '&lt;script&gt;alert(&#39;x&#39;) &amp; &quot;y&quot;&lt;/script&gt;',
  );
});
