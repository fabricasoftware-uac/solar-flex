import { gsap } from "@/lib/gsap";

/**
 * Cifras que cuentan hacia arriba al entrar en viewport.
 * Cada elemento necesita data-value con el número final.
 */
export function createStatsCount(section: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-value]", section).forEach((el) => {
      const target = Number(el.dataset.value ?? 0);
      const counter = { n: 0 };

      gsap.to(counter, {
        n: target,
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = String(Math.round(counter.n));
        },
      });
    });
  }, section);

  return () => ctx.revert();
}
