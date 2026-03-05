import { Metadata } from 'next';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { ResourceRequestForm } from '@/components/ResourceRequestForm';
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
  if (!resource) return null;

  return (
    <Section>
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{resource.title}</h1>
        <p className="mt-4 text-slate-700">{resource.valueProp}</p>

        <Card title="What’s inside" className="mt-6">
          <FeatureList items={resource.includes} />
        </Card>

        <Card title="Who it’s for" className="mt-4">
          <FeatureList
            items={[
              'Owners with growing AR over the last 2-3 months',
              'Office teams that need a repeatable weekly collections rhythm',
              'Operators who want stronger cash timing without aggressive client friction',
            ]}
          />
        </Card>

        <Card title="Get access" className="mt-4">
          <ResourceRequestForm
            resourceSlug="ar-recovery-checklist"
            fallbackDownloadUrl={runtimeConfig.resources.arUrl}
            siteEmail={siteConfig.email}
          />
        </Card>
      </Container>
    </Section>
  );
}
