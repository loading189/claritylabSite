export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="hero-grid" />
      <div className="hero-noise" />
      <div className="hero-glow" />
    </div>
  );
}
