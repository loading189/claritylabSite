import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { CalloutCTA } from '@/components/CalloutCTA';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Section } from '@/components/Section';
import { exampleInsights, fifteenMinuteBreakdown, howItWorks, problems, siteConfig, waysIHelp } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <Section className="pb-10 pt-12 sm:pt-16">
        <Container>
          <Badge>For service businesses: HVAC, plumbing, electrical, mechanical</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Clean up what is happening behind the scenes, so owners can breathe again.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-700 sm:text-lg">
            I help service business owners find hidden leaks in cash flow and operations, then turn those findings into
            a simple plan your team can execute.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.calendlyUrl}>Book a 15-minute coffee chat</Button>
            <Button href="/audit" variant="ghost">
              See the quick audit
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">{siteConfig.trustLine}</p>
        </Container>
      </Section>

      <Section className="py-8">
        <Container className="grid gap-4 md:grid-cols-3">
          {waysIHelp.map((item) => (
            <Card key={item.title} title={item.title}>
              <p>{item.description}</p>
            </Card>
          ))}
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
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <h2 className="text-2xl font-semibold text-slate-900">Example insights from the audit</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            These are the types of practical outputs you can expect. No vanity dashboards, just actionable clarity.
          </p>
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
          <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <Card key={item.step} title={`${index + 1}. ${item.step}`}>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CalloutCTA />
    </>
  );
}
