import { ImageResponse } from 'next/og';
import { getInsightBySlug } from '@/lib/content/insights';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { slug: string } }) {
  const post = getInsightBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f172a',
          color: 'white',
          padding: '56px',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.9 }}>Clarity Labs</div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: '95%',
          }}
        >
          {post?.title || 'Insight'}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 30, opacity: 0.85 }}>
            Less chaos. More time.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(post?.tags || []).slice(0, 2).map((tag) => (
              <div
                key={tag}
                style={{
                  borderRadius: 999,
                  background: '#1e293b',
                  color: '#cbd5e1',
                  padding: '10px 16px',
                  fontSize: 22,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
