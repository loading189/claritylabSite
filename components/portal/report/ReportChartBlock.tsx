import type { ReportChart } from '@/lib/clientReportReadModel';

export function ReportChartBlock({ chart }: { chart: ReportChart }) {
  const max = Math.max(...chart.series.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text">{chart.title}</h3>
      <p className="text-sm text-muted">{chart.description}</p>
      <div className="space-y-3">
        {chart.series.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-surfaceRaised">
              <div
                className="h-2 rounded-full bg-accent"
                style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }}
                role="img"
                aria-label={`${item.label} score ${item.value}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
