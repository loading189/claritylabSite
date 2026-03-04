import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { TrackOnMount } from '@/components/TrackOnMount';
import { TrustList } from '@/components/TrustList';
import { StartIntakeSection } from '@/components/StartIntakeSection';

export const metadata: Metadata = {
  title: 'Process',
  description:
    'See exactly how a Clarity Call turns into an action plan and implementation support.',
};

const processSteps = [
  {
    title: 'Clarity Call',
    description:
      'A focused 15-minute conversation so we can understand pressure points and decide if there is a fit.',
  },
  {
    title: 'Audit',
    description:
      'Deep review of financial and operational workflows to identify where cash, margin, and execution are leaking.',
  },
  {
    title: 'Action Plan',
    description:
      'You get a prioritized roadmap with practical fixes, owners, and near-term milestones.',
  },
  {
    title: 'Implementation',
    description:
      'Optional support to put the highest-impact changes in place with your team.',
  },
];

export default function ProcessPage() {
  return (
    <>
      <TrackOnMount eventName="process_page_view" />
      <Section>
        <Container className="max-w-4xl">
          <Reveal>
            <h1 className="text-4xl font-semibold tracking-tight text-text">
              Process
            </h1>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-4 max-w-3xl text-muted">
            No confusing consulting cycle. We keep this simple: quick context,
            deep analysis, practical plan, and optional help executing.
            </p>
          </Reveal>
          <div className="mt-8">
            <ProcessTimeline steps={processSteps} />
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="max-w-3xl">
          <TrustList />
          <StartIntakeSection where="process" />
        </Container>
      </Section>
    </>
  );
}
