import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

export interface SplitRevealOptions {
  start?: string;
  stagger?: number;
  delay?: number;
}

/**
 * Revela un bloque de texto línea a línea desde abajo con máscara.
 * Debe llamarse con las fuentes ya cargadas (document.fonts.ready)
 * para que SplitType mida las líneas con la métrica definitiva.
 */
export function createSplitReveal(
  el: HTMLElement,
  { start = "top 82%", stagger = 0.09, delay = 0 }: SplitRevealOptions = {},
): () => void {
  const split = new SplitType(el, { types: "lines" });
  el.classList.add("split-line-mask");

  const tween = gsap.from(split.lines, {
    yPercent: 115,
    duration: 1.2,
    stagger,
    delay,
    ease: "power4.out",
    scrollTrigger: {
      trigger: el,
      start,
      once: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    split.revert();
    el.classList.remove("split-line-mask");
  };
}
