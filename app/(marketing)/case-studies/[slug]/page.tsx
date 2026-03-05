import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DataMotif } from '@/components/brand/DataMotif';
import { BrandIcon } from '@/components/brand/iconMap';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { TrackOnMount } from '@/components/TrackOnMount';
import { caseStudies } from '@/content/caseStudies';
import { siteConfig } from '@/content/site';
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
    title: `${study.title} | Case Study`,
    description: study.summary,
    alternates: {
      canonical: `${siteConfig.url}/case-studies/${study.slug}`,
    },
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
        <Container className={`${styles.heroContainer} ${styles.heroShell}`}>
          <p className={styles.label}>
            <BrandIcon
              concept="proof"
              size={14}
              className="mr-1 inline-block"
            />
            {study.label}
          </p>
          <h1 className={styles.title}>{study.title}</h1>
          <p className={styles.summary}>{study.outcome}</p>
          <div className={styles.ctaRow}>
            <Button href="/audit">Book Audit</Button>
            <Button href="/sample-report" variant="ghost">
              View Sample Report
            </Button>
          </div>
          <div className={styles.chipRow}>
            {study.metricChips.map((chip) => (
              <span key={chip} className={styles.metricChip}>
                <BrandIcon concept="signal" size={13} className="mr-1.5" />
                {chip}
                <DataMotif variant="ticks" className="ml-2" />
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className={styles.stack}>
          <Reveal>
            <Card title="Before">
              <FeatureList items={study.before} />
            </Card>
          </Reveal>
          <Reveal delay={70}>
            <Card title="What we found">
              <FeatureList items={study.findings} />
            </Card>
          </Reveal>
          <Reveal delay={110}>
            <Card title="Fix plan (30/60/90)">
              <div className="space-y-3">
                {study.fixPlan.map((item) => (
                  <div key={item.window}>
                    <p className="text-sm font-semibold text-text">
                      {item.window}
                    </p>
                    <p className="mt-1 text-sm text-muted">{item.action}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal delay={150}>
            <Card title="Result">
              <FeatureList items={study.result} />
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className={`${styles.heroContainer} ${styles.heroShell}`}>
          <Card className={styles.nextCard}>
            <h2 className="text-2xl font-semibold text-text">
              What to do next
            </h2>
            <p className="mt-2 text-sm text-muted">
              If this pattern looks familiar, start with an audit and compare
              your current system to the sample deliverable.
            </p>
            <div className={styles.ctaRow}>
              <Button href="/audit">Book Audit</Button>
              <Button href="/sample-report" variant="ghost">
                View Sample Report
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">{study.disclaimer}</p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
