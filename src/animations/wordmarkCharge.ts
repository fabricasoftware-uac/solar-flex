import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Carga del wordmark: las letras de "Solarion" se llenan de energía
 * una por una (destello blanco con glow) y se asientan en plata,
 * como una batería que termina de cargar. Se dispara UNA sola vez,
 * al entrar en viewport o al pasar el mouse (lo que ocurra primero),
 * y una vez iniciada nunca se interrumpe.
 */
export function createWordmarkCharge(el: HTMLElement): () => void {
  const letters = el.querySelectorAll<HTMLElement>(".wordmark-letter");
  let fired = false;
  let tl: gsap.core.Timeline | null = null;

  const fire = () => {
    if (fired) return;
    fired = true;

    tl = gsap.timeline();
    tl.set(letters, { textShadow: "0 0 0px rgba(255,255,255,0)" })
      .to(letters, {
        color: "#ffffff",
        textShadow: "0 0 34px rgba(255,255,255,0.6)",
        duration: 0.45,
        stagger: 0.11,
        ease: "power2.out",
      })
      .to(
        letters,
        {
          color: "#aaaaaa",
          textShadow: "0 0 0px rgba(255,255,255,0)",
          duration: 1.4,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        "+=0.4",
      );
  };

  const st = ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    once: true,
    onEnter: fire,
  });
  el.addEventListener("pointerenter", fire, { once: true });

  return () => {
    st.kill();
    el.removeEventListener("pointerenter", fire);
    tl?.kill();
  };
}
