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
        <Card
          key={step.title}
          title={`Step ${index + 1} — ${step.title}`}
          className="relative pl-12"
        >
          <span
            className="absolute left-5 top-7 h-2.5 w-2.5 rounded-full bg-accent"
            aria-hidden
          />
          <p>{step.description}</p>
        </Card>
      ))}
    </div>
  );
}
