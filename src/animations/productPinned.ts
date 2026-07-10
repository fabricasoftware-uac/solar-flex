import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ProductPinnedRefs {
  section: HTMLElement;
  frame: HTMLElement;
  images: HTMLElement[];
  items: HTMLElement[];
}

/**
 * Sección fijada: el marco de imágenes queda anclado mientras los
 * pilares entran en secuencia. Cada pilar trae su propia foto, que
 * se revela con una cortina (clip-path) sincronizada con el scroll.
 */
export function createProductPinned({
  section,
  frame,
  images,
  items,
}: ProductPinnedRefs): () => void {
  const ctx = gsap.context(() => {
    // El marco se abre al llegar a la sección
    gsap.fromTo(
      frame,
      { clipPath: "inset(16% 20% 16% 20% round 24px)", scale: 1.08 },
      {
        clipPath: "inset(0% 0% 0% 0% round 24px)",
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
        },
      },
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${items.length * 65}%`,
        pin: true,
        scrub: 0.7,
      },
    });

    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { autoAlpha: 0, x: 110 },
        { autoAlpha: 1, x: 0, duration: 1, ease: "power2.out" },
        i,
      );

      // La foto del pilar i sube como cortina sobre la anterior
      if (i > 0) {
        tl.fromTo(
          images[i],
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.14 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          i - 0.12,
        ).to(
          images[i - 1],
          { scale: 1.07, duration: 1, ease: "none" },
          i - 0.12,
        );
      }

      if (i < items.length - 1) {
        tl.to(item, { autoAlpha: 0.4, duration: 0.6 }, i + 0.8);
      }
    });
  }, section);

  return () => ctx.revert();
}

interface ProductAmbientRefs {
  section: HTMLElement;
  stack: HTMLElement;
  floats: HTMLElement[];
}

/**
 * Capa "en tiempo real" de la sección producto: las miniaturas
 * flotan en bucle (pausadas fuera de viewport) y todo el bloque de
 * imágenes se inclina en 3D siguiendo al mouse.
 */
export function createProductAmbient({
  section,
  stack,
  floats,
}: ProductAmbientRefs): () => void {
  const tweens = floats.map((el, i) =>
    gsap.to(el, {
      y: i % 2 === 0 ? 16 : -14,
      rotation: i % 2 === 0 ? 4 : -5,
      duration: 2.6 + i * 0.7,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      paused: true,
    }),
  );

  // Las flotantes solo se animan con la sección visible
  const st = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      tweens.forEach((tw) => (self.isActive ? tw.play() : tw.pause()));
    },
  });

  // Tilt 3D del bloque de imágenes hacia el cursor
  gsap.set(stack, { transformPerspective: 900 });
  const rx = gsap.quickTo(stack, "rotationX", { duration: 0.7, ease: "power3.out" });
  const ry = gsap.quickTo(stack, "rotationY", { duration: 0.7, ease: "power3.out" });

  const onMove = (e: PointerEvent) => {
    const rect = stack.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    ry(nx * 6);
    rx(ny * -6);
  };
  const onLeave = () => {
    ry(0);
    rx(0);
  };

  section.addEventListener("pointermove", onMove, { passive: true });
  section.addEventListener("pointerleave", onLeave, { passive: true });

  return () => {
    section.removeEventListener("pointermove", onMove);
    section.removeEventListener("pointerleave", onLeave);
    st.kill();
    tweens.forEach((tw) => tw.kill());
    gsap.set(stack, { clearProps: "transform,transformPerspective" });
  };
}
