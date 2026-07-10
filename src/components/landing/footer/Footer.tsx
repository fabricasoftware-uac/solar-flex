import { useEffect, useRef } from "react";
import { CONTACT, NAV_LINKS, SOCIAL } from "@/constants/content";
import { SolarionMark } from "@/components/ui/SolarionMark";
import { createWordmarkCharge } from "@/animations/wordmarkCharge";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Cierre editorial: wordmark gigante que se carga de energía letra
 *  a letra, y datos reales de contacto. */
export function Footer() {
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el || reduced) return;
    return createWordmarkCharge(el);
  }, [reduced]);

  return (
    <footer className="border-t border-coal">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div data-reveal="left">
            <SolarionMark className="w-10 text-light" />
            <p className="mt-4 max-w-xs leading-relaxed text-silver">
              Energía solar portátil e inteligente, diseñada en Colombia.
            </p>
          </div>

          <nav aria-label="Enlaces del sitio" data-reveal="up" data-reveal-delay="0.12">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block text-silver transition-all duration-300 hover:translate-x-1.5 hover:text-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-reveal="right" data-reveal-delay="0.24" className="flex flex-col gap-3 text-silver">
            <a
              href={`mailto:${CONTACT.email}`}
              className="transition-colors duration-300 hover:text-light"
            >
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="transition-colors duration-300 hover:text-light"
            >
              {CONTACT.phone}
            </a>
            <p>{CONTACT.location}</p>
            <div className="mt-2 flex gap-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-graphite transition-colors duration-300 hover:text-light"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p
          ref={wordmarkRef}
          aria-hidden="true"
          data-reveal="zoom"
          className="mt-20 select-none text-center font-display text-[clamp(4rem,16vw,15rem)] font-bold leading-none tracking-tight text-coal"
        >
          {"Solarion".split("").map((letter, i) => (
            <span key={i} className="wordmark-letter inline-block">
              {letter}
            </span>
          ))}
        </p>

        <p className="mt-8 text-center text-sm text-graphite">
          &copy; {new Date().getFullYear()} Solarion. Popayán, Colombia.
        </p>
      </div>
    </footer>
  );
}
