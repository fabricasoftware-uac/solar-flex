import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Foco de luz del cursor: un glow compacto e intenso en
 * mix-blend-overlay que abrillanta texto, fondo e imágenes a su paso.
 * Solo con puntero fino y sin reduced-motion; en touch no se monta.
 */
export function CursorLight() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [fine] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const active = fine && !reduced;

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || !active) return;

    const glowX = gsap.quickTo(glow, "x", { duration: 0.45, ease: "power3.out" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      glowX(e.clientX);
      glowY(e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[190px] w-[190px] rounded-full opacity-70 mix-blend-overlay"
        style={{
          marginLeft: "-95px",
          marginTop: "-95px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
