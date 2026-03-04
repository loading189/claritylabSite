import { Card } from './Card';
import { FeatureList } from './FeatureList';

type TrustListProps = {
  title?: string;
  className?: string;
};

const differentiators = [
  'Operator perspective',
  'Focus on service businesses',
  'Clear action plans',
  'Implementation available',
];

export function TrustList({
  title = 'What Makes This Different',
  className = '',
}: TrustListProps) {
  return (
    <Card title={title} className={className}>
      <FeatureList items={differentiators} />
    </Card>
  );
}
