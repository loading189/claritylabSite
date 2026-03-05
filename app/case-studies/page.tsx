import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { DataMotif } from '@/components/brand/DataMotif';
import { BrandIcon } from '@/components/brand/iconMap';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
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
          <h1 className="inline-flex items-center gap-2 text-4xl font-semibold tracking-tight text-text">
            <BrandIcon concept="proof" variant="yellow" />
            Case studies
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 max-w-3xl text-muted">
            These are anonymized pattern examples based on recurring field
            conditions. They are realistic scenarios, not named client stories.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4">
          {caseStudies.map((study, index) => (
            <Reveal key={study.slug} delay={index * 70}>
              <Card>
                <Badge>{study.label}</Badge>
                <h2 className="mt-3 inline-flex items-center gap-2 text-xl font-semibold text-text">
                  <BrandIcon concept="proof" size={16} />
                  {study.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{study.summary}</p>
                <DataMotif variant="ticks" className="mt-2" />
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
      </Container>
    </Section>
  );
}
