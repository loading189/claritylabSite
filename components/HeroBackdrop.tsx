export function HeroBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-blob hero-blob-a" />
      <div className="hero-blob hero-blob-b" />
      <div className="hero-blob hero-blob-c" />
    </div>
  );
}
