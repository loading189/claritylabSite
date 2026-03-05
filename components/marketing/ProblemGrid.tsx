import { Card } from '@/components/Card';
import { Reveal } from '@/components/Reveal';

type ProblemGridProps = {
  items: string[];
};

export function ProblemGrid({ items }: ProblemGridProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {items.map((problem, index) => (
        <Reveal key={problem} delay={index * 70}>
          <Card interactive>
            <h3 className="text-xl font-semibold text-text">0{index + 1}</h3>
            <p className="mt-3 text-sm text-muted">{problem}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
