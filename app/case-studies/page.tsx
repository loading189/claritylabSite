import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { caseStudies } from '@/content/caseStudies';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Sample/demonstration case studies showing how Clarity Labs audits translate into measurable outcomes.',
};

export default function CaseStudiesPage() {
  return (
    <Section>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Case studies</h1>
        <p className="mt-4 max-w-3xl text-slate-700">
          These are sample/demonstration scenarios for service trades. They are realistic, but they do not represent named clients.
        </p>

        <div className="mt-8 grid gap-4">
          {caseStudies.map((study) => (
            <Card key={study.slug}>
              <Badge>{study.label}</Badge>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{study.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{study.summary}</p>
              <Link href={`/case-studies/${study.slug}`} className="mt-4 inline-block text-sm font-semibold no-underline">
                Read the case study →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
