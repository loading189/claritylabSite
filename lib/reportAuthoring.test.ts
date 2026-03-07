import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeReportPublishState, parseAuthoredReportContent } from '@/lib/reportAuthoring';

test('normalizeReportPublishState handles new and legacy states', () => {
  assert.equal(normalizeReportPublishState('draft'), 'draft');
  assert.equal(normalizeReportPublishState('internalOnly'), 'internal');
  assert.equal(normalizeReportPublishState('visibleToClient'), 'client_visible');
});

test('parseAuthoredReportContent reads valid json strings', () => {
  const parsed = parseAuthoredReportContent(
    JSON.stringify({
      subtitle: 'Quarter review',
      executiveSummary: 'Here is the executive summary.',
      keyFindings: [{ area: 'Ops', finding: 'Work is reactive.', impact: 'high' }],
    }),
  );

  assert.ok(parsed);
  assert.equal(parsed?.subtitle, 'Quarter review');
  assert.equal(parsed?.keyFindings?.[0]?.impact, 'high');
});
