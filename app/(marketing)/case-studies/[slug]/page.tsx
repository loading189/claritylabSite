import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { Section } from '@/components/Section';
import { TrackOnMount } from '@/components/TrackOnMount';
import { TrustList } from '@/components/TrustList';
import { caseStudies } from '@/content/caseStudies';
import styles from './page.module.css';

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
      <TrackOnMount eventName="case_study_view" props={{ slug: study.slug }} />
      <Section>
        <Container className={styles.heroContainer}>
          <p className={styles.label}>{study.label}</p>
          <h1 className={styles.title}>{study.title}</h1>
          <p className={styles.summary}>{study.summary}</p>

          <Card title="Snapshot" className="mt-8">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <strong>Industry:</strong> {study.snapshot.industry}
              </p>
              {study.snapshot.teamSize ? (
                <p>
                  <strong>Team size:</strong> {study.snapshot.teamSize}
                </p>
              ) : null}
              {study.snapshot.revenueRange ? (
                <p>
                  <strong>Revenue range:</strong> {study.snapshot.revenueRange}
                </p>
              ) : null}
              {study.snapshot.location ? (
                <p>
                  <strong>Location:</strong> {study.snapshot.location}
                </p>
              ) : null}
            </div>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container className={styles.threeColGrid}>
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
        <Container className={styles.heroContainer}>
          <Card title="Results (Sample metrics)">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className="pb-2">Metric</th>
                  <th className="pb-2">Before</th>
                  <th className="pb-2">After</th>
                </tr>
              </thead>
              <tbody>
                {study.metrics.map((item) => (
                  <tr key={item.metric} className={styles.tableBodyRow}>
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

      <Section>
        <Container className={styles.twoColGrid}>
          <Card title="How this engagement started">
            <p className="text-sm text-muted">
              This team started with a short Clarity Call, then an audit to
              identify the operational and cash flow issues creating the most
              drag.
            </p>
            <Button href="/work-with-me" className="mt-4">
              See how to work with me
            </Button>
          </Card>
          <TrustList />
        </Container>
      </Section>

      <Section className={styles.ctaSection}>
        <Container className={styles.ctaContainer}>
          <NextStepCTA
            title="Want this level of clarity in your business?"
            subtitle="No pitch • Just clarity. Start with a quick call and a sample report review."
            trackingEvent="booking_click"
            trackingPage="case_study"
          />
        </Container>
      </Section>
    </>
  );
}
