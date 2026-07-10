import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SolarionMark } from "@/components/ui/SolarionMark";
import { playIntroSting, primeAudio } from "@/lib/introSting";
import { lenisRef } from "@/lib/lenisRef";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface IntroGateProps {
  onComplete: () => void;
}

/**
 * Puerta de entrada: el isotipo emerge de la oscuridad, un haz de luz
 * lo recorre y queda latiendo con ondas de sonar mientras la página
 * espera. Al primer scroll (o tecla/click): sting espacial, las ondas
 * estallan, un destello de sol y la cortina sube revelando el hero.
 * El scroll queda bloqueado hasta atravesarla.
 */
export function IntroGate({ onComplete }: IntroGateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const openedRef = useRef(false);
  const armedRef = useRef(false);

  // Bloquea el scroll mientras la puerta está cerrada: Lenis se detiene
  // por completo (las ruedas no acumulan NADA) y el audio se desbloquea
  // en el primer gesto real para que el sting suene siempre
  useEffect(() => {
    if (reduced) return;
    document.documentElement.classList.add("overflow-hidden");

    // Lenis se monta en un effect padre: reintenta hasta encontrarlo
    let stopTimer = 0;
    const tryStop = () => {
      if (openedRef.current) return;
      const lenis = lenisRef.current;
      if (lenis) lenis.stop();
      else stopTimer = window.setTimeout(tryStop, 80);
    };
    tryStop();

    const prime = () => primeAudio();
    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", prime, opts);
    window.addEventListener("keydown", prime);
    window.addEventListener("touchstart", prime, opts);

    return () => {
      window.clearTimeout(stopTimer);
      document.documentElement.classList.remove("overflow-hidden");
      window.removeEventListener("pointerdown", prime);
      window.removeEventListener("keydown", prime);
      window.removeEventListener("touchstart", prime);
    };
  }, [reduced]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (reduced) {
        gsap.set(root, { display: "none" });
        onComplete();
        return;
      }

      // Acto 1: nace la marca
      const tl = gsap.timeline({
        onComplete: () => {
          armedRef.current = true;
        },
      });
      tl.fromTo(
        ".gate-mark",
        { scale: 0.6, autoAlpha: 0, rotate: -20 },
        { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.9, ease: "power3.out" },
      )
        .fromTo(
          ".gate-beam",
          { xPercent: -120 },
          { xPercent: 220, duration: 0.7, ease: "power2.inOut" },
          "-=0.3",
        )
        .fromTo(
          ".gate-cue",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.1",
        );

      // Respiración de la marca + ondas de sonar mientras espera
      gsap.to(".gate-mark", {
        scale: 1.06,
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        ".gate-ring",
        { scale: 0.55, autoAlpha: 0.5 },
        {
          scale: 1.6,
          autoAlpha: 0,
          duration: 2.4,
          stagger: 0.8,
          repeat: -1,
          ease: "power1.out",
        },
      );
      // La línea del cue gotea hacia abajo en bucle
      gsap.fromTo(
        ".gate-drop",
        { yPercent: -100 },
        { yPercent: 100, duration: 1.4, repeat: -1, ease: "power2.inOut" },
      );
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  // Acto 2: el usuario cruza la puerta
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const open = () => {
      if (openedRef.current || !armedRef.current) return;
      openedRef.current = true;

      try {
        playIntroSting();
      } catch {
        // sin audio no se detiene la experiencia
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { display: "none" });
          document.documentElement.classList.remove("overflow-hidden");
          // Lenis estuvo detenido durante la puerta (cero acumulación);
          // resetea a 0 y reactívalo justo al revelar el hero
          lenisRef.current?.scrollTo(0, { immediate: true, force: true });
          window.scrollTo(0, 0);
          lenisRef.current?.start();
          onComplete();
        },
      });
      tl.to(".gate-cue", { autoAlpha: 0, y: -10, duration: 0.3 })
        .to(
          ".gate-ring",
          { scale: 3.2, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: "power2.out" },
          0,
        )
        .to(".gate-mark", { scale: 1.7, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, 0)
        .fromTo(
          ".gate-flash",
          { autoAlpha: 0 },
          { autoAlpha: 0.55, duration: 0.35, ease: "power2.in" },
          0.25,
        )
        .to(".gate-flash", { autoAlpha: 0, duration: 0.5 }, 0.6)
        .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 0.45);
    };

    window.addEventListener("wheel", open, { passive: true });
    window.addEventListener("touchmove", open, { passive: true });
    window.addEventListener("pointerdown", open, { passive: true });
    window.addEventListener("keydown", open);

    return () => {
      window.removeEventListener("wheel", open);
      window.removeEventListener("touchmove", open);
      window.removeEventListener("pointerdown", open);
      window.removeEventListener("keydown", open);
    };
  }, [reduced, onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-(--z-preloader) flex flex-col items-center justify-center bg-carbon"
    >
      {/* Ondas de sonar alrededor de la marca */}
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="gate-ring absolute h-56 w-56 rounded-full border border-light/20"
          />
        ))}
        <div className="relative overflow-hidden p-6">
          <SolarionMark className="gate-mark w-20 text-light" />
          <div className="gate-beam absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-light/25 to-transparent" />
        </div>
      </div>

      {/* Invitación a entrar */}
      <div className="gate-cue invisible absolute bottom-12 flex flex-col items-center gap-4">
        <p className="text-sm tracking-wide text-silver">Desliza para comenzar</p>
        <div className="h-10 w-px overflow-hidden bg-graphite/40">
          <div className="gate-drop h-full w-full bg-light" />
        </div>
      </div>

      <div className="gate-flash pointer-events-none absolute inset-0 bg-light opacity-0" />
    </div>
  );
}
