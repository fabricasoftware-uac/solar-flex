import { gsap } from "@/lib/gsap";
import { clamp } from "@/utils/math";

interface SolutionsPanRefs {
  wrap: HTMLElement;
  track: HTMLElement;
}

/**
 * Viaje horizontal con profundidad real. Tres capas por panel a
 * velocidades distintas (imagen lenta, palabra fantasma rápida,
 * contenido que se revela al entrar), skew de las imágenes según la
 * velocidad del scroll y línea de progreso del trayecto.
 */
export function createSolutionsPan({ wrap, track }: SolutionsPanRefs): () => void {
  let tick: (() => void) | undefined;

  const ctx = gsap.context(() => {
    const distance = () => track.scrollWidth - window.innerWidth;

    const panTween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    const panels = gsap.utils.toArray<HTMLElement>(".pan-panel", track);

    panels.forEach((panel) => {
      const image = panel.querySelector<HTMLElement>(".pan-image");
      const ghost = panel.querySelector<HTMLElement>(".pan-ghost");
      const content = panel.querySelector<HTMLElement>(".pan-content");

      // Capa fondo: la imagen viaja lento (queda "atrás")
      if (image) {
        gsap.fromTo(
          image,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: panTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      }

      // Capa media: la palabra fantasma cruza en sentido contrario,
      // más rápida que el panel: profundidad inversa
      if (ghost) {
        gsap.fromTo(
          ghost,
          { xPercent: 30 },
          {
            xPercent: -45,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: panTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      }

      // Capa frente: el contenido se enciende cuando el panel entra
      if (content) {
        gsap.fromTo(
          content,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: panTween,
              start: "left 72%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    // Línea de progreso del viaje
    const progress = wrap.querySelector<HTMLElement>(".pan-progress");
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        },
      );
    }

    // Skew según velocidad del scroll: las fotos "se doblan" con el
    // impulso y vuelven suaves al frenar
    const mainST = panTween.scrollTrigger;
    // El skew va en el wrapper: la <img> queda libre para el zoom CSS de hover
    const skewTargets = gsap.utils.toArray<HTMLElement>(".pan-image", track);
    if (mainST && skewTargets.length > 0) {
      let current = 0;
      tick = () => {
        const target = mainST.isActive
          ? clamp(mainST.getVelocity() / -350, -6, 6)
          : 0;
        current += (target - current) * 0.1;
        if (Math.abs(current) < 0.02 && target === 0) {
          if (current !== 0) {
            current = 0;
            gsap.set(skewTargets, { skewX: 0 });
          }
          return;
        }
        gsap.set(skewTargets, { skewX: current });
      };
      gsap.ticker.add(tick);
    }
  }, wrap);

  return () => {
    if (tick) gsap.ticker.remove(tick);
    ctx.revert();
  };
}
