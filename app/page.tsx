import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { HeroBackdrop } from '@/components/HeroBackdrop';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { Reveal } from '@/components/Reveal';
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
        <Container className="relative overflow-hidden rounded-card border border-border/70 bg-surface p-8 shadow-raised sm:p-12">
          <HeroBackdrop />
          <div className="relative z-10">
            <Reveal>
              <Badge>Operator brief · Fargo-built for service trades</Badge>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-6xl">
                Audit-grade clarity for owner-operators who need control, not noise.
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
                No pitch. Just clear deliverables. We surface hidden leaks in
                margin, cash flow, and handoff execution—then hand your team a
                practical plan.
              </p>
            </Reveal>
            <Reveal delay={200}>
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
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-4 text-sm text-muted">
                {siteConfig.trustLine} · Typically 2–3 meaningful leaks identified
                in your first review.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="py-8">
        <Container className="grid gap-4 md:grid-cols-3">
          {waysIHelp.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <Card title={item.title} interactive>
                <p>{item.description}</p>
              </Card>
            </Reveal>
          ))}
          <Reveal delay={200}>
            <Card title="Ways I Help" interactive>
              <p>
                See the full engagement options and choose the right starting
                point for your team.
              </p>
              <Button href="/work-with-me" className="mt-4">
                Explore Work With Me
              </Button>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <Card title="Common pressure points">
              <FeatureList items={problems} />
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card title="What we do in 15 minutes">
              <div className="space-y-4">
                {fifteenMinuteBreakdown.map((item) => (
                  <div key={item.title}>
                    <p className="text-sm font-semibold text-text">{item.title}</p>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              title="Proof and tools"
              subtitle="What teams use right away: concrete examples, practical toolkits, and repeatable wins."
            />
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Reveal>
              <Card title="Case studies" interactive>
                <p className="text-sm text-muted">
                  Walk through sample/demonstration audits for service trade teams
                  and see how findings turn into results.
                </p>
                <Button href="/case-studies" className="mt-4">
                  See case studies
                </Button>
              </Card>
            </Reveal>
            <Reveal delay={80}>
              <Card title="Resources" interactive>
                <p className="text-sm text-muted">
                  Download practical checklists and scorecards you can use this
                  week with your office and field leads.
                </p>
                <Button href="/resources" className="mt-4">
                  Browse resources
                </Button>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              title="Example insights from the audit"
              subtitle="These are the types of practical outputs you can expect. No vanity dashboards, just actionable clarity."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
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

      <Section>
        <Container>
          <Reveal>
            <SectionHeader title="How we work" />
          </Reveal>
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
          <Reveal>
            <TrustList />
          </Reveal>
        </Container>
      </Section>

      <CalloutCTA />
    </>
  );
}
