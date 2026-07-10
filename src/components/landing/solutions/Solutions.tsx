import { useEffect, useRef } from "react";
import { SOLUTIONS } from "@/constants/content";
import { createSolutionsPan } from "@/animations/solutionsPan";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LightMask } from "@/components/ui/LightMask";

/**
 * Escenarios: viaje horizontal con tres capas de profundidad por
 * panel: imagen lenta al fondo, palabra fantasma rápida en sentido
 * contrario, y contenido que se enciende al entrar. Las fotos se
 * inclinan con la velocidad del scroll.
 */
export function Solutions() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || reduced) return;
    if (window.innerWidth < 1024) return; // mobile: scroll vertical natural

    return createSolutionsPan({ wrap, track });
  }, [reduced]);

  return (
    <section id="escenarios" ref={wrapRef} className="relative overflow-hidden bg-coal">
      <div
        ref={trackRef}
        className="flex flex-col will-change-transform lg:h-[100dvh] lg:w-max lg:flex-row lg:items-stretch"
      >
        <div className="flex shrink-0 items-center px-6 py-20 lg:h-full lg:w-[38vw] lg:px-16">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] font-bold leading-[1.1] text-light">
            Tu energía, en cualquier territorio.
          </h2>
        </div>

        {SOLUTIONS.map((solution) => (
          <article
            key={solution.title}
            className="pan-panel light-parent group relative flex shrink-0 flex-col justify-end overflow-hidden px-6 pb-16 pt-24 lg:h-full lg:w-[62vw] lg:px-16 lg:pb-24"
          >
            <div className="pan-image absolute inset-0 isolate will-change-transform">
              <img
                src={solution.image}
                alt={solution.title}
                loading="lazy"
                className="h-full w-full scale-110 object-cover contrast-110 opacity-45 transition-all duration-[2400ms] ease-out group-hover:scale-[1.24] group-hover:opacity-70 group-hover:brightness-110"
              />
              <LightMask />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/35 to-transparent" />
            </div>

            {/* Palabra fantasma: capa de profundidad que cruza más rápido */}
            <span
              aria-hidden="true"
              className="pan-ghost pointer-events-none absolute left-0 top-[10%] hidden select-none whitespace-nowrap font-display text-[15vw] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)] lg:block"
            >
              {solution.title}
            </span>

            <div className="pan-content relative">
              <h3 className="font-display text-4xl font-bold text-light md:text-5xl">
                {solution.title}
              </h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-silver">
                {solution.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Progreso del viaje horizontal */}
      <div className="pointer-events-none absolute inset-x-16 bottom-10 hidden h-px bg-graphite/50 lg:block">
        <div className="pan-progress h-full w-full origin-left scale-x-0 bg-light" />
      </div>
    </section>
  );
}
