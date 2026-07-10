import { useEffect, useRef } from "react";
import { STATS } from "@/constants/content";
import { createStatsCount } from "@/animations/statsCount";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cifras reales del negocio contando hacia arriba: sin tarjetas,
 * solo tipografía gigante respirando en el negro.
 */
export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;
    return createStatsCount(section);
  }, [reduced]);

  const directions = ["left", "up", "right"] as const;

  return (
    <section ref={sectionRef} className="py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-3 md:gap-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-reveal={directions[i % directions.length]}
              data-reveal-delay={String(i * 0.12)}
              className="border-t border-coal pt-8"
            >
              <span
                data-value={reduced ? undefined : stat.value}
                className="font-display text-[clamp(3.5rem,8vw,7rem)] font-bold leading-none tabular-nums text-light transition-all duration-500 hover:[text-shadow:0_0_32px_rgba(255,255,255,0.45)]"
              >
                {reduced ? stat.value : 0}
              </span>
              <p className="mt-4 max-w-[26ch] leading-relaxed text-silver">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
