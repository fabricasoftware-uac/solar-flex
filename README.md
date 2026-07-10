<div align="center">

![Solarion](docs/banner.svg)

<br>

[![React](https://img.shields.io/badge/React_19-0a0a0a?style=for-the-badge&logo=react&logoColor=ffffff)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_7-0a0a0a?style=for-the-badge&logo=vite&logoColor=ffffff)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-0a0a0a?style=for-the-badge&logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-0a0a0a?style=for-the-badge&logo=tailwindcss&logoColor=ffffff)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-0a0a0a?style=for-the-badge&logo=greensock&logoColor=ffffff)](https://gsap.com)

Landing inmersiva para **Solarion**, energía solar portátil hecha en Popayán, Colombia.

</div>

<br>

![](docs/divider.svg)

## La experiencia

Toda la página vive en blanco y negro, los cinco tonos exactos de la guía de marca. El color existe, pero hay que ganárselo: el cursor es una linterna que lo revela al pasar sobre cada imagen.

El scroll cuenta una historia. Se entra por una puerta que pide deslizar (con un golpe de sonido espacial sintetizado en Web Audio, sin un solo mp3), el titular rota frases letra a letra, el producto se presenta con la foto anclada mientras sus pilares se encienden, los territorios se recorren en un viaje horizontal con palabras fantasma cruzando en paralaje, la historia se dibuja sobre un cable energizado y el wordmark del cierre se carga letra por letra como una batería. Una batería vertical en el margen marca cuánto llevas: la página se carga contigo.

| | | | | |
|:-:|:-:|:-:|:-:|:-:|
| ![](https://img.shields.io/badge/%20-0A0A0A?style=flat-square) | ![](https://img.shields.io/badge/%20-212121?style=flat-square) | ![](https://img.shields.io/badge/%20-424242?style=flat-square) | ![](https://img.shields.io/badge/%20-AAAAAA?style=flat-square) | ![](https://img.shields.io/badge/%20-FFFFFF?style=flat-square) |
| `#0A0A0A` | `#212121` | `#424242` | `#AAAAAA` | `#FFFFFF` |

![](docs/divider.svg)

## Correr el proyecto

```bash
npm install
npm run dev        # desarrollo en localhost:5173
npm run build      # build de producción
npm run preview    # sirve dist/ en localhost:4173
```

<img src="docs/charge.svg" width="180" alt="">

## Cómo está organizado

```
src/
  animations/      una animación GSAP por archivo, cada una devuelve su cleanup
  components/
    landing/       secciones encapsuladas: hero, manifesto, product, solutions,
                   stats, testimonials, story, cta, nav, footer
    ui/            piezas transversales: puerta de entrada, cursor de luz,
                   velo monocromo, batería de scroll, botón de regreso
  hooks/           useLenis, useAnchorScroll, useSplitReveal, useReducedMotion...
  constants/       todo el copy y los datos reales del negocio en un solo lugar
  lib/             registro de GSAP, referencia de Lenis, sting de audio
  styles/          tokens de marca y base (Tailwind v4)
```

Las reglas de la casa: solo se animan `transform`, `opacity` y `filter`; los canvas se pausan fuera de viewport y limitan su DPR; los loops se detienen al ocultar la pestaña; y absolutamente todo el motion colapsa con `prefers-reduced-motion`. El scroll sostiene 60 fps con margen.

## Verificación

En `scripts/` hay herramientas de QA con puppeteer: capturas a cualquier profundidad de scroll y con el mouse posado donde quieras, medición de FPS por sección y un recorrido E2E que cruza la puerta, espera la rotación del titular y lee la batería de scroll.

```bash
node scripts/fps.mjs
node scripts/verify-gate.mjs
```

<br>

<div align="center">

![](docs/divider.svg)

**Solarion** · Popayán, Cauca, Colombia

</div>
