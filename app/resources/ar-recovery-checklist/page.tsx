import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { FormEmbed } from '@/components/FormEmbed';
import { Section } from '@/components/Section';
import { resources } from '@/content/resources';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';

const resource = resources.find((item) => item.slug === 'ar-recovery-checklist');

export const metadata: Metadata = {
  title: 'AR Recovery Checklist',
  description: resource?.summary,
};

export default function ARRecoveryChecklistPage() {
  if (!resource) {
    return null;
  }

  return (
    <Section>
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{resource.title}</h1>
        <p className="mt-4 text-slate-700">{resource.valueProp}</p>

        <Card title="What’s inside" className="mt-6">
          <FeatureList items={resource.includes} />
        </Card>

        <Card title="Get access" className="mt-4">
          {runtimeConfig.forms.hasContactForm ? (
            <>
              <p className="mb-4 text-sm text-slate-700">Submit the form, then use the download link below.</p>
              <FormEmbed src={runtimeConfig.forms.contactUrl} title="Contact form for resource access" />
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Form embed is not enabled. Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we’ll send it over.
            </p>
          )}

          {runtimeConfig.resources.hasArRecovery ? (
            <Button href={runtimeConfig.resources.arRecoveryUrl} className="mt-4">
              Get the download
            </Button>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Set NEXT_PUBLIC_RESOURCE_AR_URL to enable direct download.</p>
          )}

          <p className="mt-4 text-sm text-slate-600">
            Manual fallback:{' '}
            <a href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(resource.followUpSubject)}`}>
              Email us for the file
            </a>
            .
          </p>
        </Card>
      </Container>
    </Section>
  );
}
