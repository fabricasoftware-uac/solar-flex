import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  href: string;
  variant?: "solid" | "ghost";
  className?: string;
}

/**
 * CTA magnético: el botón se inclina hacia el cursor y vuelve con
 * física elástica al salir. En reduced-motion es un enlace normal.
 */
export function MagneticButton({
  children,
  href,
  variant = "solid",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    if (reduced || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.35)",
    });
  };

  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-4 font-body text-base font-medium transition-colors duration-300 active:scale-[0.98]";
  const styles =
    variant === "solid"
      ? "bg-light text-carbon hover:bg-silver"
      : "border border-graphite text-light hover:border-silver";

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
