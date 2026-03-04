import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Section } from '@/components/Section';
import { caseStudies } from '@/content/caseStudies';
import { siteConfig } from '@/content/site';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const study = caseStudies.find((item) => item.slug === params.slug);

  if (!study) {
    return { title: 'Case Study' };
  }

  return {
    title: study.title,
    description: study.summary,
  };
}

export default function CaseStudyDetailPage({ params }: Props) {
  const study = caseStudies.find((item) => item.slug === params.slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      <Section>
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{study.label}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{study.title}</h1>
          <p className="mt-3 max-w-3xl text-slate-700">{study.summary}</p>

          <Card title="Snapshot" className="mt-8">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p><strong>Industry:</strong> {study.snapshot.industry}</p>
              {study.snapshot.teamSize ? <p><strong>Team size:</strong> {study.snapshot.teamSize}</p> : null}
              {study.snapshot.revenueRange ? <p><strong>Revenue range:</strong> {study.snapshot.revenueRange}</p> : null}
              {study.snapshot.location ? <p><strong>Location:</strong> {study.snapshot.location}</p> : null}
            </div>
          </Card>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid gap-4 md:grid-cols-3">
          <Card title="Symptoms">
            <FeatureList items={study.symptoms} />
          </Card>
          <Card title="Root causes">
            <FeatureList items={study.rootCauses} />
          </Card>
          <Card title="What we did">
            <FeatureList items={study.actions} />
          </Card>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-5xl">
          <Card title="Results (Sample metrics)">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-2">Metric</th>
                  <th className="pb-2">Before</th>
                  <th className="pb-2">After</th>
                </tr>
              </thead>
              <tbody>
                {study.metrics.map((item) => (
                  <tr key={item.metric} className="border-t border-slate-100">
                    <td className="py-2">{item.metric}</td>
                    <td className="py-2">{item.before}</td>
                    <td className="py-2">{item.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="What you’d get" className="mt-4">
            <FeatureList items={study.deliverables} />
          </Card>
        </Container>
      </Section>

      <Section className="bg-brand-900">
        <Container className="flex flex-col gap-3 py-10 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Want this level of clarity in your business?</h2>
            <p className="mt-1 text-sm text-brand-100">No pitch • Just clarity. Start with a quick call and a sample report review.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button href={siteConfig.calendlyUrl || '/contact'} variant="secondary" className="bg-white text-brand-900 hover:bg-brand-100">
              Book a call
            </Button>
            <Button href="/sample-report" variant="ghost" className="border-white text-white hover:bg-brand-800">
              See sample report
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
