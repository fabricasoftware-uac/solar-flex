import { useEffect, useRef } from "react";
import { PILLARS, PRODUCT_FLOATS } from "@/constants/content";
import {
  createProductAmbient,
  createProductPinned,
} from "@/animations/productPinned";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSplitReveal } from "@/hooks/useSplitReveal";
import { LightMask } from "@/components/ui/LightMask";

/**
 * La estación: sección fijada. Un marco de fotos anclado va cambiando
 * de imagen (cortina clip-path) al ritmo de los cuatro pilares,
 * mientras dos miniaturas flotan en bucle y el bloque entero se
 * inclina en 3D siguiendo al cursor.
 */
export function Product() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const titleRef = useSplitReveal<HTMLHeadingElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    const frame = frameRef.current;
    const list = listRef.current;
    if (!section || !stack || !frame || !list || reduced) return;
    if (window.innerWidth < 1024) return; // en mobile la sección fluye sin pin

    const images = Array.from(
      frame.querySelectorAll<HTMLElement>("[data-stack-img]"),
    );
    const items = Array.from(list.children) as HTMLElement[];
    const floats = Array.from(
      stack.querySelectorAll<HTMLElement>("[data-float]"),
    );

    const cleanupPinned = createProductPinned({ section, frame, images, items });
    const cleanupAmbient = createProductAmbient({ section, stack, floats });

    return () => {
      cleanupPinned();
      cleanupAmbient();
    };
  }, [reduced]);

  return (
    <section id="estacion" ref={sectionRef} className="bg-carbon/60">
      <div className="mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:py-0">
        <div className="flex flex-col justify-center">
          <h2
            ref={titleRef}
            className="font-display text-[clamp(2.2rem,4.5vw,4rem)] font-bold leading-[1.08] text-light"
          >
            Una estación. Todo tu mundo cargado.
          </h2>

          <div ref={stackRef} className="relative mt-10 aspect-[4/3] will-change-transform">
            <div
              ref={frameRef}
              className="light-parent absolute inset-0 isolate overflow-hidden rounded-3xl"
              style={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
            >
              {PILLARS.map((pillar, i) => (
                <img
                  key={pillar.image}
                  data-stack-img
                  src={pillar.image}
                  alt={pillar.title}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover contrast-110 will-change-transform transition-[filter] duration-500 hover:brightness-125 ${
                    i > 0 ? "hidden lg:block" : ""
                  }`}
                  style={i > 0 ? { clipPath: "inset(100% 0% 0% 0%)" } : undefined}
                />
              ))}
              <LightMask />
            </div>

            {/* Miniaturas flotantes: animación perpetua mientras la sección es visible */}
            <div
              data-float
              className="absolute -right-6 -top-10 hidden aspect-square w-28 rotate-3 md:block lg:-right-10 lg:w-32"
            >
              <div className="light-parent relative isolate h-full w-full overflow-hidden rounded-2xl border border-coal">
                <img
                  src={PRODUCT_FLOATS[0]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full object-cover contrast-110"
                />
                <LightMask />
              </div>
            </div>
            <div
              data-float
              className="absolute -bottom-8 -left-4 hidden aspect-square w-24 -rotate-6 md:block lg:-left-8"
            >
              <div className="light-parent relative isolate h-full w-full overflow-hidden rounded-2xl border border-coal">
                <img
                  src={PRODUCT_FLOATS[1]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full object-cover contrast-110"
                />
                <LightMask />
              </div>
            </div>
          </div>

          {/* En mobile las fotos extra se muestran como tira */}
          <div data-reveal="up" className="mt-4 grid grid-cols-3 gap-3 lg:hidden">
            {PILLARS.slice(1).map((pillar) => (
              <div
                key={pillar.image}
                className="light-parent relative isolate aspect-square overflow-hidden rounded-xl"
              >
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  loading="lazy"
                  className="h-full w-full object-cover contrast-110 transition duration-500 hover:scale-105 hover:brightness-125"
                />
                <LightMask />
              </div>
            ))}
          </div>
        </div>

        <div ref={listRef} className="flex flex-col gap-10 lg:gap-14">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="border-l border-graphite pl-6 transition-[border-color,padding] duration-300 hover:border-light hover:pl-8"
            >
              <h3 className="font-display text-2xl font-semibold text-light">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-silver">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
