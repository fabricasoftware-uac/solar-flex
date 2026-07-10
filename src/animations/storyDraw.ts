import { gsap, ScrollTrigger } from "@/lib/gsap";

interface StoryDrawRefs {
  section: HTMLElement;
  path: SVGPathElement;
  /** Trazo corto que viaja por la línea como corriente eléctrica */
  pulse: SVGPathElement;
  milestones: HTMLElement[];
}

/**
 * La línea de la historia como cable energizado: se dibuja con el
 * scroll, un pulso de corriente la recorre sin parar y una luz
 * ambiental barre el fondo de la sección de izquierda a derecha.
 * Los hitos entran deslizándose al pasar.
 */
export function createStoryDraw({
  section,
  path,
  pulse,
  milestones,
}: StoryDrawRefs): () => void {
  const ctx = gsap.context(() => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom 70%",
        scrub: 0.8,
      },
    });

    // Corriente: un segmento brillante viaja por el cable en bucle
    const seg = length * 0.06;
    gsap.set(pulse, { strokeDasharray: `${seg} ${length}` });
    const pulseTween = gsap.fromTo(
      pulse,
      { strokeDashoffset: seg },
      {
        strokeDashoffset: -length,
        duration: 2.8,
        repeat: -1,
        ease: "power1.inOut",
      },
    );

    // Luz ambiental que barre el fondo gris de lado a lado
    const lightTween = gsap.fromTo(
      ".story-light",
      { xPercent: -40 },
      { xPercent: 260, duration: 13, repeat: -1, yoyo: true, ease: "sine.inOut" },
    );

    // Ambos loops solo consumen frames con la sección a la vista
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        [pulseTween, lightTween].forEach((tw) =>
          self.isActive ? tw.play() : tw.pause(),
        );
      },
    });

    milestones.forEach((item) => {
      gsap.fromTo(
        item,
        { autoAlpha: 0, x: -110 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }, section);

  return () => ctx.revert();
}
