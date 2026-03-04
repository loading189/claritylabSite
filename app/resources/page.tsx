import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { NewsletterForm } from '@/components/NewsletterForm';
import { Section } from '@/components/Section';
import { resources } from '@/content/resources';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Practical checklists and templates for service trade operators.',
};

export default function ResourcesPage() {
  return (
    <Section>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Resources for trades/service operators</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          No pitch • Just clarity. Download practical tools you can use this week to tighten cash flow and workflows.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.slug} title={resource.title}>
              <p className="text-sm text-slate-700">{resource.summary}</p>
              <Button href={`/resources/${resource.slug}`} className="mt-4">
                Request this resource
              </Button>
            </Card>
          ))}
        </div>

        <Card title="Operator updates" className="mt-8">
          <p className="text-sm text-slate-700">Short practical notes for trades/service owners. Not accounting or legal advice; operational guidance.</p>
          <NewsletterForm />
        </Card>
      </Container>
    </Section>
  );
}
