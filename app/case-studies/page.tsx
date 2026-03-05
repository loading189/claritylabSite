import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { caseStudies } from '@/content/caseStudies';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Pattern-based case studies showing common cash and capacity failures in service businesses and how they get fixed.',
};

export default function CaseStudiesPage() {
  return (
    <Section>
      <Container className="max-w-5xl">
        <Reveal>
          <SectionHeader
            eyebrow="Case Studies"
            title="Pattern-based case studies"
            subtitle="These are anonymized field patterns. They are realistic scenarios, not named client stories."
          />
        </Reveal>

        <div className="mt-sectionGap grid gap-4">
          {caseStudies.map((study, index) => (
            <Reveal key={study.slug} delay={index * 70}>
              <Card neumorphic>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent2">{study.label}</p>
                <h2 className="mt-3 text-xl font-semibold text-text">{study.title}</h2>
                <p className="mt-2 text-sm text-muted">{study.summary}</p>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="mt-4 inline-block text-sm font-semibold no-underline"
                >
                  Read the case study →
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>

        <Card className="mt-sectionGap" neumorphic>
          <NextStepCTA trackingPage="case_studies" />
        </Card>
      </Container>
    </Section>
  );
}
