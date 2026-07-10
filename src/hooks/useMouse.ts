import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface MousePosition {
  x: number;
  y: number;
  /** Normalizado a [-1, 1] respecto al centro del viewport */
  nx: number;
  ny: number;
}

/**
 * Posición del mouse SIN estado de React: escribe en un ref mutable
 * que los loops de animación leen cada frame. Cero re-renders.
 */
export function useMouse(): RefObject<MousePosition> {
  const mouse = useRef<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.nx = (e.clientX / innerWidth) * 2 - 1;
      mouse.current.ny = (e.clientY / innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return mouse;
}
