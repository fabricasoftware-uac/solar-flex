import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/constants/content";
import { SolarionMark } from "@/components/ui/SolarionMark";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Nav mínima fija: isotipo + enlaces. Se esconde al bajar y reaparece
 * al subir para no competir con la narrativa. Menú overlay en mobile.
 */
export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || reduced) return;

    // Entrada: la nav baja cuando el preloader termina de revelar el hero
    const intro = gsap.fromTo(
      nav,
      { yPercent: -120, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 1, delay: 3.1, ease: "power3.out" },
    );

    const show = gsap.quickTo(nav, "yPercent", {
      duration: 0.6,
      ease: "power3.out",
    });

    const st = ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        show(self.direction === 1 && self.scroll() > 140 ? -110 : 0);
      },
    });

    return () => {
      intro.kill();
      st.kill();
    };
  }, [reduced]);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-(--z-nav) mix-blend-difference"
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
          <a href="#" aria-label="Solarion, inicio" className="flex items-center gap-3 text-light">
            <SolarionMark className="w-8" />
            <span className="font-display text-xl font-bold tracking-tight">
              Solarion
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative text-sm text-light/80 transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-light after:transition-transform after:duration-300 hover:text-light hover:after:origin-left hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`h-px w-6 bg-light transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-light transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </nav>
      </header>

      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-carbon px-8 transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-bold text-light"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
