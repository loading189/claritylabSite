import { MetadataRoute } from 'next';
import { caseStudies } from '@/content/caseStudies';
import { resources } from '@/content/resources';
import { siteConfig } from '@/content/site';
import { getAllInsights } from '@/lib/content/insights';

export default function sitemap(): MetadataRoute.Sitemap {
  const insightRoutes = getAllInsights().map(
    (post) => `/insights/${post.slug}`,
  );

  const routes = [
    '/',
    '/audit',
    '/work-with-me',
    '/process',
    '/insights',
    '/about',
    '/contact',
    '/sample-report',
    '/case-studies',
    '/resources',
    ...insightRoutes,
    ...caseStudies.map((study) => `/case-studies/${study.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
