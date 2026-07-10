import { useEffect, useRef } from "react";
import { MANIFESTO } from "@/constants/content";
import { createManifestoScrub } from "@/animations/manifestoScrub";
import { EnergyFlow } from "@/components/landing/manifesto/EnergyFlow";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Manifiesto editorial: el texto se enciende palabra por palabra con
 * el scroll, como si la luz del sol lo recorriera.
 */
export function Manifesto() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = textRef.current;
    if (!el || reduced) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    document.fonts.ready.then(() => {
      if (disposed) return;
      cleanup = createManifestoScrub(el);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced]);

  return (
    <section className="py-40 md:py-56">
      <div data-reveal="up" className="mx-auto max-w-5xl px-6">
        <p
          ref={textRef}
          className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-semibold leading-[1.35] text-light"
        >
          {MANIFESTO}
        </p>

        {/* El ciclo del sol, en vivo */}
        <EnergyFlow />
      </div>
    </section>
  );
}
