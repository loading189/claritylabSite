import { MetadataRoute } from 'next';
import { caseStudies } from '@/content/caseStudies';
import { resources } from '@/content/resources';
import { siteConfig } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/audit',
    '/insights',
    '/about',
    '/contact',
    '/sample-report',
    '/case-studies',
    '/resources',
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
