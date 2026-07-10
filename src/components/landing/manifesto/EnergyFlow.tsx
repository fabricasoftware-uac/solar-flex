import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * El sol trabaja: diagrama vivo del ciclo Solarion. La energía fluye
 * (guiones en movimiento + chispas viajando) desde el sol hasta la
 * estación y de ahí a tus dispositivos; la corona del sol gira, el
 * LED de la estación late y las barras de batería se llenan en bucle.
 * Se pausa fuera de viewport. Geometría simple, monocromo de marca.
 */
export function EnergyFlow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const tweens: gsap.core.Tween[] = [];

      // Flujo de guiones por los cables
      tweens.push(
        gsap.to(".flow-line", {
          strokeDashoffset: -32,
          duration: 1.1,
          repeat: -1,
          ease: "none",
        }),
      );

      // Chispas viajando del sol a la estación y de ahí a la vida
      tweens.push(
        gsap.fromTo(
          ".flow-spark-1",
          { attr: { cx: 128 } },
          { attr: { cx: 372 }, duration: 1.6, repeat: -1, ease: "power1.inOut" },
        ),
        gsap.fromTo(
          ".flow-spark-2",
          { attr: { cx: 528 } },
          { attr: { cx: 772 }, duration: 1.6, repeat: -1, ease: "power1.inOut", delay: 0.8 },
        ),
      );

      // La corona de puntos del sol gira lenta
      tweens.push(
        gsap.to(".flow-corona", {
          rotation: 360,
          duration: 26,
          repeat: -1,
          ease: "none",
          svgOrigin: "70 60",
        }),
      );

      // El LED de la estación late
      tweens.push(
        gsap.to(".flow-led", {
          opacity: 0.15,
          duration: 0.9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        }),
      );

      // Las barras de carga se llenan en secuencia, una y otra vez
      tweens.push(
        gsap.fromTo(
          ".flow-bar",
          { scaleY: 0.15 },
          {
            scaleY: 1,
            duration: 0.7,
            stagger: 0.35,
            repeat: -1,
            repeatDelay: 0.8,
            yoyo: true,
            ease: "power2.out",
            transformOrigin: "center bottom",
          },
        ),
      );

      // Solo consume frames cuando está a la vista
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          tweens.forEach((tw) => (self.isActive ? tw.play() : tw.pause()));
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef} data-reveal="up" className="mt-20 md:mt-28">
      <svg
        viewBox="0 0 900 130"
        fill="none"
        aria-hidden="true"
        className="w-full"
      >
        {/* Sol: núcleo + corona de puntos halftone girando */}
        <circle cx="70" cy="60" r="17" fill="#ffffff" opacity="0.92" />
        <g className="flow-corona" fill="#aaaaaa">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI * 2) / 8;
            return (
              <circle
                key={i}
                cx={70 + Math.cos(a) * 30}
                cy={60 + Math.sin(a) * 30}
                r={i % 2 === 0 ? 2.4 : 1.5}
              />
            );
          })}
        </g>

        {/* Cable sol -> estación */}
        <line
          x1="112"
          y1="60"
          x2="380"
          y2="60"
          stroke="#424242"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          className="flow-line"
        />
        <circle className="flow-spark-1" cx="128" cy="60" r="3.2" fill="#ffffff" />

        {/* Estación: cuerpo, panel superior y LED */}
        <rect x="392" y="34" width="116" height="52" rx="12" stroke="#ffffff" strokeWidth="1.5" fill="#212121" />
        <line x1="404" y1="46" x2="496" y2="46" stroke="#424242" strokeWidth="1.5" />
        <line x1="418" y1="34" x2="418" y2="46" stroke="#424242" strokeWidth="1" />
        <line x1="444" y1="34" x2="444" y2="46" stroke="#424242" strokeWidth="1" />
        <line x1="470" y1="34" x2="470" y2="46" stroke="#424242" strokeWidth="1" />
        {/* Barras de carga dentro de la estación */}
        <rect className="flow-bar" x="412" y="56" width="9" height="20" rx="2" fill="#aaaaaa" />
        <rect className="flow-bar" x="428" y="56" width="9" height="20" rx="2" fill="#aaaaaa" />
        <rect className="flow-bar" x="444" y="56" width="9" height="20" rx="2" fill="#aaaaaa" />
        <circle className="flow-led" cx="488" cy="66" r="3.5" fill="#ffffff" />

        {/* Cable estación -> tu vida */}
        <line
          x1="520"
          y1="60"
          x2="780"
          y2="60"
          stroke="#424242"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          className="flow-line"
        />
        <circle className="flow-spark-2" cx="528" cy="60" r="3.2" fill="#ffffff" />

        {/* Tus dispositivos: teléfono y laptop */}
        <rect x="792" y="38" width="22" height="40" rx="5" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="799" y1="72" x2="807" y2="72" stroke="#aaaaaa" strokeWidth="1.5" />
        <rect x="824" y="46" width="44" height="26" rx="4" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="816" y1="78" x2="876" y2="78" stroke="#ffffff" strokeWidth="1.5" />
      </svg>

      <div className="mt-4 grid grid-cols-3 text-sm text-silver">
        <span>El sol</span>
        <span className="text-center">La estación</span>
        <span className="text-right">Tu vida</span>
      </div>
    </div>
  );
}
