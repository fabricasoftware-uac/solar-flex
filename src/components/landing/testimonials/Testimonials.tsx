import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/constants/content";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LightMask } from "@/components/ui/LightMask";

/**
 * Voces: carrusel mínimo controlado por flechas. Retrato en
 * blanco y negro + cita corta. Transición por máscara vertical.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const animating = useRef(false);
  const inViewRef = useRef(false);
  const reduced = useReducedMotion();

  const go = useCallback(
    (dir: 1 | -1) => {
      if (animating.current) return;
      const next =
        (index + dir + TESTIMONIALS.length) % TESTIMONIALS.length;

      if (reduced || !panelRef.current) {
        setIndex(next);
        return;
      }

      animating.current = true;
      gsap.to(panelRef.current, {
        yPercent: -6,
        autoAlpha: 0,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          setIndex(next);
          gsap.fromTo(
            panelRef.current,
            { yPercent: 6, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.out",
              onComplete: () => {
                animating.current = false;
              },
            },
          );
        },
      });
    },
    [index, reduced],
  );

  // Autoplay: avanza cada 7s mientras la sección está a la vista.
  // Cualquier click manual reinicia el conteo (go cambia con index).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (inViewRef.current) go(1);
    }, 7000);
    return () => window.clearInterval(id);
  }, [go, reduced]);

  const t = TESTIMONIALS[index];

  return (
    <section ref={sectionRef} className="py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6">
        <div ref={panelRef} className="grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16">
          <div
            data-reveal="left"
            className="light-parent relative isolate h-28 w-28 overflow-hidden rounded-full md:h-40 md:w-40"
          >
            <img
              src={t.image}
              alt={t.name}
              loading="lazy"
              className="h-full w-full object-cover transition-[filter] duration-500 hover:brightness-125"
            />
            <LightMask />
          </div>
          <figure data-reveal="right" data-reveal-delay="0.15">
            <blockquote className="font-display text-2xl font-semibold leading-snug text-light md:text-3xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-silver">
              {t.name}
              <span className="text-graphite"> &middot; {t.role}</span>
            </figcaption>
          </figure>
        </div>

        <div data-reveal="up" data-reveal-delay="0.3" className="mt-14 flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Testimonio anterior"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-graphite text-light transition-colors duration-300 hover:border-silver active:scale-[0.96]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d="M19 12H5m0 0 6 6m-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Testimonio siguiente"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-graphite text-light transition-colors duration-300 hover:border-silver active:scale-[0.96]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="ml-auto text-sm tabular-nums text-graphite">
            {index + 1} de {TESTIMONIALS.length}
          </span>
        </div>
      </div>
    </section>
  );
}
