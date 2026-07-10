import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

/**
 * Palabras que pasan de gris grafito a blanco a medida que el usuario
 * scrollea: el texto "se enciende" como si le llegara luz.
 */
export function createManifestoScrub(el: HTMLElement): () => void {
  const split = new SplitType(el, { types: "words" });

  const tween = gsap.fromTo(
    split.words,
    { color: "#2b2b2b" },
    {
      color: "#ffffff",
      stagger: 0.06,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 78%",
        end: "bottom 45%",
        scrub: 0.6,
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    split.revert();
  };
}
