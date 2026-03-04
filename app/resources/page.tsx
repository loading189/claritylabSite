import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { resources } from '@/content/resources';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Downloadable tools for HVAC, plumbing, electrical, and mechanical operators.',
};

export default function ResourcesPage() {
  return (
    <Section>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Resources</h1>
        <p className="mt-4 max-w-3xl text-slate-700">Download practical templates built for service trades. No pitch • Just clarity.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.slug} title={resource.title}>
              <p className="text-sm text-slate-700">{resource.summary}</p>
              <Link href={`/resources/${resource.slug}`} className="mt-4 inline-block text-sm font-semibold no-underline">
                Open resource →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
