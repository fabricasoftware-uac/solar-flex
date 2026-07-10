import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenisRef";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, easeInOutCubic } from "@/utils/math";

/**
 * Volver arriba con "recogida": el rebobinado usa Lenis con una curva
 * larga, y como todas las entradas tienen play/reverse, la página
 * literalmente se va recogiendo (los elementos se guardan uno a uno)
 * mientras la batería solar se descarga hasta 0%. El botón aparece
 * tras el primer tramo de scroll y se lanza hacia arriba al usarlo.
 */
export function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 1.2,
      end: "max",
      onToggle: (self) => {
        gsap.to(btn, {
          autoAlpha: self.isActive ? 1 : 0,
          y: self.isActive ? 0 : 16,
          duration: 0.4,
          ease: "power2.out",
        });
      },
    });

    return () => st.kill();
  }, []);

  const rewind = () => {
    const btn = btnRef.current;
    if (btn && !reduced) {
      // El botón "despega" hacia arriba
      gsap.fromTo(
        btn,
        { y: 0 },
        { y: -14, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 },
      );
    }

    const lenis = lenisRef.current;
    if (lenis && !reduced) {
      // Duración proporcional a la distancia y curva que arranca suave:
      // desde el fondo de la página el rebobinado se ve fluido, no brusco
      lenis.scrollTo(0, {
        duration: clamp(0.9 + window.scrollY / 2600, 1.4, 3),
        easing: easeInOutCubic,
      });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={rewind}
      aria-label="Volver arriba"
      className="invisible fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-graphite bg-carbon/80 text-light opacity-0 backdrop-blur-sm transition-colors duration-300 hover:border-silver active:scale-[0.96]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M12 19V5m0 0-6 6m6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
