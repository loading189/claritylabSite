import { Metadata } from 'next';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { ResourceRequestForm } from '@/components/ResourceRequestForm';
import { Section } from '@/components/Section';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { SectionHeader } from '@/components/marketing/SectionHeader';
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
        <SectionHeader
          eyebrow="Resource"
          title={resource.title}
          subtitle={resource.valueProp}
        />

        <div className="mt-sectionGap grid gap-4">
          <Card title="What’s inside" neumorphic>
            <FeatureList items={resource.includes} />
          </Card>

          <Card title="Who it’s for" neumorphic>
            <FeatureList
              items={[
                'Owners with growing AR over the last 2-3 months',
                'Office teams that need a repeatable weekly collections rhythm',
                'Operators who want stronger cash timing without aggressive client friction',
              ]}
            />
          </Card>

          <Card title="Get access" neumorphic>
            <ResourceRequestForm
              resourceSlug="ar-recovery-checklist"
              fallbackDownloadUrl={runtimeConfig.resources.arUrl}
              siteEmail={siteConfig.email}
            />
          </Card>

          <Card neumorphic>
            <NextStepCTA trackingPage="resource_ar_checklist" />
          </Card>
        </div>
      </Container>
    </Section>
  );
}
