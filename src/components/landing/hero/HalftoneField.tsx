import { useEffect, useRef } from "react";
import { useMouse } from "@/hooks/useMouse";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, lerp } from "@/utils/math";

interface HalftoneFieldProps {
  className?: string;
  /** Progreso de scroll [0,1] escrito desde fuera (ref mutable) */
  scrollProgress?: React.RefObject<number>;
  /** Separación entre puntos en px (menor = más denso) */
  gap?: number;
  /** Multiplicador global de brillo [0,1] */
  intensity?: number;
  /** Deriva con el scroll: el patrón se desplaza al scrollear */
  drift?: boolean;
}

/**
 * El motivo identitario de Solarion (ondas de puntos halftone) como
 * sistema vivo. Optimizado: sprite pre-renderizado estampado con
 * drawImage, rAF solo con el canvas en viewport y pestaña visible,
 * DPR limitado a 1.5. Con drift, el campo entero se desplaza con el
 * scroll para que el fondo respire al navegar.
 */
export function HalftoneField({
  className,
  scrollProgress,
  gap = 28,
  intensity = 1,
  drift = false,
}: HalftoneFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useMouse();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let inViewport = false;
    let tabVisible = true;
    let running = false;
    let xs: number[] = [];
    let ys: number[] = [];
    let lastT = 0;
    // Luz del cursor con inercia, para que el brillo "persiga" al mouse
    const light = { x: -9999, y: -9999 };
    // Ondas expansivas: gotas de energía que recorren el campo (drift)
    const ripples = [
      { x: 0, y: 0, start: -99999 },
      { x: 0, y: 0, start: -99999 },
    ];
    let rippleNext = 2200;
    let rippleIdx = 0;

    const BASE_R = 1.15;
    const SPRITE = 64;

    // Sprite: un círculo blanco nítido que luego se escala por punto
    const sprite = document.createElement("canvas");
    sprite.width = SPRITE;
    sprite.height = SPRITE;
    const sctx = sprite.getContext("2d")!;
    sctx.fillStyle = "#ffffff";
    sctx.beginPath();
    sctx.arc(SPRITE / 2, SPRITE / 2, SPRITE / 2, 0, Math.PI * 2);
    sctx.fill();

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      xs = [];
      ys = [];
      for (let x = 0; x <= width + gap; x += gap) xs.push(x);
      for (let y = 0; y <= height + gap; y += gap) ys.push(y);
    };

    const draw = (t: number) => {
      const dt = lastT === 0 ? 16 : Math.min(60, t - lastT);
      lastT = t;
      ctx.clearRect(0, 0, width, height);
      const time = reduced ? 0 : t * 0.00055;
      const scroll = scrollProgress?.current ?? 0;

      // Nace una nueva onda cada pocos segundos en un punto aleatorio
      if (drift && !reduced) {
        rippleNext -= dt;
        if (rippleNext <= 0) {
          ripples[rippleIdx] = {
            x: Math.random() * width,
            y: Math.random() * height,
            start: t,
          };
          rippleIdx = (rippleIdx + 1) % ripples.length;
          rippleNext = 3600 + Math.random() * 2800;
        }
      }
      // Flujo continuo + empuje del scroll: los puntos viajan siempre,
      // y el scroll acelera visiblemente la corriente
      const yShift =
        drift && !reduced ? (t * 0.02 + window.scrollY * 0.22) % gap : 0;
      const phase = drift && !reduced ? window.scrollY * 0.0016 : 0;

      if (!reduced) {
        const rect = canvas.getBoundingClientRect();
        light.x = lerp(light.x, mouse.current.x - rect.left, 0.08);
        light.y = lerp(light.y, mouse.current.y - rect.top, 0.08);
      }

      for (let i = 0; i < xs.length; i++) {
        const x = xs[i];
        const wx1 = x * 0.011 + time * 2.1 + phase;
        const wx2 = x * 0.006;
        for (let j = 0; j < ys.length; j++) {
          const y = ys[j] - yShift;

          // Dos ondas cruzadas producen el patrón de interferencia de la guía
          const wave =
            (Math.sin(wx1 + y * 0.004) +
              Math.sin(y * 0.014 - time * 1.6 + wx2 + phase)) *
            0.5;

          const dx = x - light.x;
          const dy = y - light.y;
          const distSq = dx * dx + dy * dy;
          const glow = reduced || distSq > 67600 ? 0 : 1 - Math.sqrt(distSq) / 260;

          // Las ondas expansivas hinchan los puntos a su paso
          let ripple = 0;
          if (drift && !reduced) {
            for (const rp of ripples) {
              const age = (t - rp.start) / 1000;
              if (age < 0 || age > 3) continue;
              const ring = age * 250;
              const d = Math.abs(Math.hypot(x - rp.x, y - rp.y) - ring);
              if (d < 85) {
                const k = (1 - d / 85) * (1 - age / 3);
                if (k > ripple) ripple = k;
              }
            }
          }

          const r =
            BASE_R + wave * 1.15 + glow * 2.4 + ripple * 2.6 - scroll * 0.9;
          if (r < 0.2) continue;

          // Parpadeo estelar individual: el campo respira como cielo
          const twinkle =
            drift && !reduced
              ? 0.72 + 0.38 * Math.sin(t * 0.0013 + x * 0.017 + y * 0.023)
              : 1;
          ctx.globalAlpha =
            clamp(0.1 + wave * 0.1 + glow * 0.55 + ripple * 0.45, 0.03, 0.85) *
            intensity *
            twinkle;
          ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      const shouldRun = inViewport && tabVisible && !reduced;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);
    resize();
    if (reduced) draw(0);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mouse, reduced, scrollProgress, gap, intensity, drift]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
