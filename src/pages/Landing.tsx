import { useEffect, useState } from "react";
import { createReveals } from "@/animations/reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IntroGate } from "@/components/ui/IntroGate";
import { Hero } from "@/components/landing/hero/Hero";
import { Manifesto } from "@/components/landing/manifesto/Manifesto";
import { Product } from "@/components/landing/product/Product";
import { Solutions } from "@/components/landing/solutions/Solutions";
import { Stats } from "@/components/landing/stats/Stats";
import { Testimonials } from "@/components/landing/testimonials/Testimonials";
import { Story } from "@/components/landing/story/Story";
import { CTASection } from "@/components/landing/cta/CTASection";

/**
 * Narrativa de scroll: amanecer (hero) -> manifiesto -> el producto ->
 * los territorios -> la prueba (cifras y voces) -> la historia -> el
 * cierre (el sol vuelve a salir en el CTA).
 */
export function Landing() {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  // Entradas direccionales para todo elemento marcado con data-reveal.
  // Bajo prefers-reduced-motion degrada a fade puro, nunca a página muerta.
  useEffect(() => {
    return createReveals(document, { fadeOnly: reduced });
  }, [reduced]);

  return (
    <>
      <IntroGate onComplete={() => setReady(true)} />
      <Hero ready={ready} />
      <Manifesto />
      <Product />
      <Solutions />
      <Stats />
      <Testimonials />
      <Story />
      <CTASection />
    </>
  );
}
