import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

interface HeroHeadlineTargets {
  headline: HTMLElement;
  sub: string;
  ctas: string;
  /** Frases que rotan tras la entrada; la [0] es la inicial */
  phrases: string[];
}

const HOLD_MS = 3800;

/**
 * Titular vivo: entrada cinética carácter a carácter y, después, las
 * frases rotan en bucle: los caracteres actuales se hunden y los de
 * la siguiente frase amanecen desde abajo, siempre con el mismo
 * lenguaje de movimiento que la entrada.
 */
export function createHeroHeadline({
  headline,
  sub,
  ctas,
  phrases,
}: HeroHeadlineTargets): () => void {
  let split = new SplitType(headline, { types: "words,chars" });
  gsap.set(headline, { autoAlpha: 1 });

  let killed = false;
  let timer = 0;
  let cycleTl: gsap.core.Timeline | null = null;
  let index = 0;

  const intro = gsap.timeline({
    onComplete: () => {
      timer = window.setTimeout(cycle, HOLD_MS);
    },
  });
  intro
    .from(split.chars, {
      yPercent: 110,
      rotateX: -55,
      autoAlpha: 0,
      transformOrigin: "50% 100%",
      duration: 1.1,
      stagger: 0.028,
      ease: "power4.out",
    })
    .fromTo(
      sub,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9 },
      "-=0.55",
    )
    .fromTo(
      ctas,
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      "-=0.6",
    );

  function cycle() {
    if (killed) return;
    const next = phrases[(index + 1) % phrases.length];

    cycleTl = gsap.timeline({
      onComplete: () => {
        index = (index + 1) % phrases.length;
        timer = window.setTimeout(cycle, HOLD_MS);
      },
    });

    cycleTl
      .to(split.chars, {
        yPercent: -105,
        autoAlpha: 0,
        stagger: 0.012,
        duration: 0.5,
        ease: "power2.in",
      })
      .add(() => {
        split.revert();
        headline.textContent = next;
        split = new SplitType(headline, { types: "words,chars" });
        gsap.fromTo(
          split.chars,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.022,
            duration: 0.85,
            ease: "power4.out",
          },
        );
      });
  }

  return () => {
    killed = true;
    window.clearTimeout(timer);
    intro.kill();
    cycleTl?.kill();
    split.revert();
    headline.textContent = phrases[0];
  };
}
