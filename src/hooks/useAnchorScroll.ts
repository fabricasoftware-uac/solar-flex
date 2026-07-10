import { useEffect } from "react";
import { lenisRef } from "@/lib/lenisRef";
import { easeInOutCubic } from "@/utils/math";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Navegación por anclas con viaje suave: cualquier <a href="#...">
 * (menú, footer, CTAs) viaja hasta su sección con Lenis en lugar del
 * salto seco del navegador. href="#" vuelve arriba.
 */
export function useAnchorScroll(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const target = href.length > 1 ? document.querySelector(href) : null;
      if (href.length > 1 && !target) return;

      e.preventDefault();
      const lenis = lenisRef.current;
      if (!lenis || reduced) {
        if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        return;
      }

      lenis.scrollTo((target as HTMLElement) ?? 0, {
        duration: 1.6,
        easing: easeInOutCubic,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);
}
