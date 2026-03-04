import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { ProcessTimeline } from '@/components/ProcessTimeline';
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
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Process
          </h1>
          <p className="mt-4 max-w-3xl text-slate-700">
            No confusing consulting cycle. We keep this simple: quick context,
            deep analysis, practical plan, and optional help executing.
          </p>
          <div className="mt-8">
            <ProcessTimeline steps={processSteps} />
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="max-w-3xl">
          <TrustList />
          <StartIntakeSection where="process" />
        </Container>
      </Section>
    </>
  );
}
