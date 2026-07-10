import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Diagnóstico en vivo: visible solo con ?debug en la URL.
 * Siempre imprime la marca de build en consola para descartar caché.
 */
export function DebugBadge() {
  const reduced = useReducedMotion();
  const [info, setInfo] = useState({ triggers: 0, lenis: false, fps: 0 });
  const enabled =
    typeof window !== "undefined" && window.location.search.includes("debug");

  useEffect(() => {
    console.info(
      `[Solarion] build ${__BUILD_TIME__} | prefers-reduced-motion: ${reduced}`,
    );
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    let frames = 0;
    let raf = 0;
    let last = performance.now();

    const loop = (t: number) => {
      frames += 1;
      if (t - last >= 1000) {
        setInfo({
          triggers: ScrollTrigger.getAll().length,
          lenis: document.documentElement.classList.contains("lenis"),
          fps: frames,
        });
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[90] rounded-lg border border-graphite bg-carbon/90 px-4 py-3 font-body text-xs text-light">
      <p>build: {__BUILD_TIME__}</p>
      <p>reduced-motion: {String(reduced)}</p>
      <p>scrolltriggers: {info.triggers}</p>
      <p>lenis: {String(info.lenis)}</p>
      <p>fps: {info.fps}</p>
    </div>
  );
}
