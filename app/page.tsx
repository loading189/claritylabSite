import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { Section } from '@/components/Section';
import { TrustList } from '@/components/TrustList';
import { SectionHeader } from '@/components/SectionHeader';
import {
  exampleInsights,
  fifteenMinuteBreakdown,
  howItWorks,
  problems,
  siteConfig,
  waysIHelp,
} from '@/content/site';

export default function HomePage() {
  return (
    <>
      <Section className="pb-12 pt-12 sm:pt-16">
        <Container className="rounded-card border border-border/70 bg-surface p-8 shadow-raised sm:p-12">
          <Badge>Operator brief · Fargo-built for service trades</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-6xl">
            Audit-grade clarity for owner-operators who need control, not noise.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
            No pitch. Just clear deliverables. We surface hidden leaks in
            margin, cash flow, and handoff execution—then hand your team a
            practical plan.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              href={siteConfig.calendlyUrl || '/contact'}
              trackingEvent="booking_click"
              trackingProps={{ page: 'home_hero' }}
            >
              Book a 15-min Clarity Call
            </Button>
            <Button href="/sample-report" variant="ghost">
              Review the sample report
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            {siteConfig.trustLine} · Typically 2–3 meaningful leaks identified
            in your first review.
          </p>
        </Container>
      </Section>

      <Section className="py-8">
        <Container className="grid gap-4 md:grid-cols-3">
          {waysIHelp.map((item) => (
            <Card key={item.title} title={item.title} interactive>
              <p>{item.description}</p>
            </Card>
          ))}
          <Card title="Ways I Help" interactive>
            <p>
              See the full engagement options and choose the right starting
              point for your team.
            </p>
            <Button href="/work-with-me" className="mt-4">
              Explore Work With Me
            </Button>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 md:grid-cols-2">
          <Card title="Common pressure points">
            <FeatureList items={problems} />
          </Card>
          <Card title="What we do in 15 minutes">
            <div className="space-y-4">
              {fifteenMinuteBreakdown.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-text">
                    {item.title}
                  </p>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            title="Proof and tools"
            subtitle="What teams use right away: concrete examples, practical toolkits, and repeatable wins."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card title="Case studies" interactive>
              <p className="text-sm text-muted">
                Walk through sample/demonstration audits for service trade teams
                and see how findings turn into results.
              </p>
              <Button href="/case-studies" className="mt-4">
                See case studies
              </Button>
            </Card>
            <Card title="Resources" interactive>
              <p className="text-sm text-muted">
                Download practical checklists and scorecards you can use this
                week with your office and field leads.
              </p>
              <Button href="/resources" className="mt-4">
                Browse resources
              </Button>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            title="Example insights from the audit"
            subtitle="These are the types of practical outputs you can expect. No vanity dashboards, just actionable clarity."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {exampleInsights.map((insight) => (
              <Card key={insight.title} title={insight.title}>
                <FeatureList items={insight.bullets} />
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader title="How we work" />
          <div className="mt-6">
            <ProcessTimeline
              steps={howItWorks.map((item) => ({
                title: item.step,
                description: item.description,
              }))}
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <TrustList />
        </Container>
      </Section>

      <CalloutCTA />
    </>
  );
}
