import { useEffect, useRef } from "react";
import { useMouse } from "@/hooks/useMouse";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, lerp } from "@/utils/math";

interface SolarFieldProps {
  className?: string;
  /** Progreso de scroll [0,1]: el sol crece y la escena se desvanece */
  scrollProgress?: React.RefObject<number>;
}

interface Star {
  x: number;
  y: number;
  z: number;
  phase: number;
  /** Velocidad propia de parpadeo */
  tw: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  next: number;
}

interface EnergyParticle {
  /** Ángulo orbital alrededor del sol */
  a: number;
  /** Distancia al núcleo */
  r: number;
  /** Velocidad de caída propia */
  sp: number;
  size: number;
}

/**
 * Espacio profundo de la marca: campo denso de estrellas con
 * profundidad real (paralaje por capas con el mouse), parpadeo
 * individual, estrellas fugaces ocasionales y un sol tenue que late
 * detrás del titular sin robarle contraste. El scroll zoomea hacia
 * el sol y funde la escena.
 */
export function SolarField({ className, scrollProgress }: SolarFieldProps) {
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
    let stars: Star[] = [];
    let particles: EnergyParticle[] = [];
    let last = 0;
    const shift = { x: 0, y: 0 };
    const meteor: Meteor = { x: 0, y: 0, vx: 0, vy: 0, life: 0, next: 2600 };
    // Llamarada solar: estalla cada pocos segundos
    const flare = { t: 1, seed: 0, next: 4200 };

    const SPRITE = 64;
    const sprite = document.createElement("canvas");
    sprite.width = SPRITE;
    sprite.height = SPRITE;
    const sctx = sprite.getContext("2d")!;
    const sg = sctx.createRadialGradient(
      SPRITE / 2, SPRITE / 2, 0,
      SPRITE / 2, SPRITE / 2, SPRITE / 2,
    );
    sg.addColorStop(0, "rgba(255,255,255,1)");
    sg.addColorStop(0.5, "rgba(255,255,255,0.85)");
    sg.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, SPRITE, SPRITE);

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Cielo denso: ~2.5x más estrellas que la versión anterior
      const count = Math.round((width * height) / 3600);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        tw: 0.5 + Math.random() * 1.6,
      }));

      // Polvo de energía: partículas que el sol atrae y absorbe (carga)
      const maxR = Math.hypot(width, height) * 0.5;
      particles = Array.from({ length: 34 }, () => ({
        a: Math.random() * Math.PI * 2,
        r: maxR * (0.25 + Math.random() * 0.75),
        sp: 26 + Math.random() * 40,
        size: 0.7 + Math.random() * 1.1,
      }));
    };

    const spawnMeteor = () => {
      const fromLeft = Math.random() > 0.5;
      meteor.x = fromLeft ? -40 : width * (0.3 + Math.random() * 0.7);
      meteor.y = height * Math.random() * 0.45;
      const speed = 9 + Math.random() * 5;
      meteor.vx = fromLeft ? speed : speed * 0.8;
      meteor.vy = speed * (0.25 + Math.random() * 0.2);
      meteor.life = 1;
      meteor.next = 4000 + Math.random() * 5000;
    };

    const draw = (t: number) => {
      const dt = last === 0 ? 16 : Math.min(48, t - last);
      last = t;
      ctx.clearRect(0, 0, width, height);
      const time = reduced ? 3200 : t;
      const scroll = scrollProgress?.current ?? 0;
      const fade = 1 - scroll * 0.75;
      const vmin = Math.min(width, height);

      if (!reduced) {
        shift.x = lerp(shift.x, mouse.current.nx * 34, 0.045);
        shift.y = lerp(shift.y, mouse.current.ny * 22, 0.045);
      }

      // Estrellas: paralaje por profundidad (las cercanas se mueven más
      // con el mouse), parpadeo a velocidad propia y deriva lentísima
      const driftY = reduced ? 0 : (time * 0.004) % height;
      for (const s of stars) {
        const tw = reduced
          ? 0.55
          : 0.5 + 0.5 * Math.sin(time * 0.001 * s.tw + s.phase);
        let sy = s.y - driftY * s.z * 0.18;
        if (sy < -4) sy += height + 8;
        const sx = s.x + shift.x * s.z;
        const py = sy + shift.y * s.z;

        ctx.globalAlpha = (0.1 + 0.55 * tw) * s.z * fade;
        const size = s.z * (1.1 + tw * 0.9);
        ctx.drawImage(sprite, sx - size, py - size, size * 2, size * 2);
      }

      // Estrella fugaz ocasional
      if (!reduced) {
        if (meteor.life <= 0) {
          meteor.next -= dt;
          if (meteor.next <= 0) spawnMeteor();
        } else {
          meteor.x += meteor.vx * (dt / 16);
          meteor.y += meteor.vy * (dt / 16);
          meteor.life -= dt / 900;
          if (meteor.x > width + 60 || meteor.y > height + 60) meteor.life = 0;

          const a = Math.max(0, meteor.life) * 0.7 * fade;
          if (a > 0.02) {
            const tail = 90;
            const grad = ctx.createLinearGradient(
              meteor.x, meteor.y,
              meteor.x - meteor.vx * (tail / 16), meteor.y - meteor.vy * (tail / 16),
            );
            grad.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`);
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(
              meteor.x - meteor.vx * (tail / 16),
              meteor.y - meteor.vy * (tail / 16),
            );
            ctx.stroke();
          }
        }
      }

      // Sol tenue: luz plateada que late sin lavar el titular. Las
      // llamaradas lo hacen destellar brevemente cada pocos segundos.
      const cx = width * 0.5 + shift.x;
      const cy = height * 0.42 + shift.y;
      if (!reduced) {
        if (flare.t >= 1) {
          flare.next -= dt;
          if (flare.next <= 0) {
            flare.t = 0;
            flare.seed = Math.random() * Math.PI * 2;
            flare.next = 4500 + Math.random() * 4000;
          }
        } else {
          flare.t = Math.min(1, flare.t + dt / 850);
        }
      }
      const flareEnv = flare.t < 1 ? Math.sin(flare.t * Math.PI) : 0;
      const coreR =
        vmin * 0.08 *
        (1 + (reduced ? 0 : 0.05 * Math.sin(time * 0.0015)) + flareEnv * 0.22) *
        (1 + scroll * 1.8);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.6);
      glow.addColorStop(0, `rgba(235,235,235,${(0.34 + flareEnv * 0.2) * fade})`);
      glow.addColorStop(0.3, `rgba(190,190,190,${(0.14 + flareEnv * 0.08) * fade})`);
      glow.addColorStop(0.6, `rgba(140,140,140,${0.05 * fade})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.6, 0, Math.PI * 2);
      ctx.fill();

      // Rayos de la llamarada: destellos radiales efímeros
      if (flareEnv > 0.02) {
        ctx.lineWidth = 1.2;
        for (let k = 0; k < 12; k++) {
          const ang = flare.seed + (k * Math.PI * 2) / 12;
          const inner = coreR * 1.15;
          const outer = coreR * (1.5 + flareEnv * 1.1 + (k % 3) * 0.18);
          ctx.strokeStyle = `rgba(255,255,255,${(flareEnv * 0.35 * fade).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner * 0.94);
          ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer * 0.94);
          ctx.stroke();
        }
      }

      // Polvo de energía cayendo en espiral hacia el sol: la carga solar
      if (!reduced) {
        const maxR = Math.hypot(width, height) * 0.5;
        for (const p of particles) {
          p.r -= (p.sp + 90 * (1 - p.r / maxR)) * (dt / 1000);
          p.a += (dt / 1000) * 0.35 * (1 + (maxR * 0.12) / Math.max(p.r, 40));
          if (p.r < coreR * 1.05) {
            // Absorbida: el sol la "carga" y renace en el borde
            p.r = maxR * (0.72 + Math.random() * 0.32);
            p.a = Math.random() * Math.PI * 2;
          }
          const px = cx + Math.cos(p.a) * p.r;
          const py = cy + Math.sin(p.a) * p.r * 0.92;
          if (px < -6 || px > width + 6 || py < -6 || py > height + 6) continue;
          const near = 1 - p.r / maxR;
          ctx.globalAlpha = clamp(0.12 + near * 0.6, 0, 0.72) * fade;
          const s = p.size * (0.8 + near * 1.3);
          ctx.drawImage(sprite, px - s, py - s, s * 2, s * 2);
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
        last = 0;
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
  }, [mouse, reduced, scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
