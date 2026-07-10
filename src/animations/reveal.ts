import { gsap } from "@/lib/gsap";

/**
 * Sistema global de entradas direccionales. Cualquier elemento con
 * data-reveal="left | right | up | zoom" entra animado al llegar al
 * viewport (una sola vez, solo transform + opacity):
 *   left  -> se desliza desde la izquierda
 *   right -> se desliza desde la derecha
 *   up    -> sube desde abajo
 *   zoom  -> crece desde el 88%
 * data-reveal-delay (segundos) escalona elementos de un mismo grupo.
 */
interface RevealOptions {
  /** Solo opacidad (fallback accesible bajo prefers-reduced-motion) */
  fadeOnly?: boolean;
}

export function createReveals(
  root: HTMLElement | Document,
  { fadeOnly = false }: RevealOptions = {},
): () => void {
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      const dir = el.dataset.reveal ?? "up";
      const delay = Number.parseFloat(el.dataset.revealDelay ?? "0");

      const from: gsap.TweenVars = { autoAlpha: 0 };
      if (fadeOnly) {
        // sin desplazamiento: solo aparece
      } else if (dir === "left") from.x = -140;
      else if (dir === "right") from.x = 140;
      else if (dir === "zoom") {
        from.scale = 0.8;
        from.y = 40;
      } else from.y = 90;

      gsap.from(el, {
        ...from,
        duration: 1.2,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          // Se re-anima cada vez que el elemento vuelve a entrar
          toggleActions: "play none none reverse",
        },
      });
    });
  }, root instanceof Document ? undefined : root);

  return () => ctx.revert();
}
