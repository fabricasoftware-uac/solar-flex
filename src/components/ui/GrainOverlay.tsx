/**
 * Grano fotográfico sutil sobre toda la página: da textura de material
 * al negro plano. Fixed + pointer-events-none, costo GPU único.
 */
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-(--z-grain) opacity-[0.05]"
      style={{ backgroundImage: `url("${NOISE_SVG}")` }}
    />
  );
}
