import { Card } from './Card';

type ProcessStep = {
  title: string;
  description: string;
};

type ProcessTimelineProps = {
  steps: ProcessStep[];
};

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <Card key={step.title} title={`Step ${index + 1} — ${step.title}`}>
          <p>{step.description}</p>
        </Card>
      ))}
    </div>
  );
}
