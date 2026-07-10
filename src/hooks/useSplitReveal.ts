import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { createSplitReveal } from "@/animations/splitReveal";
import type { SplitRevealOptions } from "@/animations/splitReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Reveal de texto por líneas. Espera document.fonts.ready antes de
 * dividir: si SplitType mide con la fuente fallback, las líneas se
 * rompen al cargar la webfont.
 */
export function useSplitReveal<T extends HTMLElement>(
  options: SplitRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    document.fonts.ready.then(() => {
      if (disposed) return;
      cleanup = createSplitReveal(el, options);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
    // options se pasa inline pero sus valores son estables por sitio de uso
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return ref;
}
