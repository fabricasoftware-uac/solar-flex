# Solarion

Landing inmersiva de Solarion: energía solar portátil e inteligente, diseñada en Popayán, Colombia.

Identidad basada en `GuiaMarca.pdf`: paleta monocromática (negro carbón `#0A0A0A` a blanco digital `#FFFFFF`), formas orgánicas y el patrón de ondas halftone de la marca convertido en sistema interactivo.

## Stack

- React 19 + Vite 7 + TypeScript
- TailwindCSS v4 (tokens de marca en `src/styles/index.css`)
- GSAP + ScrollTrigger (scrolltelling), SplitType (tipografía cinética), Lenis (scroll suave)
- Tipografías: Comfortaa Variable (display, eco de Ibrand) y Outfit Variable (texto, eco de Geom)

## Comandos

```bash
npm install
npm run dev       # desarrollo
npm run build     # build de producción
npm run preview   # servir dist/

# screenshot headless (requiere Chrome):
node scripts/screenshot.mjs http://localhost:4173/ out.png [scrollY] [width] [height]
```

## Estructura

```
src/
  animations/    una animación GSAP por archivo (scrub, pin, pan, draw...)
  components/
    landing/     secciones encapsuladas (hero, manifesto, product, solutions,
                 stats, testimonials, story, cta, nav, footer)
    ui/          piezas reutilizables (cursor, botón magnético, preloader...)
  constants/     todo el copy y datos reales del negocio
  hooks/         useLenis, useMouse, useReducedMotion, useSplitReveal
  layouts/       RootLayout (nav + footer + cursor + grain + Lenis)
  lib/           registro central de GSAP
  pages/         Landing (orquesta la narrativa de scroll)
  styles/        tokens de marca + base
  types/         contratos de datos
  utils/         helpers puros
```

Accesibilidad: toda la capa de motion respeta `prefers-reduced-motion`; el cursor personalizado solo se activa con puntero fino.

El sitio anterior (template Bootstrap "SolarFlex") quedó preservado en `legacy/`.
