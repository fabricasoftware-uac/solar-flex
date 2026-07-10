import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SolarionMark } from "@/components/ui/SolarionMark";

/**
 * Indicador de carga: una batería solar vertical fija a la izquierda.
 * El recorrido de la página la "carga": la barra se llena de luz de
 * abajo hacia arriba con el scroll, un nodo brillante marca el nivel
 * y el porcentaje cuenta hasta 100% al llegar al final.
 */
export function ChargeIndicator() {
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const knob = knobRef.current;
    const track = trackRef.current;
    const label = labelRef.current;
    if (!fill || !knob || !track || !label) return;

    gsap.set(fill, { scaleY: 0, transformOrigin: "bottom center" });

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(fill, { scaleY: p });
        gsap.set(knob, { y: -p * track.clientHeight });
        label.textContent = `${Math.round(p * 100)}%`;
      },
    });

    return () => st.kill();
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      <SolarionMark className="w-4 text-silver/70" />

      <div ref={trackRef} className="relative h-[34vh] w-[3px] rounded-full bg-coal">
        <div
          ref={fillRef}
          className="absolute inset-0 rounded-full bg-gradient-to-t from-graphite via-silver to-light"
        />
        {/* Nodo de carga: el "sol" que sube con tu recorrido */}
        <div
          ref={knobRef}
          className="absolute -left-[3.5px] bottom-0 h-2.5 w-2.5 rounded-full bg-light shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        />
      </div>

      <span
        ref={labelRef}
        className="font-body text-[10px] tabular-nums tracking-wide text-silver"
      >
        0%
      </span>
    </aside>
  );
}
