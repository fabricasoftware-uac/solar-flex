import { useRef } from "react";
import { CONTACT, CTA } from "@/constants/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HalftoneField } from "@/components/landing/hero/HalftoneField";
import { useSplitReveal } from "@/hooks/useSplitReveal";

/**
 * Cierre: el campo halftone regresa (el sol vuelve a salir) detrás de
 * un titular gigante y el único CTA de compra de la página.
 */
export function CTASection() {
  const headlineRef = useSplitReveal<HTMLHeadingElement>({ stagger: 0.12 });
  const progress = useRef(0);

  return (
    <section id="contacto" className="relative overflow-hidden bg-carbon py-40 md:py-56">
      <HalftoneField scrollProgress={progress} className="opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-carbon via-transparent to-carbon" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2
          ref={headlineRef}
          className="font-display text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[1.05] text-light"
        >
          {CTA.headline}
        </h2>
        <p
          data-reveal="up"
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-silver"
        >
          {CTA.sub}
        </p>
        <div data-reveal="zoom" data-reveal-delay="0.15" className="mt-12 flex justify-center">
          <MagneticButton
            href={`mailto:${CONTACT.email}?subject=Quiero%20mi%20estaci%C3%B3n%20Solarion`}
          >
            Adquiere la tuya
          </MagneticButton>
        </div>
        <p data-reveal="up" data-reveal-delay="0.3" className="mt-10 text-silver">
          {CONTACT.phone}
          <span className="text-graphite"> &middot; </span>
          {CONTACT.location}
        </p>
      </div>
    </section>
  );
}
