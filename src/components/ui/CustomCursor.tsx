import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cursor de luz: un punto blanco nítido y un halo con inercia.
 * Solo se activa con puntero fino y sin prefers-reduced-motion;
 * en touch o reduced-motion no se monta y el cursor nativo queda intacto.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!dot || !halo) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const haloX = gsap.quickTo(halo, "x", { duration: 0.45, ease: "power3.out" });
    const haloY = gsap.quickTo(halo, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      haloX(e.clientX);
      haloY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest("a, button");
      gsap.to(halo, {
        scale: interactive ? 2.2 : 1,
        opacity: interactive ? 0.9 : 0.5,
        duration: 0.35,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="max-lg:hidden">
      <div
        ref={haloRef}
        className="pointer-events-none fixed left-0 top-0 z-(--z-cursor) h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-light/40 opacity-50 mix-blend-difference"
        style={{ marginLeft: "-20px", marginTop: "-20px" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-(--z-cursor) h-1.5 w-1.5 rounded-full bg-light mix-blend-difference"
        style={{ marginLeft: "-3px", marginTop: "-3px" }}
      />
    </div>
  );
}
