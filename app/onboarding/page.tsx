import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { TrackOnMount } from '@/components/TrackOnMount';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'How Clarity Labs onboarding works, what to prepare, and where to start your intake.',
};

export default function OnboardingPage() {
  return (
    <>
      <TrackOnMount eventName="onboarding_view" />
      <Section>
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Onboarding that keeps it simple.</h1>
          <p className="mt-4 text-slate-700">No pitch • Just clarity. We qualify fit, collect the right context, then show up prepared.</p>
          <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Pick your intake path (call or audit).</li>
            <li>Answer structured questions so we can skip small talk.</li>
            <li>If audit, share docs through a secure upload link.</li>
            <li>Get confirmation + prep checklist instantly.</li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/intake/call" trackingEvent="intake_cta_click" trackingProps={{ where: 'onboarding', type: 'call' }}>
              Start Clarity Call Intake
            </Button>
            <Button href="/intake/audit" variant="secondary" trackingEvent="intake_cta_click" trackingProps={{ where: 'onboarding', type: 'audit' }}>
              Start Audit Intake
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
