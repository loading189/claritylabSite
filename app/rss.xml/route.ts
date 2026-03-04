import { getAllInsights } from '@/lib/content/insights';
import { siteConfig } from '@/content/site';

export async function GET() {
  const items = getAllInsights()
    .map(
      (post) => `<item>
  <title><![CDATA[${post.title}]]></title>
  <description><![CDATA[${post.description}]]></description>
  <link>${siteConfig.url}/insights/${post.slug}</link>
  <guid>${siteConfig.url}/insights/${post.slug}</guid>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${siteConfig.name} Insights</title>
  <description>${siteConfig.description}</description>
  <link>${siteConfig.url}/insights</link>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
