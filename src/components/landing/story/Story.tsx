import { useEffect, useRef } from "react";
import { STORY } from "@/constants/content";
import { createStoryDraw } from "@/animations/storyDraw";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSplitReveal } from "@/hooks/useSplitReveal";
import { LightMask } from "@/components/ui/LightMask";

/**
 * Historia: una línea de luz se dibuja verticalmente uniendo los hitos
 * de la marca, de Popayán al presente. Cierra con el fundador y los
 * aliados que creyeron primero.
 */
export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const introRef = useSplitReveal<HTMLParagraphElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const pulse = pulseRef.current;
    const list = listRef.current;
    if (!section || !path || !pulse || !list || reduced) return;

    const milestones = Array.from(list.children) as HTMLElement[];
    return createStoryDraw({ section, path, pulse, milestones });
  }, [reduced]);

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative overflow-hidden bg-coal py-32 md:py-48"
    >
      {/* Luz ambiental que barre el fondo de lado a lado */}
      <div
        aria-hidden="true"
        className="story-light pointer-events-none absolute inset-y-0 left-0 w-[55vw] opacity-[0.05]"
        style={{
          background: "radial-gradient(closest-side, #ffffff, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <p
          ref={introRef}
          className="max-w-3xl font-display text-[clamp(1.8rem,3.6vw,3.2rem)] font-bold leading-[1.2] text-light"
        >
          {STORY.intro}
        </p>

        <div className="relative mt-24 grid gap-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          {/* Cable de energía: se dibuja con el scroll y una corriente
              luminosa lo recorre en bucle */}
          <svg
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-2 lg:static lg:h-auto lg:w-10 lg:justify-self-center"
            viewBox="0 0 40 800"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="story-charge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.6" stopColor="#aaaaaa" />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
              <filter id="story-glow" x="-300%" y="-5%" width="700%" height="110%">
                <feGaussianBlur stdDeviation="2.2" />
              </filter>
            </defs>
            <path
              d="M20 0 L26 72 L13 150 L27 232 L12 312 L25 392 L14 472 L27 552 L13 632 L24 712 L20 800"
              stroke="#424242"
              strokeWidth="1"
            />
            <path
              ref={pathRef}
              d="M20 0 L26 72 L13 150 L27 232 L12 312 L25 392 L14 472 L27 552 L13 632 L24 712 L20 800"
              stroke="url(#story-charge)"
              strokeWidth="1.6"
            />
            <path
              ref={pulseRef}
              d="M20 0 L26 72 L13 150 L27 232 L12 312 L25 392 L14 472 L27 552 L13 632 L24 712 L20 800"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#story-glow)"
            />
          </svg>

          <ol ref={listRef} className="order-first flex flex-col gap-16 pl-12 lg:order-none lg:col-start-1 lg:row-start-1 lg:pl-0 lg:text-right">
            {STORY.milestones.map((m) => (
              <li key={m.title}>
                <h3 className="font-display text-2xl font-semibold text-light">
                  {m.title}
                </h3>
                <p className="mt-3 leading-relaxed text-silver lg:ml-auto lg:max-w-sm">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-10 pl-12 lg:col-start-3 lg:row-start-1 lg:justify-center lg:pl-0">
            <figure data-reveal="right">
              <div className="light-parent relative isolate max-w-sm overflow-hidden rounded-3xl">
                <img
                  src={STORY.founder.image}
                  alt={STORY.founder.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover contrast-110 transition duration-700 hover:scale-[1.04] hover:brightness-110"
                />
                <LightMask />
              </div>
              <figcaption className="mt-4 text-silver">
                {STORY.founder.name}
                <span className="text-graphite"> &middot; {STORY.founder.role}</span>
              </figcaption>
            </figure>

            <div data-reveal="up" data-reveal-delay="0.2">
              <p className="text-sm text-silver">Con el apoyo de</p>
              <div className="mt-4 flex items-center gap-8">
                {STORY.allies.map((ally) => (
                  <img
                    key={ally.name}
                    src={ally.image}
                    alt={ally.name}
                    loading="lazy"
                    className="h-12 w-auto opacity-85"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
