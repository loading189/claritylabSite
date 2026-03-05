type ScanProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function ScanProgress({ currentStep, totalSteps }: ScanProgressProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-2" aria-live="polite">
      <p className="text-sm font-medium text-muted">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
