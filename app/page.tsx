import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { HeroBackdrop } from '@/components/HeroBackdrop';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import {
  exampleInsights,
  howItWorks,
  problems,
  siteConfig,
} from '@/content/site';
import { getAllInsights } from '@/lib/content/insights';

const findings = [
  'Revenue concentration: top 3 customers account for 48% of monthly cash inflow.',
  'Invoice lag: average 5.8 days between job completion and invoice send.',
  'Dispatch drag: 11% of technician hours lost to avoidable routing and handoff delays.',
];

export default function HomePage() {
  const posts = getAllInsights().slice(0, 3);

  return (
    <>
      <Section className="pb-10 pt-12 sm:pt-16">
        <Container className="relative overflow-hidden rounded-card border border-accent/40 bg-surface p-8 shadow-raised sm:p-12">
          <HeroBackdrop />
          <Reveal>
            <Badge>Clarity Labs Audit</Badge>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="relative mt-5 max-w-4xl text-balance text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1.03] text-text">
              We diagnose exactly where cash, capacity, and execution break down
              in your service business.
            </h1>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">
              Conversion-focused operational audits for teams that want concrete
              fixes, stronger margin control, and cleaner execution.
            </p>
          </Reveal>
          <Reveal delay={170}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href={siteConfig.calendlyUrl || '/contact'}
                trackingEvent="booking_click"
                trackingProps={{ page: 'home_hero' }}
              >
                Book Audit
              </Button>
              <Button href="/sample-report" variant="ghost">
                View Sample Report
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="section-divider py-8" id="problem">
        <Container>
          <SectionHeader
            title="Operational problems we find first"
            subtitle="Three common patterns that silently reduce profitability and growth capacity."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {problems.slice(0, 3).map((problem, index) => (
              <Reveal key={problem} delay={index * 70}>
                <Card interactive>
                  <h3 className="text-xl font-semibold text-text">
                    0{index + 1}
                  </h3>
                  <p className="mt-3 text-sm text-muted">{problem}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="section-divider" id="method">
        <Container>
          <SectionHeader
            title="The Clarity Labs Process"
            subtitle="A four-step method designed for owners who need signal, action, and sustained control."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <Reveal key={item.step} delay={index * 60}>
                <Card interactive>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-text">
                    {item.step}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="section-divider" id="findings">
        <Container>
          <SectionHeader
            title="Example findings from audits"
            subtitle="Real insights that create decisions in days, not months."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {findings.map((finding, index) => (
              <Reveal key={finding} delay={index * 50}>
                <Card>
                  <p>{finding}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {exampleInsights.map((insight, index) => (
              <Reveal key={insight.title} delay={index * 70}>
                <Card title={insight.title}>
                  <FeatureList items={insight.bullets} />
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="section-divider" id="sample-report">
        <Container>
          <Reveal>
            <Card className="border-accent/35 bg-gradient-subtle">
              <h2 className="text-3xl font-bold text-text">
                Sample Report Preview
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                Download the sample report to see the structure, scorecards, and
                recommendation format we deliver.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/sample-report">View Sample Report</Button>
                <Button
                  href={siteConfig.calendlyUrl || '/contact'}
                  variant="ghost"
                  trackingEvent="booking_click"
                  trackingProps={{ page: 'home_sample_preview' }}
                >
                  Book Audit
                </Button>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section className="section-divider" id="insights">
        <Container>
          <SectionHeader
            title="Latest insights"
            subtitle="Short tactical writing on cash flow, workflow, and operational execution."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 70}>
                <Card interactive>
                  <p className="text-xs uppercase tracking-[0.14em] text-accent">
                    {post.tags[0]}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-text">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{post.description}</p>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="mt-4 inline-block text-sm font-semibold no-underline"
                  >
                    Read insight →
                  </Link>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CalloutCTA trackingPage="home_callout" />
    </>
  );
}
