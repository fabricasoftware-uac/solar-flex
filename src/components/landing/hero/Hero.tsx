import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO } from "@/constants/content";
import { createHeroHeadline } from "@/animations/heroHeadline";
import { SolarField } from "@/components/landing/hero/SolarField";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroProps {
  ready: boolean;
}

/**
 * Hero manifiesto: el campo halftone de la marca como cielo vivo,
 * titular cinético que amanece letra a letra, y parallax multicapa
 * (canvas, texto y CTAs a profundidades distintas) siguiendo el mouse.
 */
export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const reduced = useReducedMotion();

  // Entrada cinética: chars suben desde la oscuridad cuando el preloader
  // termina. Espera fonts.ready para que SplitType mida bien las líneas.
  useEffect(() => {
    const headline = headlineRef.current;
    const section = sectionRef.current;
    if (!headline || !section || !ready) return;

    const sub = section.querySelector<HTMLElement>(".hero-sub");
    const ctas = section.querySelector<HTMLElement>(".hero-ctas");

    if (reduced) {
      gsap.set([headline, sub, ctas], { autoAlpha: 1 });
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    document.fonts.ready.then(() => {
      if (disposed || !sub || !ctas) return;
      cleanup = createHeroHeadline({
        headline,
        sub: ".hero-sub",
        ctas: ".hero-ctas",
        phrases: HERO.rotating,
      });
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [ready, reduced]);

  // Parallax de salida + progreso para el canvas
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;

      gsap.to(".hero-content", {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  // Parallax multicapa por mouse: cada capa con profundidad distinta
  useGSAP(
    () => {
      const depth = depthRef.current;
      if (!depth || reduced) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", depth);
      const setters = layers.map((layer) => ({
        x: gsap.quickTo(layer, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(layer, "y", { duration: 0.8, ease: "power3.out" }),
        depth: Number(layer.dataset.depth ?? 0),
      }));

      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setters.forEach((s) => {
          s.x(nx * s.depth * 22);
          s.y(ny * s.depth * 14);
        });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-carbon"
    >
      <SolarField scrollProgress={scrollProgress} />

      <div ref={depthRef} className="hero-content relative z-10 w-full will-change-transform">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1
            ref={headlineRef}
            data-depth="1"
            className="invisible min-h-[2.2em] font-display text-[clamp(2.6rem,7.2vw,6.4rem)] font-bold leading-[1.04] tracking-tight text-light [perspective:900px]"
          >
            {HERO.headline}
          </h1>
          <p
            data-depth="0.7"
            className="hero-sub invisible mx-auto mt-8 max-w-xl text-lg leading-relaxed text-silver md:text-xl"
          >
            {HERO.sub}
          </p>
          <div
            data-depth="0.5"
            className="hero-ctas invisible mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton href="#contacto">{HERO.cta}</MagneticButton>
            <MagneticButton href="#estacion" variant="ghost">
              {HERO.ctaSecondary}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
